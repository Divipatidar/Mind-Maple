const express = require('express');
const { json, urlencoded } = require('express');
const { schedule } = require('node-cron');
const { sendWelcomeEmail, sendScheduledEmails } = require('./Controllers/controller');
const { connectDB } = require('./Database/connect');

schedule('*/1 * * * *', () => {
    // Pick data from Database and send emails to users
    async function sendMails() {
        console.log("Scheduled task started");

        await sendScheduledEmails();
        console.log("Done");
    }
    sendMails();
}, {
    timezone: 'Asia/Kolkata'
});

const app = express();
const port = 4000;
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ "message": "Hello" });
});

app.post('/welcomeEmail', sendWelcomeEmail);
connectDB();

app.listen(port, () => {
    console.log("Server Started", port);
});
