const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log("Database Connected");
    } catch (err) {
        console.log("Error connecting the DB:", err);
    }
}

module.exports = {
    connectDB
};
