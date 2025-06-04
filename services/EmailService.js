const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
