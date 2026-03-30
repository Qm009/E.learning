import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../api';
import './InstructorDashboard.css';
import { BarChart, BookOpen, Settings, Star, Users } from 'lucide-react';


const InstructorDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const loadCourses = async () => {
      if (!user || user.role !== 'instructor') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const allCourses = await response.json();
          const instructorCourses = allCourses.filter(course => {
            const courseInstructorId = course.instructor?._id || course.instructor;
            const userIdToMatch = user._id || user.id;
            return String(courseInstructorId) === String(userIdToMatch);
          });

          // Add demo courses if empty
          if (instructorCourses.length === 0) {
            setCourses(getDemoCourses(user));
          } else {
            setCourses(instructorCourses);
          }
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadCourses();
  }, [user?._id, token]);

  const getDemoCourses = (user) => [
    {
      _id: 'demo1',
      title: 'JavaScript Mastery 2024',
      description: 'Advanced JavaScript concepts from closures to async/await.',
      instructor: { name: user.name, _id: user._id },
      category: 'Web Development',
      level: 'Advanced',
      enrolledStudents: [1, 2, 3, 4, 5],
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=400',
      status: 'published'
    },
    {
      _id: 'demo2',
      title: 'UI/UX Design Systems',
      description: 'Master Figma and design professional interfaces.',
      instructor: { name: user.name, _id: user._id },
      category: 'Design',
      level: 'Intermediate',
      enrolledStudents: [6, 7],
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400',
      status: 'published'
    }
  ];

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setCourses(courses.filter(course => course._id !== courseId));
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (!user) return <div className="loading-spinner"><div className="spinner"></div></div>;

  if (user.role !== 'instructor') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>🚫 Access Denied</h2>
          <p>Please log in as an instructor to view this page.</p>
          <Link to="/login" className="btn btn-primary">Log In</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>Loading your dashboard...</p></div>;

  return (
    <div className="instructor-dashboard-layout">
      {/* Premium Sidebar */}
      <aside className="instructor-sidebar">
        <div className="sidebar-header">
          <h2>Instructor Pro</h2>
          <p className="instructor-name">{user.name}</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
                <span className="nav-icon"><span className="icon-wrapper"><BarChart size={18} /></span></span> Overview
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'courses' ? 'active' : ''}`} onClick={() => setActiveSection('courses')}>
                <span className="nav-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span> My Courses
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'students' ? 'active' : ''}`} onClick={() => setActiveSection('students')}>
                <span className="nav-icon"><span className="icon-wrapper"><Users size={18} /></span></span> Students
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
                <span className="nav-icon"><span className="icon-wrapper"><Settings size={18} /></span></span> Settings
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="instructor-main-content">
        <header className="content-header">
          <div className="header-text">
            <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
            <p>Welcome back, {user.name}! Here is what's happening.</p>
          </div>
                  </header>

        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card-premium">
                <div className="stat-icon-wrapper"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
                <div className="stat-content">
                  <h3>{courses.length}</h3>
                  <p className="stat-label">Total Courses</p>
                </div>
              </div>
              <div className="stat-card-premium">
                <div className="stat-icon-wrapper"><span className="icon-wrapper"><Users size={18} /></span></div>
                <div className="stat-content">
                  <h3>{courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0)}</h3>
                  <p className="stat-label">Students Enrolled</p>
                </div>
              </div>
              <div className="stat-card-premium">
                <div className="stat-icon-wrapper"><span className="icon-wrapper"><Star size={18} /></span></div>
                <div className="stat-content">
                  <h3>4.9</h3>
                  <p className="stat-label">Avg. Rating</p>
                </div>
              </div>
              <div className="stat-card-premium">
                <div className="stat-icon-wrapper">💰</div>
                <div className="stat-content">
                  <h3>$1,240</h3>
                  <p className="stat-label">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'courses' && (
          <div className="courses-section">
            <div className="courses-grid-premium">
              {courses.map(course => (
                <div key={course._id} className="course-card-premium">
                  <div className="course-image">
                    <img src={course.image || 'https://picsum.photos/400/250'} alt={course.title} />
                    <div className="course-actions-overlay">
                      <button className="action-btn edit-btn">✏️</button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(course._id)}>🗑️</button>
                    </div>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta-info">
                      <span className="category-badge">{course.category}</span>
                      <span className="level-badge">{course.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for other sections */}
        {(activeSection === 'students' || activeSection === 'settings') && (
          <div className="placeholder-view" style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
            <h2 style={{ fontSize: '2rem' }}>Working on it...</h2>
            <p>This section is coming soon in the next update!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;
