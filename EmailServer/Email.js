const nodemailer = require("nodemailer");

class Email {
  transporter;
  email;
  constructor(service, email, pass) {
    this.email = email;
    console.log("in email.js", email);
    this.transporter = nodemailer.createTransporter({
      service: service,
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: email,
        pass: pass,
      },
    });
  }

  async sendEmail(email, dataToSend) {
    try {
      const info = await this.transporter.sendMail({
        from: this.email,
        to: email,
        subject: "MindMaple Update",
        text: "HEHE",
        html: dataToSend,
      });
      return true;
    } catch (error) {
      console.log("Error Sending the mail from nodemailer ", error);
      return false;
    }
  }
}

module.exports = {
  Email,
};