const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendMail = (emailData, senderDetails) => {
  const { email } = senderDetails;
  const mailPassword = process.env.MAIL_PASSWORD;
  const senderEmail = process.env.SENDER_MAIL;

  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: senderEmail,
        pass: mailPassword,
      },
    });

    const mailOptions = {
      from: `Zaiem <${senderEmail}>`,
      to: email,
      subject: emailData.subject,
      html: emailData.content,
    };

    console.log("sending mail to", email);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
        console.log("sending mail to", email, "Failed");
        return;
      }

      conosle.log("Mail sent to", email);
      return;
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { sendMail };
