const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';

const checkCourse = async () => {
    try {
        await mongoose.connect(mongoURI);
        const course = await Course.findOne();
        if (course) {
            console.log('--- COURSE FOUND ---');
            console.log('Title:', course.title);
            console.log('Chapters count:', course.chapters.length);
            console.log('First Chapter Content:', course.chapters[0]?.content);
            console.log('Lessons count:', course.lessons.length);
            console.log('First Lesson Content:', course.lessons[0]?.content);
        } else {
            console.log('No course found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCourse();
