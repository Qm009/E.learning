const axios = require('axios');
const FormData = require('form-data');

async function testCreateCourse() {
  const baseUrl = 'http://127.0.0.1:5000/api';
  
  try {
    console.log('Logging in...');
    const loginRes = await axios.post(`${baseUrl}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin' // Assuming this is the password
    });
    
    const token = loginRes.data.token;
    console.log('✅ Logged in successfully');

    const form = new FormData();
    form.append('title', 'Test Course Node ' + Date.now());
    form.append('description', 'Test Description Node');
    form.append('category', 'Test Category Node');
    form.append('duration', '3 hours');
    form.append('price', '20');

    console.log('Sending request to', `${baseUrl}/courses`);
    const response = await axios.post(`${baseUrl}/courses`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Success:', response.status);
    console.log('Response body:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Failed:', error.response?.status);
    console.error('Error body:', JSON.stringify(error.response?.data, null, 2));
  }
}

testCreateCourse();
