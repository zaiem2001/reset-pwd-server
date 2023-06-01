const nodeMailer = require("nodemailer");

const sendMail = (emailData, senderDetails) => {
  const { email } = senderDetails;

  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "zaiem.180410116045@gmail.com",
        pass: "xujadgmwcfcgxjsy",
      },
    });

    const mailOptions = {
      from: "Zaiem <zaiem.180410116045@gmail.com>",
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
