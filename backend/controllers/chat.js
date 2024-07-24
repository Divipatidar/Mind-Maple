const { v4: uuid } = require("uuid");
const WebSocket = require("ws");
const { startGeminiChat } = require("../gemini/chat.js");
const ChatHist = require("../model/ChatHist.js");
const querystring = require("querystring");
const spellchecker = require("spellchecker"); // Import spellchecker module

// Function to correct spelling in a string
function correctSpelling(text) {
  return text.split(/\b/)
    .map(word => spellchecker.isMisspelled(word) ? spellchecker.getCorrectionsForMisspelling(word)[0] || word : word)
    .join('');
}

// Extended list of mental health-related keywords or phrases
const mentalHealthKeywords = [
  "mental health", "anxiety", "depression", "stress", "therapy", "counseling", "well-being",
  // other keywords
];

// Function to check if a query is related to mental health
const isRelatedToMentalHealth = (query) => {
  return mentalHealthKeywords.some(keyword => query.toLowerCase().includes(keyword));
};

const connectWithChatBot = async (req, res) => {
  try {
    if (req.userId === undefined) {
      throw new Error("User ID is undefined");
    }

    const foundHist = await ChatHist
      .find({ userId: req.userId })
      .sort({ timestamp: 1 });

    let foundHistForGemini = [];
    for (let conv of foundHist) {
      foundHistForGemini.push({
        role: "user",
        parts: [
          { text: conv.prompt },
        ],
      });
      foundHistForGemini.push({
        role: "model",
        parts: [
          { text: conv.response },
        ],
      });
    }

    const roomId = uuid();
    const websocketserverLink = `wss://websocket-server-mix0.onrender.com/ws?${querystring.stringify({
      id: roomId,
      isServer: true,
    })}`;

    const wss = new WebSocket(websocketserverLink);

    wss.on("open", () => {
      console.log("WebSocket connected");
      res.status(200).json({ chatId: roomId });
      wss.send(JSON.stringify({ type: "server:connected" }));
    });

    const chat = startGeminiChat(foundHistForGemini);

    wss.on("message", async (data) => {
      try {
        data = JSON.parse(data.toString());

        if (data?.type === "client:chathist") {
          wss.send(
            JSON.stringify({ type: "server:chathist", data: foundHist })
          );
        } else if (data?.type === "client:prompt") {
          if (data.prompt === undefined) {
            throw new Error("Prompt is undefined");
          }

          // Correct spelling in the prompt
          const correctedPrompt = correctSpelling(data.prompt);

          if (!isRelatedToMentalHealth(correctedPrompt)) {
            // Send restricted topic message as a normal response
            wss.send(
              JSON.stringify({
                type: "server:response:restricted",
                message: "Our platform is dedicated to providing comprehensive support and resources specifically tailored for mental health topics. If you're looking for assistance related to mental well-being, our app offers a range of tools and information to help you navigate and manage various aspects of mental health.",
              })
            );
            return;
          }

          // Process valid mental health prompts
          const result = await chat.sendMessageStream(correctedPrompt);
          let respText = "";

          wss.send(JSON.stringify({ type: "server:response:start" }));

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();

            wss.send(
              JSON.stringify({
                type: "server:response:chunk",
                chunk: chunkText,
              })
            );
            respText += chunkText;
          }

          wss.send(JSON.stringify({ type: "server:response:end" }));

          // Save chat history to the database
          await ChatHist.create({
            userId: req.userId,
            prompt: correctedPrompt,
            response: respText,
          });

          console.log("Chat history saved successfully:");
        }
      } catch (error) {
        console.error("WebSocket message error:", error.message);
      }
    });

    wss.on("close", () => {
      console.log("WebSocket connection closed");
    });

    wss.on("error", (error) => {
      console.error("WebSocket Error:", error.message);
      res.status(500).send("WebSocket Error");
    });

  } catch (error) {
    console.error("WebSocket connection error:", error.message);
    res.status(500).send("WebSocket connection error");
  }
};

module.exports = {
  connectWithChatBot
};
