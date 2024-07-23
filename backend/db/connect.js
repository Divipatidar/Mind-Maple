const { connect } = require("mongoose");

async function connectDB() {
  try {
    await connect('mongodb+srv://divyasmindmaple:Divi%40442@cluster0.xwyxh7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("DB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    // Consider throwing or exiting the process if connection failure is critical
  }
}

module.exports = { connectDB };
