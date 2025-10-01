const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Debug: Check if environment variables are loaded
  console.log('Email config check:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Email credentials not found. Please check your .env file.');
  }
  
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD // Your Gmail App Password (not regular password)
    }
  });
};

// Send OTP email
const sendOTPEmail = async (emailId, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: emailId, // Recipient address
      subject: 'Your OTP for DevTinder', // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">DevTinder OTP Verification</h2>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #666; margin: 0 0 10px 0;">Your One-Time Password (OTP)</h3>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; margin: 10px 0;">This OTP is valid for 10 minutes.</p>
          </div>
          <div style="text-align: center; color: #888; font-size: 14px;">
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (emailId, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailId,
      subject: 'Password Reset Request - DevTinder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; margin: 0 0 20px 0;">You requested a password reset for your DevTinder account.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px; margin: 20px 0 0 0;">
              This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
          </div>
          <div style="text-align: center; color: #888; font-size: 14px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};
