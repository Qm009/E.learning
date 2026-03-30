import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './InstructorCourses.css';
import { Book, Check, FileText, Users, X } from 'lucide-react';


const InstructorCourses = () => {
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'instructor') return;
    fetchInstructorCourses();
  }, [user]);

  const fetchInstructorCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const instructorCourses = response.data.filter(course => {
        const isInstructorCourse = course.instructor === user._id || 
          (course.instructor && course.instructor._id === user._id);
        return isInstructorCourse;
      });
      
      if (instructorCourses.length === 0) {
        setCourses(getSampleInstructorCourses(user));
      } else {
        setCourses(instructorCourses);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      setCourses(getSampleInstructorCourses(user));
      setLoading(false);
    }
  };

  const getSampleInstructorCourses = (user) => [
    {
      _id: 'sample1',
      title: 'Fullstack App Development',
      description: 'Build modern web applications from scratch.',
      category: 'Development',
      level: 'Professional',
      enrolledStudents: [1, 2, 3, 4],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
      status: 'published',
      chapters: [{ title: 'Getting Started', lessons: [1, 2, 3] }]
    }
  ];

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5050/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Course deleted successfully! <span className="icon-wrapper"><Check size={18} /></span>');
        fetchInstructorCourses();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting course <span className="icon-wrapper"><X size={18} /></span>');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>Loading your courses...</p></div>;

  if (!user || user.role !== 'instructor') {
    return (
      <div className="instructor-courses-denied">
        <div className="access-denied-content">
          <h2>🚫 Access Denied</h2>
          <p>Instructor access only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-courses">
      <div className="instructor-courses-header">
        <h1>Management Portal</h1>
        <p>Overview and optimization of your educational content.</p>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <div className="course-image">
              <img src={course.image || `https://picsum.photos/seed/${course._id}/400/250`} alt={course.title} />
              <div className="course-status">
                <span className={`status-badge ${course.status}`}>
                  {course.status === 'published' ? '<span className="icon-wrapper"><Check size={18} /></span> Published' : '<span className="icon-wrapper"><FileText size={18} /></span> Draft'}
                </span>
              </div>
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span>{course.category}</span>
                <span>{course.level}</span>
              </div>
              <div className="course-stats">
                <span><span className="icon-wrapper"><Users size={18} /></span> {course.enrolledStudents?.length || 0} Students</span>
                <span><span className="icon-wrapper"><Book size={18} /></span> {course.chapters?.length || 0} Chapters</span>
              </div>
              
              <div className="course-actions">
                <button className="action-btn delete" onClick={() => handleDeleteCourse(course._id)}>
                  🗑️ Delete Course
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>Your educational content will appear here once created.</p>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
