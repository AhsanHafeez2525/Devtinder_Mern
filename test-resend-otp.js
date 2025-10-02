const axios = require('axios');

// Test the resend OTP API
async function testResendOTP() {
  const baseURL = 'http://localhost:5000';
  const testEmail = 'ahsansatti402@gmail.com';

  console.log('🧪 Testing Resend OTP API...\n');

  try {
    // Test 1: Resend OTP with valid email
    console.log('1️⃣ Testing resend OTP with valid email...');
    const response1 = await axios.post(`${baseURL}/resend-otp`, {
      emailId: testEmail
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Response:', response1.data);
    console.log('Status:', response1.status);
    console.log('');

    // Test 2: Try to resend OTP again immediately (should get rate limit error)
    console.log('2️⃣ Testing immediate resend (should get rate limit error)...');
    try {
      const response2 = await axios.post(`${baseURL}/resend-otp`, {
        emailId: testEmail
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Unexpected success:', response2.data);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('✅ Rate limit working correctly:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // Test 3: Test with invalid email format
    console.log('3️⃣ Testing with invalid email format...');
    try {
      const response3 = await axios.post(`${baseURL}/resend-otp`, {
        emailId: 'invalid-email'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Unexpected success:', response3.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation working correctly:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // Test 4: Test with missing email
    console.log('4️⃣ Testing with missing email...');
    try {
      const response4 = await axios.post(`${baseURL}/resend-otp`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Unexpected success:', response4.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation working correctly:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testResendOTP();
