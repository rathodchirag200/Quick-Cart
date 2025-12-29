const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "chiragsidev@gmail.com",
    pass: process.env.email_app_password,
  },
});

const sendmail = async (email , otp) => {
  try {
    const info = await transporter.sendMail({
      from: "chiragsidev@gmail.com",  
      to: email,
      subject: "your otp code",
      html: `your otp is ${otp}`,
    });


    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email send error:", error);
  }
};

const Genrateotp = () => {
  return Math.floor(1000 + Math.random() * 9000);
}


module.exports = {transporter , sendmail , Genrateotp}
