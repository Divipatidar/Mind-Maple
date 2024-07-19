import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const chatHistSchema = new Schema({
  // User information
  userId: {
    type: String,
    required: true,
  },
  // Chat details
  timestamp: {
    type: Date,
    default: () => Date.now(),
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

export default model("ChatHist", chatHistSchema);