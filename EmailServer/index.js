import express, { json, urlencoded } from 'express'
import { schedule } from 'node-cron'
import { sendWelcomeEmail, sendScheduledEmails } from './Controllers/controller.js'
import {connectDB }from './Database/connect.js'

schedule('*/1 * * * *',()=>{
    //Pick data from Database and send emails to users
    async function sendMails(){
        console.log("Scheduled task started");

        await sendScheduledEmails()
        console.log("DOne");

    }
    sendMails()
},{
    timezone : 'Asia/Kolkata'
})

const app = express()
const port=4000;
app.use(json())
app.use(urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.status(200).json({"message" : "Hello"})
})

app.post('/welcomeEmail',sendWelcomeEmail)
connectDB()


app.listen(port,()=>{
    console.log("Server Started",port);
})