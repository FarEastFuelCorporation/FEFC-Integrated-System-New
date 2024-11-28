const transporter = require("./mailer");

const sendEmail = async (to, subject, text, html, cc = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender's email address
      to: to, // Recipient's email address
      cc: cc, // CC recipient(s) (optional)
      subject: subject, // Email subject
      text: text, // Plain text content
      html: html, // HTML content (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true; // Return success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Return failure
  }
};

module.exports = sendEmail;
