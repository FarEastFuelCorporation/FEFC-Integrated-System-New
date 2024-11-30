const transporter = require("./mailer");

const sendEmail = async (
  to,
  subject,
  text,
  html,
  cc = null,
  bcc = null,
  retries = 3,
  delay = 2000
) => {
  try {
    if (!to) {
      console.warn("No primary recipient specified, using CC as fallback.");

      // Check if cc is a non-empty string and use it as the fallback
      to = cc ? cc : null;
      cc = null; // Clear CC since it's being used as the `to` field
    }

    // If there's still no recipient, skip sending
    if (!to) {
      console.error("No recipients defined for email. Skipping sending.");
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender's email address
      to: to, // Recipient's email address
      cc: cc, // CC recipient(s) (optional)
      bcc: bcc, // BCC recipient(s) (optional)
      subject: subject, // Email subject
      text: text, // Plain text content
      html: html, // HTML content (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true; // Return success
  } catch (error) {
    console.error("Error sending email:", error);
    if (retries > 0) {
      console.log(`Error sending email, retrying... attempts left: ${retries}`);
      await delayFunction(delay); // Wait for a specified delay before retrying
      return sendEmail(to, subject, text, html, cc, bcc, retries - 1, delay); // Retry sending email
    } else {
      console.error("Failed to send email after multiple attempts:", error);
      return false; // Return failure after all retries
    }
  }
};

// Helper function to introduce delay between retries
const delayFunction = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = sendEmail;
