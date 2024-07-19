import { createTransport } from 'nodemailer'

 export class Email{
     transporter
     email
    constructor(service,email,pass){
        this.email = email
         this.transporter = createTransport({
            service : service,
            secure : false,
            tls : {
                rejectUnauthorized : false
            },
            auth : {
                user : email,
                pass : pass
            }
        })
        
    }
    async sendEmail(email,dataToSend){
        try {
            const info = await this.transporter.sendMail({
                from : this.email,
                to : email,
                subject : "MindMaple Update",
                text : "HEHE",
                html : dataToSend
            })
            return true
        } catch (error) {
            console.log("Error Sending the mail")
            return false;
        }
    }
}