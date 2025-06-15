const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatHistSchema = new Schema({
  
  userId: {
    type: String,
    required: true,
  },
  
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

module.exports = mongoose.model("ChatHist", chatHistSchema);
