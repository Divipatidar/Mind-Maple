const { startGeminiChat } = require("../gemini/chat");
const chatHist = require("../model/ChatHist");
const { analysisKeywordsPrompt, analysisScorePrompt, analysisReportPrompt } = require("../gemini/analysisPrompt");
const Report = require("../model/Report");
const User = require("../model/User");
const axios = require("axios");

const doAnalysis = async (req, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ Error: "UserId not found" });
      return;
    }
    const userId = req.userId;
    const analysis = await genAnalysis(userId);

    if (analysis?.info === "nodata") {
      res.status(200).json({ msg: "nochatdata" });
      return;
    }

    const reportDatas = await Report.create({
      userId: userId,
      keywords: analysis.keywords,
      analysis: analysis.report,
      score: analysis.score,
    });
    try {
      const user = await User.findOne({ id: userId });
      console.log("User found:", user);

      axios.post('https://mind-maple.vercel.app/welcomeEmail', {
        "emailId": user.email,
        "score": analysis.score,
        "analysis": analysis.report,
        "keywords": analysis.keywords
      });
    } catch (error) {
      console.log("error sending the message");
    }
    console.log("message sending successful");
    res.status(200).json({ data: reportDatas });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const genAnalysis = async (userId) => {
  try {
    if (userId === undefined) {
      return;
    }
    const foundHist = await chatHist.find({ userId: userId }).sort({ timestamp: 1 });

    if (foundHist.length === 0) {
      return { info: "nodata" };
    }

    let foundHistForGemini = [];
    for (let conv of foundHist) {
      foundHistForGemini.push({
        role: "user",
        parts: [{ text: conv.prompt }],
      });
      foundHistForGemini.push({
        role: "model",
        parts: [{ text: conv.response }],
      });
    }
    console.log("analysisReportPrompt", analysisReportPrompt);

    let chat = startGeminiChat(foundHistForGemini);
    let result = await chat.sendMessage(analysisReportPrompt);
    let response = await result.response;
    let report = response.text();

    console.log("analysisScorePrompt", analysisScorePrompt);
    chat = startGeminiChat(foundHistForGemini);
    result = await chat.sendMessage(analysisScorePrompt);
    response = await result.response;
    const score = response.text();

    console.log("analysisKeywordsPrompt", analysisKeywordsPrompt);
    chat = startGeminiChat(foundHistForGemini);
    result = await chat.sendMessage(analysisKeywordsPrompt);
    response = await result.response;
    const keywordsResp = response.text();
    const keywords = keywordsResp
      .replace(/[^a-zA-Z0-9 \n]/g, "")
      .trim()
      .split("\n")
      .map((kw) => kw.trim())
      .filter(
        (kw) =>
          kw.length !== 0 &&
          kw.toLowerCase() !== "keyword" &&
          kw.toLowerCase() !== "keywords"
      );

    return { report, score, keywords };
  } catch (error) {
    console.error(error);
  }
};

const getAnalysis = async (req, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ msg: "UserId not found" });
      return;
    }
    const userId = req.userId;

    const reports = await Report.find({ userId: userId }).sort({ timestamp: -1 });

    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  doAnalysis,
  genAnalysis,
  getAnalysis
};
