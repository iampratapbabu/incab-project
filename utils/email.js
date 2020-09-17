const nodemailer = require('nodemailer');


const sendEmail = async (options) =>{

//creating transporter
const transPorter = nodemailer.createTransport({
  // host:process.env.EMAIL_HOST,
  // port:process.env.EMAIL_PORT,
  host: 'smtp.gmail.com',
   port: 587,
   secure: false,
  auth:{
    user:process.env.GMAIL_USERNAME,
    pass:process.env.GMAIL_PASSWORD
  }
});

//defining the email options like what to send
const mailOptions = {
  from:'Tej Pratap <pratapbabu.1111@gmail.com',
  to:options.email,
  subject:options.subject,
  text:options.message,
//html:""  here you can write html code
};

//sending the mail
await(transPorter).sendMail(mailOptions);

};

module.exports = sendEmail;
