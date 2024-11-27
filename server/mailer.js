const nodemailer = require("nodemailer");

// Create reusable transporter object using cPanel Outlook's SMTP server with SSL
const transporter = nodemailer.createTransport({
  host: "mail.fareastfuelcorp.com", // SMTP server
  port: 465, // Port 465 for SSL
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address (_mainaccount@fareastfuelcorp.com)
    pass: process.env.EMAIL_PASSWORD, // Your cPanel password
  },
});

module.exports = transporter;
