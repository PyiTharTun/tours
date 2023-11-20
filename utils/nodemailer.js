const nodemailer = require("nodemailer");

const sendEmail = async (options) =>{
    //1. Setup
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port:process.env.MAIL_PORT,
        auth:{
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS, //wmvdsrmruzppelcr
        },
    });

    //2. Options - to who, from , subject, message
    const mailOptions = {
        from: "natours",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    console.log(mailOptions);

    //3. send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;