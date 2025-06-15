const { connect } = require("mongoose");
require('dotenv').config();

async function connectDB() {
  try {
    await connect(`${process.env.MONGO_URL}`);
    console.log("DB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    
  }
}

module.exports = { connectDB };
