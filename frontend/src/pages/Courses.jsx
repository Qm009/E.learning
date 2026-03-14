import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const location = useLocation();

  // Charger immédiatement les cours par défaut
  useEffect(() => {
    console.log('🚀 Loading default courses immediately...');
    const defaultCourses = getDefaultCourses();
    setCourses(defaultCourses);
    setLoading(false);
    
    // Puis charger les cours de l'API en arrière-plan
    const fetchCoursesFromAPI = async () => {
      try {
        console.log('🔍 Fetching courses from API in background...');
        const res = await axios.get('http://localhost:5000/api/courses');
        let apiCourses = res.data;
        
        console.log('📚 API courses loaded:', apiCourses.length);
        
        // Combiner avec les cours par défaut
        const existingIds = new Set(apiCourses.map(c => c._id));
        const additionalDefaultCourses = defaultCourses.filter(c => !existingIds.has(c._id));
        
        const allCourses = [...apiCourses, ...additionalDefaultCourses];
        
        console.log('📋 Final courses list:', allCourses.length);
        setCourses(allCourses);
      } catch (error) {
        console.error('Error fetching courses from API:', error);
        // Garder les cours par défaut si l'API échoue
      }
    };
    
    fetchCoursesFromAPI();
  }, []);

  // Fonction pour obtenir les cours par défaut (même que dans AdminDashboard)
  const getDefaultCourses = () => {
    return [
      {
        _id: '1',
        title: 'Introduction à JavaScript',
        description: 'Apprenez les bases de JavaScript, le langage de programmation le plus populaire pour le développement web.',
        instructor: { name: 'Jean Dupont', _id: 'prof1' },
        category: 'Développement Web',
        level: 'Débutant',
        enrolledStudents: [1, 2, 3, 4, 5],
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Introduction à JavaScript',
            lessons: [
              { title: 'Qu\'est-ce que JavaScript ?', duration: '5 min' },
              { title: 'Historique et évolution', duration: '8 min' },
              { title: 'JavaScript vs autres langages', duration: '6 min' }
            ]
          },
          {
            title: 'Chapitre 2: Variables et types de données',
            lessons: [
              { title: 'Déclaration de variables', duration: '10 min' },
              { title: 'Types primitifs', duration: '12 min' },
              { title: 'Conversion de types', duration: '8 min' }
            ]
          },
          {
            title: 'Chapitre 3: Fonctions',
            lessons: [
              { title: 'Déclaration de fonctions', duration: '15 min' },
              { title: 'Paramètres et retour', duration: '10 min' },
              { title: 'Fonctions fléchées', duration: '7 min' }
            ]
          }
        ]
      },
      {
        _id: '2',
        title: 'React Avancé',
        description: 'Maîtrisez React avec les hooks, Redux et les meilleures pratiques de développement.',
        instructor: { name: 'Marie Martin', _id: 'prof2' },
        category: 'Framework JavaScript',
        level: 'Intermédiaire',
        enrolledStudents: [6, 7, 8, 9],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Hooks React',
            lessons: [
              { title: 'useState et useEffect', duration: '20 min' },
              { title: 'useContext et useReducer', duration: '15 min' },
              { title: 'Créer des hooks personnalisés', duration: '18 min' }
            ]
          },
          {
            title: 'Chapitre 2: Redux avec Redux Toolkit',
            lessons: [
              { title: 'Introduction à Redux', duration: '12 min' },
              { title: 'Redux Toolkit', duration: '25 min' },
              { title: 'Middleware et async actions', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '3',
        title: 'Python pour Data Science',
        description: 'Explorez Python avec Pandas, NumPy et Matplotlib pour l\'analyse de données.',
        instructor: { name: 'Pierre Durand', _id: 'prof3' },
        category: 'Data Science',
        level: 'Intermédiaire',
        enrolledStudents: [10, 11, 12, 13, 14, 15],
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: NumPy',
            lessons: [
              { title: 'Arrays NumPy', duration: '15 min' },
              { title: 'Opérations mathématiques', duration: '18 min' },
              { title: 'Indexation et slicing', duration: '12 min' }
            ]
          },
          {
            title: 'Chapitre 2: Pandas',
            lessons: [
              { title: 'DataFrames et Series', duration: '22 min' },
              { title: 'Nettoyage de données', duration: '25 min' },
              { title: 'Analyse exploratoire', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '4',
        title: 'Design UI/UX',
        description: 'Apprenez les principes du design d\'interface et d\'expérience utilisateur.',
        instructor: { name: 'Sophie Lemaire', _id: 'prof4' },
        category: 'Design',
        level: 'Débutant',
        enrolledStudents: [16, 17, 18],
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c3?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Principes du design',
            lessons: [
              { title: 'Théorie des couleurs', duration: '15 min' },
              { title: 'Typographie', duration: '12 min' },
              { title: 'Composition et équilibre', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '5',
        title: 'Node.js Backend',
        description: 'Créez des serveurs robustes avec Node.js, Express et MongoDB.',
        instructor: { name: 'Thomas Bernard', _id: 'prof5' },
        category: 'Backend',
        level: 'Intermédiaire',
        enrolledStudents: [19, 20, 21, 22],
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Express.js',
            lessons: [
              { title: 'Configuration d\'Express', duration: '15 min' },
              { title: 'Routes et middleware', duration: '20 min' },
              { title: 'Gestion des erreurs', duration: '12 min' }
            ]
          }
        ]
      },
      {
        _id: '6',
        title: 'HTML5 & CSS3 Complet',
        description: 'Maîtrisez les fondamentaux du web avec HTML5 et CSS3.',
        instructor: { name: 'Claire Petit', _id: 'prof6' },
        category: 'Développement Web',
        level: 'Débutant',
        enrolledStudents: [23, 24, 25, 26],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: HTML5',
            lessons: [
              { title: 'Structure de base', duration: '12 min' },
              { title: 'Formulaires HTML5', duration: '18 min' },
              { title: 'Multimédia et sémantique', duration: '15 min' }
            ]
          },
          {
            title: 'Chapitre 2: CSS3',
            lessons: [
              { title: 'Sélecteurs et propriétés', duration: '20 min' },
              { title: 'Flexbox et Grid', duration: '25 min' },
              { title: 'Animations et transitions', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '7',
        title: 'Vue.js Moderne',
        description: 'Apprenez Vue.js 3 avec Composition API et les meilleures pratiques.',
        instructor: { name: 'Lucas Girard', _id: 'prof7' },
        category: 'Framework JavaScript',
        level: 'Intermédiaire',
        enrolledStudents: [27, 28, 29],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Vue.js 3',
            lessons: [
              { title: 'Installation et setup', duration: '10 min' },
              { title: 'Composition API', duration: '22 min' },
              { title: 'Reactivité avancée', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '8',
        title: 'Machine Learning',
        description: 'Introduction au machine learning avec Python et scikit-learn.',
        instructor: { name: 'Emma Robert', _id: 'prof8' },
        category: 'Intelligence Artificielle',
        level: 'Avancé',
        enrolledStudents: [30, 31, 32],
        image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Fondamentaux du ML',
            lessons: [
              { title: 'Types d\'apprentissage', duration: '15 min' },
              { title: 'Préparation des données', duration: '20 min' },
              { title: 'Évaluation des modèles', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '9',
        title: 'Docker et Conteneurs',
        description: 'Apprenez à containeriser vos applications avec Docker.',
        instructor: { name: 'Nicolas Dubois', _id: 'prof9' },
        category: 'DevOps',
        level: 'Intermédiaire',
        enrolledStudents: [33, 34],
        image: 'https://images.unsplash.com/photo-1603895123512-6a4f2a4e5b7f?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Docker',
            lessons: [
              { title: 'Introduction aux conteneurs', duration: '12 min' },
              { title: 'Dockerfiles et images', duration: '25 min' },
              { title: 'Docker Compose', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '10',
        title: 'Git et GitHub',
        description: 'Maîtrisez le contrôle de version avec Git et GitHub.',
        instructor: { name: 'Camille Leroy', _id: 'prof10' },
        category: 'Outils Développement',
        level: 'Débutant',
        enrolledStudents: [35, 36, 37, 38, 39],
        image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Git',
            lessons: [
              { title: 'Installation et configuration', duration: '8 min' },
              { title: 'Commandes de base', duration: '15 min' },
              { title: 'Branches et fusion', duration: '20 min' }
            ]
          },
          {
            title: 'Chapitre 2: GitHub',
            lessons: [
              { title: 'Créer un repository', duration: '10 min' },
              { title: 'Pull requests et collaboration', duration: '18 min' },
              { title: 'Actions et CI/CD', duration: '22 min' }
            ]
          }
        ]
      },
      {
        _id: '11',
        title: 'UX/UI Design Fondamentaux',
        description: 'Apprenez les principes du design d\'interface et de l\'expérience utilisateur.',
        instructor: { name: 'Claire Bernard', _id: 'prof11' },
        category: 'Design',
        level: 'Débutant',
        enrolledStudents: [40, 41, 42, 43],
        image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Principes du Design',
            lessons: [
              { title: 'Théorie des couleurs', duration: '15 min' },
              { title: 'Typographie', duration: '18 min' },
              { title: 'Composition et mise en page', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '12',
        title: 'Node.js Backend Development',
        description: 'Créez des serveurs web robustes avec Node.js et Express.',
        instructor: { name: 'Thomas Petit', _id: 'prof12' },
        category: 'Développement Web',
        level: 'Intermédiaire',
        enrolledStudents: [44, 45, 46],
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Node.js Basics',
            lessons: [
              { title: 'Installation et configuration', duration: '10 min' },
              { title: 'Modules et npm', duration: '15 min' },
              { title: 'Serveur HTTP simple', duration: '12 min' }
            ]
          }
        ]
      },
      {
        _id: '13',
        title: 'Marketing Digital',
        description: 'Stratégies de marketing en ligne pour les entreprises modernes.',
        instructor: { name: 'Sophie Leroy', _id: 'prof13' },
        category: 'Marketing',
        level: 'Débutant',
        enrolledStudents: [47, 48, 49, 50, 51],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Fondamentaux du Marketing',
            lessons: [
              { title: 'SEO et référencement', duration: '25 min' },
              { title: 'Marketing des réseaux sociaux', duration: '20 min' },
              { title: 'Email marketing', duration: '15 min' }
            ]
          }
        ]
      },
      {
        _id: '14',
        title: 'Cybersécurité',
        description: 'Protégez vos systèmes et données contre les menaces informatiques.',
        instructor: { name: 'Lucas Martin', _id: 'prof14' },
        category: 'Sécurité',
        level: 'Avancé',
        enrolledStudents: [52, 53],
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Sécurité des réseaux',
            lessons: [
              { title: 'Cryptographie', duration: '20 min' },
              { title: 'Firewalls et VPN', duration: '18 min' },
              { title: 'Détection d\'intrusions', duration: '22 min' }
            ]
          }
        ]
      },
      {
        _id: '15',
        title: 'Blockchain et Cryptomonnaies',
        description: 'Comprendre la technologie blockchain et les cryptomonnaies.',
        instructor: { name: 'Maxime Dubois', _id: 'prof15' },
        category: 'Blockchain',
        level: 'Intermédiaire',
        enrolledStudents: [54, 55, 56],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Introduction à la Blockchain',
            lessons: [
              { title: 'Principes de la blockchain', duration: '15 min' },
              { title: 'Bitcoin et cryptomonnaies', duration: '20 min' },
              { title: 'Smart Contracts', duration: '18 min' }
            ]
          }
        ]
      }
    ];
  };

  // read tag from query (?tag=expert) to pre-filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get('tag');
    if (tag) {
      setFilterCategory(tag);
    }
  }, [location.search]);

  // clear filters when location changes away from /courses
  useEffect(() => {
    if (location.pathname !== '/courses') {
      setFilterCategory('All');
      setSearchTerm('');
    }
  }, [location.search]);

  // Filtrer les cours
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('🔍 Filtered courses:', {
    total: courses.length,
    searchTerm,
    filterCategory,
    filtered: filteredCourses.length,
    filteredCourses: filteredCourses.map(c => ({ id: c._id, title: c.title }))
  });

  // Trier par date de création (plus récents d'abord)
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const dateA = new Date(a.createdAt || a._id);
    const dateB = new Date(b.createdAt || b._id);
    return dateB - dateA;
  });

  console.log('📊 Sorted courses:', sortedCourses.length);

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  return (
    <div className="courses-page">
      {/* Header */}
      <div className="courses-header">
        <div className="container-lg">
          <h1>🚀 MODIFIED Explore Our Courses 🚀</h1>
          <p>Find the perfect course to advance your skills</p>
          <div className="courses-count-header">
            <span className="count-badge">{courses.length} Courses Available</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="courses-controls">
        <div className="container-lg">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-section">
        <div className="container-lg">
          {/* Debug Info */}
          <div style={{background: '#f0f0f0', padding: '10px', marginBottom: '20px', borderRadius: '5px'}}>
            <h4>Debug Info:</h4>
            <p>Loading: {loading.toString()}</p>
            <p>Total Courses: {courses.length}</p>
            <p>Filtered Courses: {filteredCourses.length}</p>
            <p>Sorted Courses: {sortedCourses.length}</p>
            <p>Search Term: "{searchTerm}"</p>
            <p>Filter Category: "{filterCategory}"</p>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              <p className="courses-count">{sortedCourses.length} courses found</p>
              <div className="courses-grid">
                {sortedCourses.map(course => (
                  <div key={course._id} className="course-card">
                    <div className="course-image">
                      {course.image ? (
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="course-image-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://picsum.photos/seed/${course._id}/400/250.jpg`;
                          }}
                        />
                      ) : (
                        <div className="course-image-placeholder" style={{background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}}>
                          <span className="course-icon">📚</span>
                        </div>
                      )}
                      <span className="course-category">{course.category}</span>
                    </div>

                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>

                      <div className="course-meta">
                        <div className="instructor">
                          <span className="avatar">{course.instructor?.name?.charAt(0).toUpperCase()}</span>
                          <div>
                            <p className="meta-label">Instructor</p>
                            <p className="instructor-name">{course.instructor?.name || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="level">
                          <p className="meta-label">Level</p>
                          <p className="level-value">{course.level}</p>
                        </div>
                      </div>

                      <div className="course-stats">
                        <div className="stat">
                          <span className="stat-icon">📚</span>
                          <span>{course.chapters?.length || 0} chapters</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">👥</span>
                          <span>{course.enrolledStudents?.length || 0} students</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">📊</span>
                          <span>{course.lessons?.length || (course.chapters?.length || 0) * 3} lessons</span>
                        </div>
                      </div>

                      <div className="course-actions">
                        <Link to={`/courses/${course._id}`} className="btn btn-primary">
                          View Course Content
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <p className="no-results-icon">🔍</p>
              <h3>No Courses Found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;