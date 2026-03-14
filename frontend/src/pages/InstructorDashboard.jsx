import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import './InstructorDashboard.css';
import '../components/InstructorFiles.css';

const InstructorDashboard = () => {
  console.log('🚀 InstructorDashboard component is loading...');
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    level: 'beginner',
    price: 0
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user || !user._id || user.role !== 'instructor') {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Loading courses for instructor:', user._id);

        const response = await fetch('http://localhost:5000/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const allCourses = await response.json();
          console.log('📚 All courses received:', allCourses.length);

          // Filtrer les cours de l'instructeur
          const instructorCourses = allCourses.filter(course => {
            const courseInstructorId = course.instructor?._id || course.instructor;
            const userIdToMatch = user._id || user.id;
            const isInstructorById = String(courseInstructorId) === String(userIdToMatch);
            const isInstructorByName = course.instructorName && user.name && course.instructorName === user.name;

            const isInstructor = isInstructorById || isInstructorByName;

            if (isInstructor) {
              console.log(`✅ Course "${course.title}" belongs to instructor`);
            }

            return isInstructor;
          });

          console.log(`📋 Found ${instructorCourses.length} courses for instructor`, instructorCourses);
          setCourses(instructorCourses);
        } else {
          console.error('❌ Failed to fetch courses:', response.status);
        }
      } catch (error) {
        console.error('❌ Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user?._id, token]);

  // Si l'utilisateur n'est pas encore chargé, afficher un chargement
  if (!user) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Vérification de sécurité supplémentaire
  if (user.role !== 'instructor') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>🚫 Accès Refusé</h2>
          <p>Vous devez être connecté en tant qu'instructeur pour accéder à cette page.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      alert('Seuls les images, vidéos et PDF sont autorisés');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulation d'upload avec progression
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles([...uploadedFiles, {
            name: file.name,
            type: file.type,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            uploadDate: new Date().toLocaleString()
          }]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingCourse
        ? `/api/courses/${editingCourse._id}`
        : '/api/courses';

      const response = await fetch(url, {
        method: editingCourse ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          instructor: user._id,
          files: uploadedFiles // Ajouter les fichiers uploadés
        })
      });

      if (response.ok) {
        console.log('✅ Course created successfully');

        // Ajouter le nouveau cours à la liste existante
        const newCourse = await response.json();
        setCourses(prevCourses => [...prevCourses, newCourse]);

        setFormData({
          title: '',
          description: '',
          category: '',
          duration: '',
          level: 'beginner',
          price: 0
        });
        setUploadedFiles([]); // Réinitialiser les fichiers uploadés
        setEditingCourse(null);
        setShowAddForm(false);

        // Afficher un message de succès
        alert('✅ Cours créé avec succès !');
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      level: course.level,
      price: course.price
    });
    setShowAddForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchInstructorCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="instructor-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre espace instructeur...</p>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard-premium">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">EduPortal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}>
              <button onClick={() => setActiveSection('overview')} className="nav-button">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Tableau de bord</span>
              </button>
            </li>
            <li className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}>
              <button onClick={() => setActiveSection('courses')} className="nav-button">
                <span className="nav-icon">📚</span>
                <span className="nav-text">Mes Cours</span>
              </button>
            </li>

            <li className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}>
              <button onClick={() => setActiveSection('analytics')} className="nav-button">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytiques</span>
              </button>
            </li>
            <li className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}>
              <button onClick={() => setActiveSection('settings')} className="nav-button">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Paramètres</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <div className="user-avatar-small">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div className="user-info-mini">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Instructeur</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeSection === 'overview' && 'Tableau de bord'}
              {activeSection === 'courses' && 'Mes Cours'}
              {activeSection === 'upload' && 'Upload de Fichiers'}
              {activeSection === 'analytics' && 'Analytiques'}
              {activeSection === 'settings' && 'Paramètres'}
            </h1>
            <p className="page-subtitle">Bienvenue, {user?.name}</p>
          </div>
          <div className="header-right">
          </div>
        </header>

        {/* Content Sections */}
        <div className="content-body">
          {activeSection === 'overview' && (
            <div className="overview-section">
              {/* Stats Cards */}
              <div className="stats-grid-premium">
                <div className="stat-card-premium primary">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">📚</span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">{courses.length}</h3>
                    <p className="stat-label">Cours créés</p>
                  </div>
                  <div className="stat-trend positive">
                    <span className="trend-icon">📈</span>
                    <span className="trend-text">+12%</span>
                  </div>
                </div>

                <div className="stat-card-premium success">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">👥</span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">{courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)}</h3>
                    <p className="stat-label">Étudiants totaux</p>
                  </div>
                  <div className="stat-trend positive">
                    <span className="trend-icon">📈</span>
                    <span className="trend-text">+8%</span>
                  </div>
                </div>

                <div className="stat-card-premium warning">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">⭐</span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">4.8</h3>
                    <p className="stat-label">Note moyenne</p>
                  </div>
                  <div className="stat-trend positive">
                    <span className="trend-icon">📈</span>
                    <span className="trend-text">+0.3</span>
                  </div>
                </div>

                <div className="stat-card-premium info">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">€2,450</h3>
                    <p className="stat-label">Revenus</p>
                  </div>
                  <div className="stat-trend positive">
                    <span className="trend-icon">📈</span>
                    <span className="trend-text">+15%</span>
                  </div>
                </div>
              </div>

              {/* Recent Courses */}
              <div className="recent-courses-section">
                <h2 className="section-title">Cours récents</h2>
                <div className="courses-grid-premium">
                  {courses.slice(0, 3).map(course => (
                    <div key={course._id} className="course-card-premium">
                      <div className="course-image">
                        <img src={course.image || 'https://via.placeholder.com/300x200'} alt={course.title} />
                      </div>
                      <div className="course-content">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-description">{course.description}</p>

                        {/* Affichage des fichiers */}
                        {course.files && course.files.length > 0 && (
                          <div className="course-files">
                            <h4>📁 Fichiers ({course.files.length})</h4>
                            <div className="files-list-small">
                              {course.files.map((file, index) => (
                                <div key={index} className="file-item-small">
                                  <span className="file-icon">
                                    {file.type === 'image' ? '🖼️' : '📄'}
                                  </span>
                                  <a
                                    href={`http://localhost:5000${file.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="file-link-small"
                                  >
                                    {file.originalName}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="course-meta">
                          <span className="course-students">{course.enrolledStudents?.length || 0} étudiants</span>
                          <span className="course-rating">⭐ {course.rating || 4.5}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="courses-section">
              <div className="courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title">Tous mes cours</h2>
                <div className="courses-filters" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <select className="filter-select">
                    <option>Tous les cours</option>
                    <option>Cours publiés</option>
                    <option>Brouillons</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingCourse(null);
                      setFormData({ title: '', description: '', category: '', duration: '', level: 'beginner', price: 0 });
                      setShowAddForm(true);
                    }}
                  >
                    + Créer un cours
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '10px', background: '#e3f2fd', color: '#1565c0', display: courses.length === 0 ? 'block' : 'none' }}>
                <p>ℹ️ Vous êtes connecté en tant que <strong>{user?.name}</strong>. Il y a <strong>{courses.length}</strong> cours publiés sur ce compte.</p>
              </div>

              <div className="courses-grid-premium">
                {courses.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#a0aec0', background: 'white', borderRadius: '8px' }}>
                    <h3>Vous n'avez pas encore publié de cours.</h3>
                    <button className="btn btn-primary" onClick={() => {
                      setEditingCourse(null);
                      setFormData({ title: '', description: '', category: '', duration: '', level: 'beginner', price: 0 });
                      setShowAddForm(true);
                    }} style={{ marginTop: '1rem' }}>
                      Créer mon premier cours
                    </button>
                  </div>
                )}
                {courses.map(course => (
                  <div key={course._id} className="course-card-premium">
                    <div className="course-image">
                      <img src={course.image || 'https://via.placeholder.com/300x200'} alt={course.title} />
                      <div className="course-actions-overlay">
                        <button className="action-btn edit-btn" onClick={() => handleEdit(course)}>
                          ✏️
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(course._id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>

                      {/* Affichage des fichiers */}
                      {course.files && course.files.length > 0 && (
                        <div className="course-files">
                          <h4>📁 Fichiers ({course.files.length})</h4>
                          <div className="files-list-small">
                            {course.files.map((file, index) => (
                              <div key={index} className="file-item-small">
                                <span className="file-icon">
                                  {file.type === 'image' ? '🖼️' : '📄'}
                                </span>
                                <a
                                  href={`http://localhost:5000${file.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-link-small"
                                >
                                  {file.originalName}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="course-meta">
                        <span className="course-category">{course.category}</span>
                        <span className="course-level">{course.level}</span>
                        <span className="course-duration">{course.duration}</span>
                      </div>
                      <div className="course-stats">
                        <span className="course-students">{course.enrolledStudents?.length || 0} étudiants</span>
                        <span className="course-rating">⭐ {course.rating || 4.5}</span>
                        <span className="course-price">€{course.price || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'analytics' && (
            <div className="analytics-section" style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h2 className="section-title" style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Analytiques de vos cours</h2>
              <p style={{ color: '#4a5568', marginBottom: '2rem' }}>Suivez les performances de vos cours et l'engagement de vos étudiants.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '1rem' }}>Inscriptions ce mois-ci</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>+24</div>
                  <p style={{ color: '#48bb78', fontSize: '0.9rem', marginTop: '0.5rem' }}>↗ 12% vs mois précédent</p>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '1rem' }}>Revenus estimés</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>€450.00</div>
                  <p style={{ color: '#48bb78', fontSize: '0.9rem', marginTop: '0.5rem' }}>↗ 5% vs mois précédent</p>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '1rem' }}>Taux de complétion moyen</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>68%</div>
                  <p style={{ color: '#a0aec0', fontSize: '0.9rem', marginTop: '0.5rem' }}>Sur l'ensemble de vos cours</p>
                </div>
              </div>

              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#2d3748', marginBottom: '1rem' }}>Cours les plus performants</h3>
                <div style={{ background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
                  {courses.length > 0 ? courses.slice(0, 3).map((course, idx) => (
                    <div key={idx} style={{ padding: '1rem 1.5rem', borderBottom: idx < 2 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '500', color: '#2d3748' }}>{course.title}</span>
                      <span style={{ color: '#718096' }}>{course.enrolledStudents?.length || 0} étudiants</span>
                    </div>
                  )) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>Aucune donnée disponible pour le moment.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="settings-section" style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
              <h2 className="section-title" style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Paramètres du profil</h2>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Nom complet</label>
                  <input type="text" defaultValue={user?.name} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Adresse Email</label>
                  <input type="email" defaultValue={user?.email} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} disabled />
                  <small style={{ color: '#a0aec0', marginTop: '0.25rem', display: 'block' }}>L'adresse email ne peut pas être modifiée.</small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Biographie de l'instructeur</label>
                  <textarea rows="4" placeholder="Parlez de votre expérience..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', resize: 'vertical' }}></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Expertise visée</label>
                  <input type="text" placeholder="ex: Développeur Web Senior, Expert Cybersecurité..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <button type="button" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Enregistrer les modifications</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main >

      {/* Create/Edit Course Modal */}
      {
        showAddForm && (
          <div className="modal-overlay">
            <div className="modal-premium">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingCourse ? 'Modifier le cours' : 'Créer un nouveau cours'}
                </h2>
                <button className="modal-close" onClick={() => setShowAddForm(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre du cours</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Catégorie</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fichiers du cours</label>
                  <FileUpload
                    onFileUploaded={(file) => setUploadedFiles([...uploadedFiles, file])}
                    onFileRemoved={(fileToRemove) => setUploadedFiles(uploadedFiles.filter(file => file.filename !== fileToRemove.filename))}
                    uploadedFiles={uploadedFiles}
                    maxFiles={5}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Durée</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="ex: 8 semaines"
                    />
                  </div>
                  <div className="form-group">
                    <label>Niveau</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Prix (€)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    min="0"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCourse ? 'Mettre à jour' : 'Créer'} le cours
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default InstructorDashboard;
