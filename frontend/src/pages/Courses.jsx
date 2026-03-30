import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import './Courses.css';
import { BarChart, BookOpen, Clipboard, Laptop, MonitorPlay, Rocket, Search, Smartphone, Target, Users } from 'lucide-react';


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const location = useLocation();

  useEffect(() => {
    // Vérifier s'il y a un paramètre de catégorie dans l'URL
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      // Mapper les catégories de certification vers les filtres de cours
      const categoryMap = {
        'web-development': 'Développement Web',
        'data-science': 'Data Science',
        'design': 'Design',
        'cloud': 'Cloud',
        'cybersecurity': 'Cybersécurité',
        'mobile': 'Mobile'
      };
      
      const mappedCategory = categoryMap[categoryParam] || 'All';
      setFilterCategory(mappedCategory);
      console.log(`<span className="icon-wrapper"><Target size={18} /></span> Filtering courses by category: ${mappedCategory}`);
    }
    
    console.log('<span className="icon-wrapper"><Rocket size={18} /></span> Loading default courses immediately...');
    const defaultCourses = getDefaultCourses();
    setCourses(defaultCourses);
    setLoading(false);
    
    // Récupérer les cours depuis l'API pour inclure les cours des instructeurs
    const fetchCoursesFromAPI = async () => {
      try {
        console.log('<span className="icon-wrapper"><Search size={18} /></span> Fetching courses from API in background...');
        const res = await axios.get(`${API_BASE_URL}/api/courses`);
        let apiCourses = res.data;
        
        console.log('<span className="icon-wrapper"><BookOpen size={18} /></span> API courses loaded:', apiCourses.length);
        console.log('<span className="icon-wrapper"><Clipboard size={18} /></span> API courses details:', apiCourses.map(c => ({ id: c._id, title: c.title, instructor: c.instructor })));
        
        // Combiner avec les cours par défaut
        const existingIds = new Set(apiCourses.map(c => c._id));
        const additionalDefaultCourses = defaultCourses.filter(c => !existingIds.has(c._id));
        
        const allCourses = [...apiCourses, ...additionalDefaultCourses];
        
        console.log('<span className="icon-wrapper"><Clipboard size={18} /></span> Final courses list:', allCourses.length);
        console.log('<span className="icon-wrapper"><Clipboard size={18} /></span> Final courses details:', allCourses.map(c => ({ id: c._id, title: c.title, instructor: c.instructor })));
        setCourses(allCourses);
      } catch (error) {
        console.error('Error fetching courses from API:', error);
      }
    };
    
    fetchCoursesFromAPI();
  }, []);

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
        image: 'https://picsum.photos/seed/javascript-course/400/250.jpg',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Introduction à JavaScript',
            lessons: [
              { title: 'Qu\'est-ce que JavaScript ?', duration: '5 min' },
              { title: 'Historique et évolution', duration: '8 min' },
              { title: 'JavaScript vs autres langages', duration: '6 min' }
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
        image: 'https://picsum.photos/seed/react-advanced/400/250.jpg',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Hooks React',
            lessons: [
              { title: 'useState et useEffect', duration: '20 min' },
              { title: 'useContext et useReducer', duration: '15 min' }
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
        image: 'https://picsum.photos/seed/python-datascience/400/250.jpg',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: NumPy',
            lessons: [
              { title: 'Arrays NumPy', duration: '15 min' },
              { title: 'Opérations mathématiques', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '4',
        title: 'UI/UX Design Fundamentals',
        description: 'Apprenez les principes fondamentaux du design d\'interface utilisateur et d\'expérience utilisateur.',
        instructor: { name: 'Sophie Bernard', _id: 'prof4' },
        category: 'Design',
        level: 'Débutant',
        enrolledStudents: [16, 17, 18],
        image: 'https://picsum.photos/seed/design-ux/400/250.jpg',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Principes de base',
            lessons: [
              { title: 'Introduction à l\'UI/UX', duration: '10 min' },
              { title: 'Théorie des couleurs', duration: '15 min' }
            ]
          }
        ]
      },
      {
        _id: '5',
        title: 'Node.js Backend Development',
        description: 'Créez des applications backend robustes avec Node.js, Express et MongoDB.',
        instructor: { name: 'Thomas Robert', _id: 'prof5' },
        category: 'Backend',
        level: 'Intermédiaire',
        enrolledStudents: [19, 20, 21, 22],
        image: 'https://picsum.photos/seed/nodejs-backend/400/250.jpg',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Introduction à Node.js',
            lessons: [
              { title: 'Installation et configuration', duration: '8 min' },
              { title: 'Modules et npm', duration: '12 min' }
            ]
          }
        ]
      },
      {
        _id: '6',
        title: 'Machine Learning Basics',
        description: 'Introduction aux concepts fondamentaux du machine learning avec Python.',
        instructor: { name: 'Claire Dubois', _id: 'prof6' },
        category: 'Intelligence Artificielle',
        level: 'Intermédiaire',
        enrolledStudents: [23, 24, 25, 26, 27],
        image: 'https://picsum.photos/seed/machine-learning/400/250.jpg',
        duration: '8 weeks',
        rating: 4.7
      },
      {
        _id: '7',
        title: 'AWS Cloud Fundamentals',
        description: 'Apprenez les bases d\'Amazon Web Services et du cloud computing.',
        instructor: { name: 'Lucas Petit', _id: 'prof7' },
        category: 'Cloud',
        level: 'Débutant',
        enrolledStudents: [28, 29, 30, 31, 32],
        image: 'https://picsum.photos/seed/aws-cloud/400/250.jpg',
        duration: '6 weeks',
        rating: 4.8
      },
      {
        _id: '8',
        title: 'Cybersécurité Essentielle',
        description: 'Maîtrisez les fondamentaux de la sécurité informatique et de la protection des données.',
        instructor: { name: 'Isabelle Martin', _id: 'prof8' },
        category: 'Cybersécurité',
        level: 'Intermédiaire',
        enrolledStudents: [33, 34, 35, 36, 37],
        image: 'https://picsum.photos/seed/cybersecurity/400/250.jpg',
        duration: '10 weeks',
        rating: 4.6
      },
      {
        _id: '9',
        title: 'Développement Mobile React Native',
        description: 'Créez des applications mobiles natives pour iOS et Android avec React Native.',
        instructor: { name: 'Marc Bernard', _id: 'prof9' },
        category: 'Mobile',
        level: 'Intermédiaire',
        enrolledStudents: [38, 39, 40, 41, 42],
        image: 'https://picsum.photos/seed/react-native/400/250.jpg',
        duration: '12 weeks',
        rating: 4.7
      }
    ];
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCourses = filteredCourses.sort((a, b) => {
    // Sort by enrolled students count (descending)
    return b.enrolledStudents.length - a.enrolledStudents.length;
  });

  const categories = [
    { name: 'All', icon: '<span className="icon-wrapper"><BookOpen size={18} /></span>' },
    { name: 'Développement Web', icon: '<span className="icon-wrapper"><Laptop size={18} /></span>' },
    { name: 'Framework JavaScript', icon: '⚛️' },
    { name: 'Data Science', icon: '<span className="icon-wrapper"><BarChart size={18} /></span>' },
    { name: 'Design', icon: '🎨' },
    { name: 'Backend', icon: '🔧' },
    { name: 'Intelligence Artificielle', icon: '🤖' },
    { name: 'Cloud', icon: '☁️' },
    { name: 'Cybersécurité', icon: '🔒' },
    { name: 'Mobile', icon: '<span className="icon-wrapper"><Smartphone size={18} /></span>' }
  ];

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Header */}
      <div className="courses-header">
        <h1>Discover Courses</h1>
        <p>Explore our comprehensive catalog of courses and start learning today</p>
        <div className="courses-count-header">
          <span className="count-badge">{sortedCourses.length} Courses Available</span>
        </div>
      </div>

      {/* Controls */}
      <div className="courses-controls">
        <div className="container-lg">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon"><span className="icon-wrapper"><Search size={18} /></span></span>
          </div>

          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`filter-btn ${filterCategory === cat.name ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat.name)}
              >
                <span className="filter-icon">{cat.icon}</span>
                <span className="filter-text">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="courses-section">
        <div className="container-lg">
          {sortedCourses.length > 0 ? (
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
                          <span className="course-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
                        </div>
                      )}
                    </div>
                    <div className="course-content">
                      <div className="course-category">{course.category}</div>
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>
                      <div className="course-meta">
                        <span className="course-instructor"><span className="icon-wrapper"><MonitorPlay size={18} /></span> {course.instructor.name}</span>
                        <span className="course-level"><span className="icon-wrapper"><BarChart size={18} /></span> {course.level}</span>
                        <span className="course-students"><span className="icon-wrapper"><Users size={18} /></span> {course.enrolledStudents.length} students</span>
                      </div>
                      <div className="course-footer">
                        <Link to={`/courses/${course._id}`} className="btn btn-primary">
                          View Course →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-courses">
              <div className="no-courses-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
              <h3>No courses found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
