const nodemailer = require("nodemailer");

module.exports = {
  generateOTP: () => {
    let OTP = "";
    for (let i = 0; i <= 5; i++) {
      OTP += Math.round(Math.random() * 9);
    }

    return OTP;
  },
  sendEmail: (email, subject, message) => {
    var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: message,
    });
  },
};
