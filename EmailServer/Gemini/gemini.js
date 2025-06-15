const { GoogleGenerativeAI } = require('@google/generative-ai');
const { renderMarkdown } = require('../Util/render.js');
require('dotenv').config();

const MODEL_NAME = `${process.env. MODEL_NAME}`;
const API_KEY = `${process.env.API_KEY}`;

const genAI = new GoogleGenerativeAI(API_KEY);

async function getArticles(keywords) {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    let prompt = "Provide summaries of 5 well-sourced articles from reputable mental health organizations like NAMI or Mayo Clinic that could motivate someone. Focus on real-life stories or practical advice. Use the keywords: " + String(keywords) + " as search terms. Include details like the article title, organization name, and a brief overview of the content and give me correct formate also";
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return renderMarkdown(text);
}

module.exports = {
    getArticles
};
