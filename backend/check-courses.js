const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

async function checkCourses() {
  try {
    await mongoose.connect('mongodb://localhost:27017/learning-platform');
    
    const courses = await Course.find({}).populate('instructor', 'name').limit(5);
    console.log('📋 Recent courses:');
    courses.forEach(course => {
      console.log('📚 Course:', course.title);
      console.log('👤 Instructor:', course.instructor?.name);
      console.log('📁 Files count:', course.files?.length || 0);
      if (course.files && course.files.length > 0) {
        course.files.forEach((file, index) => {
          console.log(`  📄 File ${index + 1}: ${file.originalName} (${file.url})`);
        });
      }
      console.log('---');
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkCourses();
