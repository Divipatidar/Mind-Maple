import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
  },
  lastmail: {
    type: Date,
    default: null,
  },
  totalmail: {
    type: Number,
    default: 0,
  },
});

export default model("User", userSchema);