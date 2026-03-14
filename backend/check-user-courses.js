const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

async function checkUserCourses() {
  try {
    await mongoose.connect('mongodb://localhost:27017/learning-platform');
    
    // Trouver tous les utilisateurs
    const users = await User.find({});
    console.log('👥 All users:');
    users.forEach(user => {
      console.log(`  ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user._id}`);
    });
    console.log('---');
    
    // Trouver tous les cours avec détails
    const courses = await Course.find({}).populate('instructor', 'name email');
    console.log('📚 All courses with instructor details:');
    courses.forEach(course => {
      console.log(`📚 Course: ${course.title}`);
      console.log(`👤 Instructor: ${course.instructor?.name} (${course.instructor?.email})`);
      console.log(`🆔 Instructor ID: ${course.instructor?._id}`);
      console.log(`📁 Files: ${course.files?.length || 0}`);
      if (course.files && course.files.length > 0) {
        course.files.forEach((file, index) => {
          console.log(`  📄 File ${index + 1}: ${file.originalName}`);
        });
      }
      console.log('---');
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkUserCourses();
