require('dotenv').config();
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testUpload() {
  try {
    console.log('🔍 Testing PDF upload...');
    
    // Créer un faux fichier PDF pour le test
    const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF');
    
    // Créer FormData
    const form = new FormData();
    form.append('files', pdfContent, {
      filename: 'test-document.pdf',
      contentType: 'application/pdf'
    });
    
    console.log('📁 FormData created');
    
    // Envoyer la requête
    const response = await axios.post('http://localhost:5000/api/upload/course-files', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjAxYjJjNmZjY2YwYTBmZThkMThmNCIsIm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJzdGF0dXMiOiJhcHByb3ZlZCIsInJlcXVlc3RlZFJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzczMTgzMDcxLCJleHAiOjE3NzMxODY2NzF9.mJLLLn1LKh6A_IovYnPMEJ8yr5xL68heD6Ap_w9GJ5s'
      }
    });
    
    console.log('✅ Upload successful!');
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    if (error.stack) {
      console.error('❌ Stack:', error.stack);
    }
  }
}

testUpload();
