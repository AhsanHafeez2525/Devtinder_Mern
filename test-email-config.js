const { sendOTPEmail } = require('./src/utils/emailService');
require('dotenv').config();

async function testEmailConfig() {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Email credentials not found in environment variables');
    console.log('Please make sure you have created a .env file with EMAIL_USER and EMAIL_APP_PASSWORD');
    return;
  }
  
  try {
    const result = await sendOTPEmail('ahsansatti402@gmail.com', '123456');
    if (result.success) {
      console.log('✅ Email configuration is working!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Email sending failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing email:', error.message);
  }
}

testEmailConfig();
