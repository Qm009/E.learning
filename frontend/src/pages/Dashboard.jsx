import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../api';
import './DashboardModern.css';
import '../components/CourseFiles.css';
import { BarChart, Book, BookOpen, Briefcase, Camera, Check, Circle, Clipboard, Clock, FileText, GraduationCap, Lightbulb, Lock, MonitorPlay, Rocket, Search, Settings, Target, Timer, TrendingUp, Trophy, User, Users, X } from 'lucide-react';


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
    image: '',
    imageFile: null,
    chapters: [{ title: '', content: '', duration: '' }]
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
      console.log('Fetching dashboard data...');
      
      // Fetch courses
      const coursesResponse = await axios.get(`${API_BASE_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Courses fetched:', coursesResponse.data);
      setCoursesData(coursesResponse.data);

      // Update stats based on actual data
      setStats({
        enrolledCourses: coursesResponse.data.filter(course => {
          const userId = user.id || user._id;
          return course.enrolledStudents && (
            course.enrolledStudents.includes(userId) || 
            course.enrolledStudents.includes(String(userId))
          );
        }).length,
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
      const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const hasPendingInstructorRequest = user.role === 'student' && user.status === 'pending' && user.requestedRole === 'instructor';

  // Gestion du téléchargement d'image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file (JPG, PNG, GIF)');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      setNewCourse({ ...newCourse, imageFile: file, image: URL.createObjectURL(file) });
    }
  };

  // Course creation functions
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    console.log('Create Course button clicked!');
    console.log('Form data:', newCourse);
    console.log('User:', user);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    
    try {
      // Validation
      if (!newCourse.title.trim()) {
        setMessage('Course title is required');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      if (!newCourse.description.trim()) {
        setMessage('Course description is required');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      if (!newCourse.category.trim()) {
        setMessage('Course category is required');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      if (!newCourse.chapters || newCourse.chapters.length === 0) {
        setMessage('You must add at least one chapter');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      const invalidChapters = newCourse.chapters.filter(ch => !ch.title || ch.title.trim() === '');
      if (invalidChapters.length > 0) {
        setMessage('All chapters must have a title');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      const courseData = {
        title: newCourse.title.trim(),
        description: newCourse.description.trim(),
        category: newCourse.category.trim(),
        price: 0,
        duration: newCourse.duration || 'Not specified',
        image: newCourse.image.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&auto=format',
        instructor: user.id || user._id,
        status: 'draft',
        chapters: newCourse.chapters.map(ch => ({
          title: ch.title.trim(),
          content: ch.content.trim() || 'Content to be added',
          duration: ch.duration.trim() || '30 min'
        }))
      };

      console.log('📦 Course data prepared:', courseData);

      const response = await axios.post(`${API_BASE_URL}/api/courses`, courseData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Course created successfully:', response.data);

      setMessage('Course created successfully!');
      setNewCourse({
        title: '',
        description: '',
        category: '',
        price: 0,
        duration: '',
        image: '',
        imageFile: null,
        chapters: [{ title: '', content: '', duration: '' }]
      });
      fetchDashboardData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error creating course:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setMessage('Error creating course: ' + errorMessage);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const removeImage = () => {
    setNewCourse({ ...newCourse, image: null, imageFile: null });
  };

  const addChapter = () => {
    console.log('🔧 Add Chapter button clicked!');
    setNewCourse({
      ...newCourse,
      chapters: [...newCourse.chapters, { title: '', content: '', duration: '' }]
    });
  };

  const removeChapter = (index) => {
    console.log('🔧 Remove Chapter button clicked! Index:', index);
    const updatedChapters = newCourse.chapters.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, chapters: updatedChapters });
  };

  const updateChapter = (index, field, value) => {
    console.log('🔧 Updating chapter:', { index, field, value });
    const updatedChapters = newCourse.chapters.map((chapter, i) =>
      i === index ? { ...chapter, [field]: value } : chapter
    );
    console.log('Updated chapters:', updatedChapters);
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
                  ? <><span className="icon-wrapper"><GraduationCap size={18} /></span> Student (Instructor Request Pending)</>
                  : user.role === 'student'
                    ? <><span className="icon-wrapper"><GraduationCap size={18} /></span> Student</>
                    : user.role === 'instructor'
                      ? <><span className="icon-wrapper"><MonitorPlay size={18} /></span> Instructor</>
                      : user.role === 'admin'
                        ? <><span className="icon-wrapper"><Briefcase size={18} /></span> Administrator</>
                        : <><span className="icon-wrapper"><User size={18} /></span> User</>
                }
              </p>
            </div>
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

                  <div className="form-group full-width">
                    <label>Course Image</label>
                    <div className="image-upload-container">
                      <input
                        type="file"
                        id="course-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-input"
                      />
                      <label htmlFor="course-image" className="image-upload-label">
                        {newCourse.image ? (
                          <div className="image-preview">
                            <img src={newCourse.image} alt="Course preview" className="preview-img" />
                            <div className="image-overlay">
                              <span><span className="icon-wrapper"><Camera size={18} /></span> Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <span className="upload-icon"><span className="icon-wrapper"><Camera size={18} /></span></span>
                            <span>Click to upload image</span>
                            <small>JPG, PNG, GIF (max 5MB)</small>
                          </div>
                        )}
                      </label>
                      {newCourse.image && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="remove-image-btn"
                        >
                          <span className="icon-wrapper"><X size={18} /></span> Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Chapters */}
                  <div className="form-group full-width">
                    <div className="chapters-section">
                      <div className="chapters-header">
                        <label>Course Chapters</label>
                        <button
                          type="button"
                          onClick={addChapter}
                          className="btn-add-chapter"
                        >
                          + Add Chapter
                        </button>
                      </div>
                      <div className="chapters-list">
                        {newCourse.chapters.map((chapter, index) => (
                          <div key={index} className="chapter-item">
                            <div className="chapter-header">
                              <h4>Chapter {index + 1}</h4>
                              {newCourse.chapters.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeChapter(index)}
                                  className="btn-remove-chapter"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Chapter title"
                              value={chapter.title || ''}
                              onChange={(e) => {
                                const newChapters = [...newCourse.chapters];
                                newChapters[index] = { ...newChapters[index], title: e.target.value };
                                setNewCourse({ ...newCourse, chapters: newChapters });
                              }}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: '#fff',
                                color: '#333',
                                outline: 'none',
                                marginBottom: '10px'
                              }}
                            />
                            <textarea
                              placeholder="Chapter content"
                              value={chapter.content || ''}
                              onChange={(e) => {
                                const newChapters = [...newCourse.chapters];
                                newChapters[index] = { ...newChapters[index], content: e.target.value };
                                setNewCourse({ ...newCourse, chapters: newChapters });
                              }}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: '#fff',
                                color: '#333',
                                outline: 'none',
                                minHeight: '80px',
                                marginBottom: '10px',
                                resize: 'vertical'
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g., 30 min)"
                              value={chapter.duration || ''}
                              onChange={(e) => {
                                const newChapters = [...newCourse.chapters];
                                newChapters[index] = { ...newChapters[index], duration: e.target.value };
                                setNewCourse({ ...newCourse, chapters: newChapters });
                              }}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: '#fff',
                                color: '#333',
                                outline: 'none'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Create Course
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
