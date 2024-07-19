import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const reportSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  keywords: [
    {
      type: String,
    },
  ],
  analysis: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: () => Date.now(),
  },
});

export default model("Report", reportSchema);