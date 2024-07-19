import { Email } from '../Email.js';
import { getArticles } from '../Gemini/gemini.js';
import { getUsersfromDB, getReportfromDB } from '../Database/db.js';
import { makeEmailData } from '../Util/Data.js';
import { welcomeEmail } from '../Util/welcome.js';


const email = new Email('Gmail','patidardivya442@gmail.com','ugtj emwh otjc ifsu');

 export async function sendEmailToClients(req,res){
    try {
        const emailId =  req.body?.emailId
        const data = req.body?.data
        console.log(`emailId: ${emailId}, data: ${data}`);

        if(!emailId || !data){
            res.sendStatus(400)
            return;
        }
        const emailSent = await email.sendEmail(emailId,data)
        console.log(`Email sent status: ${emailSent}`);

        if(emailSent){
            res.sendStatus(200)
        }
        else{
            res.sendStatus(500)
        }

    } catch (error) {
        res.sendStatus(500)
    }
}

 export async function sendWelcomeEmail(req,res){
    try {
        console.log('sendWelcomeEmail called');

        const emailId = req.body?.emailId
        const score = req.body.score
        const analysis =  req.body.analysis
        const keywords = req.body.keywords
        console.log(`emailId: ${emailId}, score: ${score}, analysis: ${analysis}, keywords: ${keywords}`);

        if(!emailId || !score || !analysis || !keywords){
            res.sendStatus(400)
            return;
        }

        const articles = await getArticles(keywords)
        console.log(`Articles retrieved: ${articles.length}`);

        
        const EmailToSend = welcomeEmail(score,analysis,articles)
        console.log(`Email content created: ${EmailToSend}`);

        const emailSent = await email.sendEmail(emailId,EmailToSend)
        console.log(`Email sent status: ${emailSent}`);

        if(emailSent){
            res.sendStatus(200)
        }
        else{
            res.sendStatus(500)
        }
        
    } catch (error) {
        res.sendStatus(500)
    }
}


 export async function sendScheduledEmails(req,res){
    try {
        //Pick data query
        const data = await getUsersfromDB();
        console.log(`Users retrieved: ${data.length}`);

        for(let doc in data){
            //get email 
            const userId = data[doc]._id
            console.log(`Processing user: ${userId}`);

            
            const report = await getReportfromDB(userId)
            let emailData = ''
            if(report!==null)
             emailData = await getArticles(report[0].keywords)
            const EmailToSend = makeEmailData(emailData,report[0].keywords)
            console.log(`Email content for user ${userId}: ${EmailToSend}`);

            const emailSent = await email.sendEmail(data[doc].email,EmailToSend)
        }
    } catch (error) {
        console.log(error.message)
    }
}

