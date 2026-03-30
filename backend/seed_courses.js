const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

const courses = [
  {
    title: 'Complete Web Development Bootcamp 2024',
    description: 'Learn HTML, CSS, JavaScript, React, Node, and MongoDB with hands-on projects.',
    category: 'Programming',
    duration: '60 hours',
    price: 99.99,
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
  },
  {
    title: 'Advanced Machine Learning with Python',
    description: 'Master deep learning, neural networks, and reinforcement learning.',
    category: 'Data Science',
    duration: '45 hours',
    price: 129.99,
    level: 'advanced',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800'
  },
  {
    title: 'UI/UX Design Essentials',
    description: 'Learn Figma, user research, wireframing, and prototyping from scratch.',
    category: 'Design',
    duration: '30 hours',
    price: 79.99,
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'
  },
  {
    title: 'Digital Marketing Strategy Masterclass',
    description: 'SEO, SEM, Social Media, and Content Marketing for business growth.',
    category: 'Marketing',
    duration: '25 hours',
    price: 49.99,
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
  },
  {
    title: 'Mobile App Development with Flutter',
    description: 'Build beautiful native apps for iOS and Android with a single codebase.',
    category: 'Programming',
    duration: '40 hours',
    price: 89.99,
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'
  },
  {
    title: 'Financial Analysis and Excel Modeling',
    description: 'Master financial statements, valuation, and complex Excel formulas.',
    category: 'Finance',
    duration: '20 hours',
    price: 69.99,
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800'
  },
  {
    title: 'Project Management Professional (PMP) Prep',
    description: 'Everything you need to pass the PMP certification exam.',
    category: 'Business',
    duration: '35 hours',
    price: 149.99,
    level: 'advanced',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800'
  },
  {
    title: 'Photography Masterclass: From Beginner to Pro',
    description: 'Learn composition, lighting, and editing for stunning photos.',
    category: 'Art',
    duration: '15 hours',
    price: 39.99,
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
  },
  {
    title: 'Cybersecurity Fundamentals',
    description: 'Protect systems and networks from digital attacks.',
    category: 'IT Security',
    duration: '30 hours',
    price: 119.99,
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'
  },
  {
    title: 'Public Speaking and Presentation Skills',
    description: 'Conquer your fear and deliver powerful, engaging talks.',
    category: 'Personal Development',
    duration: '10 hours',
    price: 29.99,
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
  },
  {
    title: 'Introduction to Artificial Intelligence',
    description: 'History, concepts, and future of AI and robotics.',
    category: 'Technology',
    duration: '20 hours',
    price: 59.99,
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
  }
];

// Generate 20 courses by duplicating and modifying the base list
let finalCourses = [];
for (let i = 0; i < 20; i++) {
  const base = courses[i % courses.length];
  finalCourses.push({
    ...base,
    title: `${base.title} vol. ${Math.floor(i / courses.length) + 1}`,
    chapters: [
      { title: 'Introduction', content: 'Overview of the course', duration: '10 min' },
      { title: 'Getting Started', content: 'Setting up your environment', duration: '30 min' }
    ]
  });
}

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Find the instructor (admin)
    const instructor = await User.findOne({ email: 'admin@test.com' });
    if (!instructor) {
      console.error('Error: Admin user not found. Please run the server first to ensure admin exists.');
      process.exit(1);
    }

    // Assign instructor to all courses
    const coursesWithInstructor = finalCourses.map(course => ({
      ...course,
      instructor: instructor._id
    }));

    // Delete existing sample courses to avoid duplicates if desired, or just add
    // await Course.deleteMany({ title: /vol\./ }); 

    await Course.insertMany(coursesWithInstructor);
    console.log('✅ 20 courses seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
