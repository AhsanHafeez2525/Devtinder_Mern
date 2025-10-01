// Test script to verify email functionality
require('dotenv').config();
const { sendOTPEmail } = require('./src/utils/emailService');

async function testEmail() {
  console.log('Testing email functionality...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Email configuration missing!');
    console.log('Please set up your .env file with EMAIL_USER and EMAIL_APP_PASSWORD');
    console.log('See email-config.md for setup instructions');
    return;
  }

  const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
  const testOTP = '123456';

  console.log(`Sending test OTP email to ${testEmail}...`);
  
  const result = await sendOTPEmail(testEmail, testOTP);
  
  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Check your Gmail inbox for the OTP email.');
  } else {
    console.error('❌ Failed to send email:', result.error);
  }
}

testEmail().catch(console.error);
