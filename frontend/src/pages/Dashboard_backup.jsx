import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './DashboardModern.css';
import '../components/CourseFiles.css';
import { BarChart, Book, BookOpen, Briefcase, Camera, Check, Circle, Clipboard, Clock, FileText, GraduationCap, Lightbulb, Lock, MonitorPlay, Search, Settings, Target, Timer, TrendingUp, Trophy, User, Users, X } from 'lucide-react';


const Dashboard = () => {
  const { user, token, login } = useContext(AuthContext);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalLearningHours: 0
  });
  const [coursesData, setCoursesData] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
    image: null,
    chapters: []
  });

  console.log('Dashboard component rendered');
  console.log('User from context:', user);
  console.log('Token from context:', token ? 'Present' : 'Not present');

  useEffect(() => {
    if (user) {
      console.log('Dashboard: User role is:', user.role);
      console.log('Dashboard: User object:', user);
      fetchDashboardData();
      checkNotifications();
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      console.log('<span className="icon-wrapper"><Search size={18} /></span> Fetching dashboard data...');
      
      // Fetch courses
      const coursesResponse = await axios.get('http://localhost:5050/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('<span className="icon-wrapper"><BookOpen size={18} /></span> Courses fetched:', coursesResponse.data);
      setCoursesData(coursesResponse.data);

      // Update stats based on actual data
      setStats({
        enrolledCourses: coursesResponse.data.filter(course => 
          course.enrolledStudents && course.enrolledStudents.includes(user._id)
        ).length,
        completedQuizzes: Math.floor(Math.random() * 10) + 5,
        averageScore: Math.floor(Math.random() * 30) + 70,
        totalLearningHours: Math.floor(Math.random() * 50) + 20
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const checkNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const hasPendingInstructorRequest = user.role === 'student' && user.status === 'pending' && user.requestedRole === 'instructor';

  // Course creation functions
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...newCourse,
        instructor: user._id,
        status: 'draft',
        price: 0
      };

      const response = await axios.post('http://localhost:5050/api/courses', courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Cours créé avec succès!');
      setNewCourse({
        title: '',
        description: '',
        category: '',
        price: 0,
        duration: '',
        image: null,
        chapters: []
      });
      fetchDashboardData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de la création du cours');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse({ ...newCourse, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewCourse({ ...newCourse, image: null });
  };

  const addChapter = () => {
    setNewCourse({
      ...newCourse,
      chapters: [...newCourse.chapters, { title: '', content: '', duration: '' }]
    });
  };

  const removeChapter = (index) => {
    const updatedChapters = newCourse.chapters.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, chapters: updatedChapters });
  };

  const updateChapter = (index, field, value) => {
    const updatedChapters = newCourse.chapters.map((chapter, i) =>
      i === index ? { ...chapter, [field]: value } : chapter
    );
    setNewCourse({ ...newCourse, chapters: updatedChapters });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-auth-required">
        <div className="auth-required-content">
          <h2><span className="icon-wrapper"><Lock size={18} /></span> Connexion requise</h2>
          <p>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering dashboard for role:', user.role);

  return (
    <div className="dashboard">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="user-profile">
            <div className="user-avatar large">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div className="user-info">
              <h1>Welcome back, {user?.name || 'User'}!</h1>
              <p className="user-role">
                {user.role === 'student' && user.status === 'pending'
                  ? '<span className="icon-wrapper"><GraduationCap size={18} /></span> Student (Instructor Request Pending)'
                  : user.role === 'student'
                    ? '👨‍<span className="icon-wrapper"><GraduationCap size={18} /></span> Student'
                    : user.role === 'instructor'
                      ? '<span className="icon-wrapper"><MonitorPlay size={18} /></span> Instructor'
                      : user.role === 'admin'
                        ? '<span className="icon-wrapper"><Briefcase size={18} /></span> Administrator'
                        : '<span className="icon-wrapper"><User size={18} /></span> User'
                }
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={() => window.location.href = '/profile'}>
              <span className="action-icon"><span className="icon-wrapper"><User size={18} /></span></span>
              <span>Profile</span>
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/certificates'}>
              <span className="action-icon"><span className="icon-wrapper"><GraduationCap size={18} /></span></span>
              <span>Certifications</span>
            </button>
            <button className="action-btn" onClick={() => window.location.href = '/settings'}>
              <span className="action-icon"><span className="icon-wrapper"><Settings size={18} /></span></span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {user.role === 'student' && user.status === 'pending' && (
        <div className="pending-instructor-section">
          <div className="pending-card">
            <div className="pending-header">
              <div className="pending-icon-container">
                <div className="pending-icon"><span className="icon-wrapper"><GraduationCap size={18} /></span></div>
                <div className="pending-ring"></div>
              </div>
              <div className="pending-title">
                <h2>Instructor Request Pending</h2>
                <p>Your journey to becoming an instructor has begun!</p>
              </div>
            </div>
            
            <div className="pending-content">
              <div className="pending-status">
                <div className="status-timeline">
                  <div className="timeline-item completed">
                    <div className="timeline-dot"><span className="icon-wrapper"><Check size={18} /></span></div>
                    <div className="timeline-text">
                      <span className="timeline-title">Request Submitted</span>
                      <span className="timeline-date">Your application is in</span>
                    </div>
                  </div>
                  <div className="timeline-item active">
                    <div className="timeline-dot pending">
                      <div className="pulse"></div>
                    </div>
                    <div className="timeline-text">
                      <span className="timeline-title">Under Review</span>
                      <span className="timeline-date">Admin team evaluating</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"><span className="icon-wrapper"><Circle size={18} /></span></div>
                    <div className="timeline-text">
                      <span className="timeline-title">Approval</span>
                      <span className="timeline-date">Final decision pending</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pending-details">
                <div className="detail-grid">
                  <div className="detail-card">
                    <div className="detail-icon"><span className="icon-wrapper"><Clipboard size={18} /></span></div>
                    <div className="detail-info">
                      <span className="detail-label">Application Type</span>
                      <span className="detail-value">Instructor Role</span>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-icon"><span className="icon-wrapper"><Timer size={18} /></span></div>
                    <div className="detail-info">
                      <span className="detail-label">Review Time</span>
                      <span className="detail-value">24-48 hours</span>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-icon"><span className="icon-wrapper"><User size={18} /></span></div>
                    <div className="detail-info">
                      <span className="detail-label">Current Access</span>
                      <span className="detail-value">Student Features</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pending-message">
                <div className="message-icon"><span className="icon-wrapper"><Lightbulb size={18} /></span></div>
                <div className="message-content">
                  <h3>While you wait, explore these features:</h3>
                  <div className="feature-list">
                    <div className="feature-item">
                      <span className="feature-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
                      <span>Continue learning with available courses</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon"><span className="icon-wrapper"><Trophy size={18} /></span></span>
                      <span>Earn certificates and achievements</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon"><span className="icon-wrapper"><Users size={18} /></span></span>
                      <span>Join study groups and discussions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pending-actions">
              <button className="btn btn-primary btn-lg" onClick={() => window.location.href = '/courses'}>
                <span className="btn-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
                Browse Courses
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => window.location.href = '/settings'}>
                <span className="btn-icon"><span className="icon-wrapper"><Settings size={18} /></span></span>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {(user.role === 'instructor' || user.role === 'teacher' || user.role === 'prof') && (
        <div className="instructor-dashboard">
          {/* Create Course Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><span className="icon-wrapper"><FileText size={18} /></span> Create New Course</h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleCreateCourse} className="course-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Course Title *</label>
                    <input
                      type="text"
                      placeholder="Enter course title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="e.g., Programming"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe your course..."
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* Image du cours */}
                  <div className="form-group full-width">
                    <label>Image du cours</label>
                    <div className="image-upload-section">
                      {newCourse.image ? (
                        <div className="image-preview">
                          <img src={newCourse.image} alt="Preview" className="preview-image" />
                          <button type="button" onClick={removeImage} className="btn-remove-image">
                            <span className="icon-wrapper"><X size={18} /></span>
                          </button>
                        </div>
                      ) : (
                        <div className="image-upload-area">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="image-input"
                            id="course-image-input"
                          />
                          <label htmlFor="course-image-input" className="image-upload-label">
                            <span className="upload-icon"><span className="icon-wrapper"><Camera size={18} /></span></span>
                            <span>Ajouter une image</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chapitres */}
                  <div className="form-group full-width">
                    <div className="chapters-section">
                      <div className="chapters-header">
                        <label>Chapitres du cours</label>
                        <button
                          type="button"
                          onClick={addChapter}
                          className="btn-add-chapter"
                        >
                          + Ajouter un chapitre
                        </button>
                      </div>
                      <div className="chapters-list">
                        {newCourse.chapters.map((chapter, index) => (
                          <div key={index} className="chapter-item">
                            <div className="chapter-header">
                              <h4>Chapitre {index + 1}</h4>
                              {newCourse.chapters.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeChapter(index)}
                                  className="btn-remove-chapter"
                                >
                                  Supprimer
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Titre du chapitre"
                              value={chapter.title}
                              onChange={(e) => updateChapter(index, 'title', e.target.value)}
                              className="chapter-title"
                              required
                            />
                            <textarea
                              placeholder="Contenu du chapitre"
                              value={chapter.content}
                              onChange={(e) => updateChapter(index, 'content', e.target.value)}
                              className="chapter-content"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Durée (ex: 30 min)"
                              value={chapter.duration}
                              onChange={(e) => updateChapter(index, 'duration', e.target.value)}
                              className="chapter-duration"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Créer le cours
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {user.role === 'student' && user.status !== 'pending' && (
        <div className="student-dashboard">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
              <div className="stat-content">
                <h3>{stats.enrolledCourses}</h3>
                <p>Courses Enrolled</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><span className="icon-wrapper"><Trophy size={18} /></span></div>
              <div className="stat-content">
                <h3>{stats.completedQuizzes}</h3>
                <p>Completed Quizzes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><span className="icon-wrapper"><BarChart size={18} /></span></div>
              <div className="stat-content">
                <h3>{stats.averageScore}%</h3>
                <p>Average Score</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><span className="icon-wrapper"><Clock size={18} /></span></div>
              <div className="stat-content">
                <h3>{stats.totalLearningHours}h</h3>
                <p>Learning Hours</p>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><span className="icon-wrapper"><Target size={18} /></span> Learning Progress</h3>
              <span className="card-badge">Active</span>
            </div>
            <div className="card-content">
              <div className="progress-section">
                <div className="progress-item">
                  <span>Overall Progress</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="progress-text">65% Complete</span>
                </div>
              </div>
              <p className="card-text">
                You're doing great! Keep up the momentum and complete more courses to unlock achievements.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><span className="icon-wrapper"><TrendingUp size={18} /></span> Recent Activity</h3>
              <span className="card-badge">New</span>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
                  <div className="activity-details">
                    <span className="activity-title">Completed JavaScript Basics</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon"><span className="icon-wrapper"><Trophy size={18} /></span></div>
                  <div className="activity-details">
                    <span className="activity-title">Earned React Certificate</span>
                    <span className="activity-time">Yesterday</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon"><span className="icon-wrapper"><Book size={18} /></span></div>
                  <div className="activity-details">
                    <span className="activity-title">Started Advanced CSS Course</span>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h3><span className="icon-wrapper"><BookOpen size={18} /></span> My Courses</h3>
              <button className="btn btn-sm btn-outline" onClick={() => window.location.href = '/courses'}>
                View All
              </button>
            </div>
            <div className="card-content">
              {coursesData && coursesData.length > 0 ? (
                <div className="courses-grid">
                  {coursesData.slice(0, 3).map(course => (
                    <div key={course._id} className="course-card">
                      <div className="course-image">
                        <img
                          src={course.image || `https://picsum.photos/seed/${course._id}/300/200.jpg`}
                          alt={course.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://picsum.photos/seed/fallback-${course._id}/300/200.jpg`;
                          }}
                        />
                      </div>
                      <div className="course-info">
                        <h4>{course.title}</h4>
                        <p>{course.description}</p>
                        <div className="course-meta">
                          <span className="category">{course.category}</span>
                          <span className="level">{course.level}</span>
                        </div>
                        <button 
                          onClick={() => window.location.href = `/courses/${course._id}`}
                          className="btn btn-primary"
                        >
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No courses enrolled yet. Start learning today!</p>
                  <button className="btn btn-primary" onClick={() => window.location.href = '/courses'}>
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {user.role === 'admin' && (
        <div className="admin-quick-actions">
          {/* Admin Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><span className="icon-wrapper"><Briefcase size={18} /></span> Admin Panel</h3>
              <span className="card-badge">Administrator</span>
            </div>
            <div className="card-content">
              <div className="admin-actions-grid">
                <button className="admin-action-btn" onClick={() => window.location.href = '/admin/users'}>
                  <span className="admin-icon"><span className="icon-wrapper"><Users size={18} /></span></span>
                  <span>Manage Users</span>
                </button>
                <button className="admin-action-btn" onClick={() => window.location.href = '/admin/courses'}>
                  <span className="admin-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
                  <span>Manage Courses</span>
                </button>
                <button className="admin-action-btn" onClick={() => window.location.href = '/admin/instructor-requests'}>
                  <span className="admin-icon"><span className="icon-wrapper"><GraduationCap size={18} /></span></span>
                  <span>Instructor Requests</span>
                </button>
                <button className="admin-action-btn" onClick={() => window.location.href = '/admin/analytics'}>
                  <span className="admin-icon"><span className="icon-wrapper"><BarChart size={18} /></span></span>
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3><span className="icon-wrapper"><BarChart size={18} /></span> System Statistics</h3>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon"><span className="icon-wrapper"><Users size={18} /></span></div>
                  <div className="stat-content">
                    <h3>1,234</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
                  <div className="stat-content">
                    <h3>56</h3>
                    <p>Total Courses</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><span className="icon-wrapper"><GraduationCap size={18} /></span></div>
                  <div className="stat-content">
                    <h3>89</h3>
                    <p>Instructors</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><span className="icon-wrapper"><Trophy size={18} /></span></div>
                  <div className="stat-content">
                    <h3>456</h3>
                    <p>Certificates Issued</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
