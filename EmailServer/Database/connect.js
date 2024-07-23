const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://divyasmindmaple:Divi%40442@cluster0.xwyxh7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Database Connected");
    } catch (err) {
        console.log("Error connecting the DB:", err);
    }
}

module.exports = {
    connectDB
};
