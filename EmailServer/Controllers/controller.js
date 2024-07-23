const { Email } = require('../Email.js');
const { getArticles } = require('../Gemini/gemini.js');
const { getUsersfromDB, getReportfromDB } = require('../Database/db.js');
const { makeEmailData } = require('../Util/Data.js');
const { welcomeEmail } = require('../Util/welcome.js');
require('dotenv').config();

const email = new Email(`${process.env.PORT}`,`${process.env.EMAIL}` , `${process.env.PASSWORD}`);

async function sendEmailToClients(req, res) {
    try {
        const emailId = req.body?.emailId;
        const data = req.body?.data;
        console.log(`emailId: ${emailId}, data: ${data}`);

        if (!emailId || !data) {
            res.sendStatus(400);
            return;
        }
        const emailSent = await email.sendEmail(emailId, data);
        console.log(`Email sent status: ${emailSent}`);

        if (emailSent) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }

    } catch (error) {
        res.sendStatus(500);
    }
}

async function sendWelcomeEmail(req, res) {
    try {
        console.log('sendWelcomeEmail called');

        const emailId = req.body?.emailId;
        const score = req.body.score;
        const analysis = req.body.analysis;
        const keywords = req.body.keywords;
        console.log(`emailId: ${emailId}, score: ${score}, analysis: ${analysis}, keywords: ${keywords}`);

        if (!emailId || !score || !analysis || !keywords) {
            res.sendStatus(400);
            return;
        }

        const articles = await getArticles(keywords);
        console.log(`Articles retrieved: ${articles.length}`);

        const EmailToSend = welcomeEmail(score, analysis, articles);
        console.log(`Email content created: ${EmailToSend}`);

        const emailSent = await email.sendEmail(emailId, EmailToSend);
        console.log(`Email sent status: ${emailSent}`);

        if (emailSent) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }

    } catch (error) {
        res.sendStatus(500);
    }
}

async function sendScheduledEmails(req, res) {
    try {
        // Pick data query
        const data = await getUsersfromDB();
        console.log(`Users retrieved: ${data.length}`);

        for (let doc of data) {
            // Get email 
            const userId = doc._id;
            console.log(`Processing user: ${userId}`);

            const report = await getReportfromDB(userId);
            let emailData = '';
            if (report !== null) {
                emailData = await getArticles(report[0].keywords);
            }
            const EmailToSend = makeEmailData(emailData, report[0].keywords);
            console.log(`Email content for user ${userId}: ${EmailToSend}`);

            const emailSent = await email.sendEmail(doc.email, EmailToSend);
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    sendEmailToClients,
    sendWelcomeEmail,
    sendScheduledEmails
};
