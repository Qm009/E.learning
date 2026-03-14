const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 TESTING REGISTRATION API...');
    
    const userData = {
      name: 'Test User',
      email: 'test3@test.com',
      password: 'test123',
      requestedRole: 'student'
    };
    
    console.log('📤 Sending registration request:', userData);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

testRegistration();
