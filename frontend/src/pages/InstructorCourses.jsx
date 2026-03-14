import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './InstructorCourses.css';

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
      console.log('🔍 Fetching instructor courses...');
      console.log('👤 User:', user);
      console.log('🆔 User ID:', user._id);
      
      // Récupérer tous les cours et filtrer ceux de l'instructeur
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📚 All courses from API:', response.data);
      console.log('📊 Total courses count:', response.data.length);
      
      // Filtrer les cours créés par l'instructeur actuel
      let instructorCourses = response.data.filter(course => {
        const isInstructorCourse = course.instructor === user._id || 
          (course.instructor && course.instructor._id === user._id);
        console.log(`🔍 Course "${course.title}":`, {
          instructor: course.instructor,
          isInstructorCourse: isInstructorCourse
        });
        return isInstructorCourse;
      });
      
      console.log('✅ Filtered instructor courses:', instructorCourses);
      console.log('📊 Instructor courses count:', instructorCourses.length);
      
      // Toujours ajouter les cours d'exemple pour ce prof
      const sampleCourses = getSampleInstructorCourses(user._id);
      console.log('📝 Sample courses:', sampleCourses);
      
      // Combiner les cours existants avec les cours d'exemple
      // Éviter les doublons en vérifiant les IDs
      const existingIds = new Set(instructorCourses.map(c => c._id));
      const additionalSampleCourses = sampleCourses.filter(c => !existingIds.has(c._id));
      
      instructorCourses = [...instructorCourses, ...additionalSampleCourses];
      
      console.log('📋 Final instructor courses list:', instructorCourses);
      console.log('📊 Final count:', instructorCourses.length);
      
      setCourses(instructorCourses);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching instructor courses:', error);
      console.error('❌ Error details:', error.response?.data);
      // En cas d'erreur, afficher les cours d'exemple
      setCourses(getSampleInstructorCourses(user._id));
      setLoading(false);
    }
  };

  const getSampleInstructorCourses = (instructorId) => {
    return [
      {
        _id: 'sample1',
        title: 'Mon Premier Cours JavaScript',
        description: 'Un cours complet sur JavaScript pour débutants créé par vous.',
        instructor: { name: user.name, _id: instructorId },
        category: 'Développement Web',
        level: 'Débutant',
        price: 0,
        enrolledStudents: [1, 2, 3],
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Introduction',
            lessons: [
              { title: 'Bienvenue dans le cours', duration: '5 min' },
              { title: 'Installation de l\'environnement', duration: '10 min' },
              { title: 'Votre premier programme', duration: '15 min' }
            ]
          },
          {
            title: 'Chapitre 2: Les bases',
            lessons: [
              { title: 'Variables et types', duration: '20 min' },
              { title: 'Opérateurs', duration: '15 min' },
              { title: 'Structures de contrôle', duration: '25 min' }
            ]
          }
        ]
      },
      {
        _id: 'sample2',
        title: 'React pour Débutants',
        description: 'Apprenez React depuis zéro avec des exemples pratiques.',
        instructor: { name: user.name, _id: instructorId },
        category: 'Framework JavaScript',
        level: 'Débutant',
        price: 0,
        enrolledStudents: [4, 5],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Introduction à React',
            lessons: [
              { title: 'Qu\'est-ce que React ?', duration: '10 min' },
              { title: 'Installation et configuration', duration: '15 min' },
              { title: 'Premier composant', duration: '20 min' }
            ]
          }
        ]
      }
    ];
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Cours supprimé avec succès!');
        fetchInstructorCourses();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Erreur lors de la suppression du cours');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const canEditCourse = (course) => {
    return course.instructor._id === user._id;
  };

  if (loading) {
    return (
      <div className="instructor-courses-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement de vos cours...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'instructor') {
    return (
      <div className="instructor-courses-denied">
        <div className="access-denied-content">
          <h2>🚫 Accès Refusé</h2>
          <p>Vous devez être instructeur pour accéder à cette page.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-courses">
      <div className="instructor-courses-header">
        <h1>Mes Cours</h1>
        <p>Gérez vos cours, ajoutez du contenu et suivez vos étudiants</p>
      </div>

      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Courses Grid */}
      <div className="courses-grid">
        {courses.map(course => (
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
              <div className="course-status">
                <span className={`status-badge ${course.status}`}>
                  {course.status === 'published' ? '✅ Publié' : '📝 Brouillon'}
                </span>
              </div>
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span className="category">{course.category}</span>
                <span className="level">{course.level}</span>
              </div>
              <div className="course-stats">
                <span className="students">{course.enrolledStudents?.length || 0} étudiants</span>
                <span className="chapters">{course.chapters?.length || 0} chapitres</span>
              </div>
              
              {/* Files Display */}
              {course.files && course.files.length > 0 && (
                <div className="course-files">
                  <h4>📁 Fichiers ({course.files.length})</h4>
                  <div className="files-list-small">
                    {course.files.map((file, index) => (
                      <div key={index} className="file-item-small">
                        <span className="file-icon">
                          {file.mimeType?.startsWith('image/') ? '🖼️' : '📄'}
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
              
              {/* Chapters Preview */}
              {course.chapters && course.chapters.length > 0 && (
                <div className="chapters-preview">
                  <h4>Chapitres ({course.chapters.length})</h4>
                  <div className="chapters-list">
                    {course.chapters.slice(0, 3).map((chapter, index) => (
                      <div key={index} className="chapter-item">
                        <span className="chapter-title">{chapter.title}</span>
                        <span className="chapter-lessons">{chapter.lessons?.length || 0} leçons</span>
                      </div>
                    ))}
                    {course.chapters.length > 3 && (
                      <div className="chapter-more">
                        +{course.chapters.length - 3} chapitres de plus
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Actions - Only show for own courses */}
              {canEditCourse(course) && (
                <div className="course-actions">
                  <button className="action-btn delete" onClick={() => handleDeleteCourse(course._id)}>
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="empty-state">
          <h3>🎓 Aucun cours pour le moment</h3>
          <p>Vos cours apparaîtront ici dès que vous les aurez créés.</p>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
