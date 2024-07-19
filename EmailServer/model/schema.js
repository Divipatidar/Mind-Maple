import { default as mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
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
    default: ()=>Date.now(),
  },
  totalmail: {
    type: Number,
    default: 0,
  },
  reportId: {
    type: mongoose.Types.ObjectId,
  },
});


const reportSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
      },
      keywords: {
        type: [String],
      },
      analysis: {
        type: String,
      },
      timestamp: {
        type: Date,
        default:()=> Date.now,
      },
})
export const User = new mongoose.model('User',userSchema)
export const Report =  new mongoose.model('Report',reportSchema)

