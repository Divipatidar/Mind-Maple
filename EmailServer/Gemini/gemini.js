import { GoogleGenerativeAI } from "@google/generative-ai";
import { renderMarkdown } from "../Util/render.js";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = "AIzaSyAKxRH-R-7JShHxqroG2zj6QHTn1pj-_zo";

const genAI = new GoogleGenerativeAI(API_KEY);


export async function getArticles(keywords){
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    let prompt = "Provide summaries of 5 well-sourced articles from reputable mental health organizations like NAMI or Mayo Clinic that could motivate someone. Focus on real-life stories or practical advice. Use the keywords: " + String(keywords) + " as search terms. Include details like the article title, organization name, and a brief overview of the content and give me correct formate also";
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return renderMarkdown(text);
}

