import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import{ Hist} from "./Hist.js";
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY ="AIzaSyAKxRH-R-7JShHxqroG2zj6QHTn1pj-_zo";

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
];

let geminiModel;

 export const setupGeminiChat = async () => {
  const genAI = new GoogleGenerativeAI(`${API_KEY}`);
  geminiModel = genAI.getGenerativeModel({ model: `${MODEL_NAME }`});
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

 export const startGeminiChat = (history = []) =>
  geminiModel.startChat({
    generationConfig,
    safetySettings,
    history: [...Hist, ...history],
    
  });

export default geminiModel;