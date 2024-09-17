// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html, attachments }) {
  try {
    await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to,
      subject,
      html,
      attachments
    });
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    return { success: false, error: 'Failed to send email: ' + error.message };
  }
}

module.exports = sendEmail;
