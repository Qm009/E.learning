import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../api';
import './Courses.css';
import '../components/CourseFiles.css';
import { BarChart, Book, BookOpen, Check, GraduationCap, Timer, Trophy, Users } from 'lucide-react';


// Styles pour les chapitres
const chapterStyles = `
  .chapter-content {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .chapter-content:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .chapter-content h4 {
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  .chapter-content p {
    color: #4a5568;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .chapter-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #718096;
  }
  
  .no-chapters {
    text-align: center;
    padding: 2rem;
    color: #718096;
  }
  
  .no-chapters p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .chapter-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .chapter-modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #718096;
  }
`;

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      let fetchedCourseData = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/courses/${id}`);
        if (response.data && response.data._id) {
          setCourse(response.data);
          fetchedCourseData = response.data;
          
          const userProgress = await loadUserProgress(response.data._id);
          if (userProgress) {
            setProgress(userProgress.progress);
            setCompletedChapters(userProgress.completedChapters);
            setIsCompleted(userProgress.isCompleted);
          }
        }
      } catch (err) {
        console.error('Failed to load course, falling back to demo:', err);
      }

      if (fetchedCourseData && !fetchedCourseData._id.toString().startsWith('demo')) {
        setCourse(fetchedCourseData);
        setLoading(false);
        return;
      }

      const defaultCourses = [
        {
          _id: '1', 
          title: 'Introduction à JavaScript', 
          description: 'Apprenez les bases de JavaScript, le langage de programmation le plus populaire pour le développement web moderne. Ce cours complet vous mènera de la syntaxe de base aux concepts avancés.',
          instructor: { name: 'Jean Dupont', _id: 'prof1' }, 
          price: 0, 
          category: 'Développement Web',
          chapters: [
            {
              title: 'Chapitre 1: Introduction à JavaScript',
              content: 'Dans ce premier chapitre, nous allons découvrir ce qu\'est JavaScript et pourquoi il est devenu incontournable pour le développement web moderne. JavaScript (souvent abrégé en JS) est un langage de programmation de haut niveau, souvent compilé à la volée, et multi-paradigme.\n\nIl a été créé en 10 jours en 1995 par Brendan Eich alors qu\'il travaillait chez Netscape Communications. D\'abord appelé Mocha, puis LiveScript, il a finalement été renommé JavaScript pour surfer sur la popularité de Java à l\'époque (bien que les deux langages n\'aient que très peu en commun).\n\nAujourd\'hui, JS s\'exécute non seulement dans les navigateurs grâce à des moteurs performants comme V8, mais aussi côté serveur avec Node.js. C\'est ce qui en fait l\'un des langages les plus polyvalents au monde.',
              videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
              lessons: [
                { 
                  title: 'Qu\'est-ce que JavaScript ?', 
                  duration: '5 min', 
                  content: 'JavaScript permet d\'ajouter de l\'interactivité à vos pages HTML. Nous verrons comment manipuler le DOM et répondre aux actions des utilisateurs.', 
                  videoUrl: 'https://www.youtube.com/embed/upDLs1sn7g4' 
                },
                { 
                  title: 'Votre premier programme JavaScript', 
                  duration: '10 min', 
                  content: 'Créez votre premier programme "Hello World" en JavaScript. Apprenez la structure de base d\'un programme et comment l\'exécuter dans votre navigateur.' 
                }
              ]
            },
            {
              title: 'Chapitre 2: Variables et Types de Données',
              content: 'Une variable est un conteneur permettant de stocker une valeur. En JavaScript moderne, on utilise principalement let et const pour déclarer des variables, remplaçant ainsi l\'ancien mot-clé var qui présentait des comportements liés à sa portée (scope) parfois imprévisibles.\n\nJavaScript propose plusieurs types primitifs : Number, String, Boolean, Undefined, Null, Symbol, et BigInt. Notez que JS a un typage dynamique, ce qui signifie qu\'une même variable peut contenir d\'abord un nombre, puis ensuite une chaîne de caractères.',
              videoUrl: 'https://www.youtube.com/embed/1OsGxDqvbNI',
              lessons: [
                { 
                  title: 'Déclaration de variables', 
                  duration: '7 min', 
                  content: 'Les mots-clés let et const permettent de déclarer des variables avec des portées différentes. let est pour les variables qui peuvent changer, const pour les constantes.' 
                },
                { 
                  title: 'Types de données primitifs', 
                  duration: '8 min', 
                  content: 'Découvrez les types de base : nombres, chaînes, booléens, et comment les convertir entre eux.' 
                },
                { 
                  title: 'Opérateurs et expressions', 
                  duration: '12 min', 
                  content: 'Apprenez à utiliser les opérateurs arithmétiques, de comparaison et logiques pour créer des expressions complexes.' 
                }
              ]
            }
          ]
        },
        {
          _id: '2', 
          title: 'React Avancé', 
          description: 'Maîtrisez React avec les hooks, Redux et les meilleures pratiques de développement. Ce cours avancé vous transformera en développeur React expert.',
          instructor: { name: 'Marie Martin', _id: 'prof2' }, 
          price: 0, 
          category: 'Framework JavaScript',
          chapters: [
            {
              title: 'Chapitre 1: Hooks React Fondamentaux',
              content: 'Les Hooks ont révolutionné la façon dont nous écrivons des composants React. Introduits dans la version 16.8, ils permettent d\'utiliser l\'état et d\'autres fonctionnalités de React sans avoir à écrire de classes.\n\nLe hook le plus utilisé est useState, qui permet de conserver un état local. Vient ensuite useEffect, qui gère les effets de bord (comme les appels API ou les abonnements). En maîtrisant ces hooks de base, vous pourrez pratiquement tout construire.',
              videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
              lessons: [
                { 
                  title: 'useState et setState', 
                  duration: '15 min', 
                  content: 'Apprenez le hook le plus fondamental de React. Découvrez comment créer et mettre à jour l\'état dans vos composants fonctionnels.' 
                },
                { 
                  title: 'useEffect pour les effets de bord', 
                  duration: '18 min', 
                  content: 'Maîtrisez useEffect pour gérer les appels API, les abonnements et autres effets de bord dans vos applications React.' 
                },
                { 
                  title: 'Créer des hooks personnalisés', 
                  duration: '20 min', 
                  content: 'Apprenez à créer vos propres hooks pour réutiliser la logique dans toute votre application.' 
                }
              ]
            },
            {
              title: 'Chapitre 2: Gestion d\'État Avancée',
              content: 'Découvrez des techniques avancées pour gérer l\'état complexe dans les applications React. Nous explorerons useReducer, useContext et les patterns de gestion d\'état.',
              videoUrl: 'https://www.youtube.com/embed/5N2ZpYqB7gE',
              lessons: [
                { 
                  title: 'useReducer pour les états complexes', 
                  duration: '25 min', 
                  content: 'Quand useState devient insuffisant, découvrez useReducer pour gérer des états complexes avec des transitions prévisibles.' 
                },
                { 
                  title: 'Contexte React avec useContext', 
                  duration: '22 min', 
                  content: 'Partagez l\'état entre composants sans passer par les props. Idéal pour les thèmes, l\'authentification et les configurations globales.' 
                }
              ]
            }
          ]
        },
        {
          _id: '3', 
          title: 'Python pour Data Science', 
          description: 'Explorez Python avec Pandas, NumPy et Matplotlib pour l\'analyse de données. Devenez expert en data science avec ce cours complet.',
          instructor: { name: 'Pierre Durand', _id: 'prof3' }, 
          price: 0, 
          category: 'Data Science',
          chapters: [
            {
              title: 'Chapitre 1: Introduction à Python',
              content: 'Python est un langage de programmation puissant et polyvalent, parfait pour la data science. Dans ce chapitre, nous découvrirons sa syntaxe élégante et ses caractéristiques principales.',
              videoUrl: 'https://www.youtube.com/embed/rfscvsVL97g',
              lessons: [
                { 
                  title: 'Installation et configuration', 
                  duration: '8 min', 
                  content: 'Guide complet pour installer Python sur votre système et configurer votre environnement de développement.' 
                },
                { 
                  title: 'Syntaxe de base', 
                  duration: '12 min', 
                  content: 'Apprenez les fondamentaux : variables, types de données, structures de contrôle et fonctions.' 
                }
              ]
            },
            {
              title: 'Chapitre 2: NumPy et Pandas',
              content: 'NumPy et Pandas sont les bibliothèques essentielles pour la manipulation et l\'analyse de données en Python.',
              videoUrl: 'https://www.youtube.com/embed/9mF3uXgPHEQ',
              lessons: [
                { 
                  title: 'Introduction à NumPy', 
                  duration: '15 min', 
                  content: 'Découvrez NumPy, la bibliothèque fondamentale pour le calcul numérique et la manipulation de tableaux en Python.' 
                },
                { 
                  title: 'Manipulation de données avec Pandas', 
                  duration: '20 min', 
                  content: 'Apprenez à utiliser les DataFrames Pandas pour filtrer, transformer et analyser des données tabulaires.' 
                }
              ]
            }
          ]
        },
        {
          _id: '4', 
          title: 'UI/UX Design Fundamentals', 
          description: 'Apprenez les principes fondamentaux du design d\'interface utilisateur et d\'expérience utilisateur. Devenez designer UI/UX professionnel.',
          instructor: { name: 'Sophie Bernard', _id: 'prof4' }, 
          price: 0, 
          category: 'Design',
          chapters: [
            {
              title: 'Chapitre 1: Principes du Design UI',
              content: 'Le design d\'interface utilisateur (UI) se concentre sur l\'apparence visuelle et l\'interactivité. Nous explorerons les principes fondamentaux : hiérarchie visuelle, contraste, espacement et typographie.',
              videoUrl: 'https://www.youtube.com/embed/JG4m3sVt7k',
              lessons: [
                { 
                  title: 'Théorie des couleurs', 
                  duration: '10 min', 
                  content: 'Découvrez les bases de la théorie des couleurs : RGB, HSL, espaces de couleur et comment créer des palettes harmonieuses.' 
                },
                { 
                  title: 'Typographie pour le web', 
                  duration: '12 min', 
                  content: 'Apprenez à choisir et utiliser les polices appropriées pour une excellente lisibilité sur tous les appareils.' 
                }
              ]
            },
            {
              title: 'Chapitre 2: Design d\'Expérience Utilisateur (UX)',
              content: 'L\'UX se concentre sur l\'expérience globale de l\'utilisateur. Nous étudierons l\'ergonomie, l\'architecture de l\'information et les méthodes de recherche utilisateur.',
              videoUrl: 'https://www.youtube.com/embed/9oA9t5r5y9k',
              lessons: [
                { 
                  title: 'Recherche utilisateur', 
                  duration: '15 min', 
                  content: 'Découvrez les techniques de recherche utilisateur : entretiens, tests d\'utilisabilité et analyse des comportements.' 
                },
                { 
                  title: 'Prototypage et tests', 
                  duration: '18 min', 
                  content: 'Apprenez à créer des prototypes rapides et à tester vos designs avant le développement final.' 
                }
              ]
            }
          ]
        }
      ];

      const foundCourse = defaultCourses.find(c => c._id === id);

      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        setCourse({
          _id: id,
          title: 'Demo Course',
          description: 'This is a demo course description used when backend is not available.',
          instructor: { name: 'EduPortal Instructor' },
          price: 0,
          category: 'Demo',
          chapters: [
            {
              title: 'Chapitre 1: Introduction',
              content: 'Bienvenue dans ce chapitre d\'introduction ! Ce texte sert de contenu de remplissage détaillé pour vous permettre de vérifier l\'apparence visuelle de la page, comme la police, la taille du texte et les espacements.\n\nLe monde du e-learning (ou apprentissage en ligne) a connu une croissance sans précédent ces dernières années. Grâce aux plateformes modernes, les utilisateurs peuvent désormais accéder à un savoir immense depuis leur domicile. \n\nCe chapitre explore les fondamentaux de notre sujet, pose les bases des chapitres suivants, et explique les différentes méthodes pédagogiques que nous allons employer tout au long de votre parcours.',
              duration: '15 min'
            },
            {
              title: 'Chapitre 2: Avancé',
              content: 'Dans cette section plus avancée, nous allons détailler des notions plus complexes. \n\nVoici par exemple plusieurs points clés à retenir :\n- Toujours commencer par les bases.\n- Ne pas hésiter à pratiquer régulièrement.\n- Poser des questions à la communauté en cas de blocage.\n\nCe type de contenu long est indispensable pour tester véritablement l\'interface de lecture.',
              duration: '30 min'
            }
          ],
          lessons: Array.from({ length: 5 }, (_, i) => ({
            title: `Demo Lesson ${i + 1}`,
            content: 'Ceci est un exemple de contenu de leçon détaillé pour prévisualiser le rendu des longues descriptions ou exercices pratiques qui peuvent parfois faire plusieurs lignes de long et nécessiter un saut de ligne ou un bon espacement.'
          }))
        });
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  const loadUserProgress = async (courseId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error('Failed to load user progress:', error);
      return { progress: 0, completedChapters: [], isCompleted: false };
    }
  };

  const markChapterComplete = async (chapterIndex) => {
    try {
      await axios.post(`${API_BASE_URL}/api/progress/${course._id}/complete`, {
        chapterIndex
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newCompletedChapters = [...completedChapters, chapterIndex];
      setCompletedChapters(newCompletedChapters);
      
      const newProgress = Math.round((newCompletedChapters.length / course.chapters.length) * 100);
      setProgress(newProgress);
      
      if (newCompletedChapters.length === course.chapters.length) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Failed to mark chapter complete:', error);
    }
  };

  const getCertificate = () => {
    navigate(`/certificate?course=${course._id}&title=${encodeURIComponent(course.title)}`);
  };

  const handleEnroll = async () => {
    if (!course || !course._id || course._id.toString().startsWith('demo')) {
      alert('This is a demo course. Enrollment is simulated.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Successfully enrolled in course!');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = chapterStyles;
    document.head.appendChild(styleSheet);
  }, []);

  if (!course || loading) {
    return (
      <div className="courses-page">
        <div className="courses-section">
          <div className="container-lg">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading course...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div className="container-lg">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      </div>

      <div className="courses-section">
        <div className="container-lg course-detail-layout">
          <div className="course-detail-main">
            <div className="course-detail-info">
              <h2>Course Overview</h2>
              <p className="course-detail-text">{course.description}</p>

              {course.chapters && (
                <div className="progress-section">
                  <h3><span className="icon-wrapper"><BarChart size={18} /></span> Votre Progression</h3>
                  <div className="progress-bar-container">
                    <div className="progress-info">
                      <span className="progress-percentage">{progress}%</span>
                      <span className="progress-text">
                        {completedChapters.length} / {course.chapters.length} chapitres complétés
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="certification-section">
                  <h3><span className="icon-wrapper"><GraduationCap size={18} /></span> Félicitations !</h3>
                  <p>Vous avez complété ce cours avec succès.</p>
                  <button 
                    className="btn btn-primary btn-large certification-btn"
                    onClick={getCertificate}
                  >
                    <span className="icon-wrapper"><Trophy size={18} /></span> Obtenir votre Certificat
                  </button>
                </div>
              )}
            </div>

            {course.files && course.files.length > 0 && (
              <div className="course-files-section">
                <h3>📁 Fichiers du cours ({course.files.length})</h3>
                <div className="files-grid">
                  {course.files.map((file, index) => (
                    <div key={index} className="file-card">
                      <div className="file-info">
                        <span className="file-icon">
                          {file.mimeType?.startsWith('image/') ? '🖼️' :
                            file.mimeType === 'application/pdf' ? '📄' : '📁'}
                        </span>
                        <div className="file-details">
                          <p className="file-name">{file.originalName}</p>
                          <p className="file-meta">
                            {file.mimeType?.startsWith('image/') ? 'Image' :
                              file.mimeType === 'application/pdf' ? 'PDF' : 'Document'}
                            • {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="course-lessons">
              <h2><span className="icon-wrapper"><BookOpen size={18} /></span> Course Content</h2>
              
              {course.chapters && course.chapters.length > 0 ? (
                <div className="chapters-list">
                  {course.chapters.map((chapter, index) => (
                    <div key={index} className="chapter-content" onClick={() => setSelectedChapter(chapter)}>
                      <h4>
                        <span className="icon-wrapper"><Book size={18} /></span> {chapter.title}
                      </h4>
                      <div className="chapter-meta">
                        {chapter.duration && <span className="duration"><span className="icon-wrapper"><Timer size={18} /></span> {chapter.duration}</span>}
                        {completedChapters.includes(index) && <span className="completed-badge"><span className="icon-wrapper"><Check size={18} /></span> Complété</span>}
                      </div>
                      <p>{chapter.content.substring(0, 150)}...</p>
                    </div>
                  ))}
                </div>
              ) : (
                (!course.chapters || course.chapters.length === 0) && course.lessons && course.lessons.length > 0 ? (
                  <ul>
                    {course.lessons.map((lesson, index) => (
                      <li key={index} className="lesson-item">
                        <div className="chapter-content" onClick={() => setSelectedChapter(lesson)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>
                              <span className="icon-wrapper"><Book size={18} /></span> Leçon {index + 1}: {lesson.title}
                            </h4>
                            <span style={{ color: '#667eea', fontSize: '0.9rem', fontWeight: 'bold' }}>Voir le contenu ➔</span>
                          </div>
                          <div className="chapter-meta">
                            {lesson.duration && <span className="duration"><span className="icon-wrapper"><Timer size={18} /></span> {lesson.duration}</span>}
                            {lesson.videoUrl && <span style={{ marginLeft: '10px' }}>🎥 Vidéo incluse</span>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-chapters">
                    <p>No chapters available for this course yet.</p>
                  </div>
                )
              )}
            </div>
          </div>

          <aside className="course-detail-sidebar">
            <div className="course-detail-card">
              <div className="instructor">
                <div className="avatar">JD</div>
                <div>
                  <div className="meta-label">Instructor</div>
                  <div className="instructor-name">{course.instructor.name}</div>
                </div>
              </div>

              <div className="price">
                <div className="price-label">Price</div>
                <div className="price-value">
                  {course.price === 0 ? 'FREE' : `$${course.price}`}
                </div>
              </div>

              <div className="course-stats">
                <div className="stat">
                  <span className="stat-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
                  <span>{course.chapters ? course.chapters.length : 0} Chapters</span>
                </div>
                <div className="stat">
                  <span className="stat-icon"><span className="icon-wrapper"><Timer size={18} /></span></span>
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon"><span className="icon-wrapper"><Users size={18} /></span></span>
                  <span>{course.enrolledStudents ? course.enrolledStudents.length : 0} Students</span>
                </div>
              </div>

              <div className="course-actions">
                <button className="btn btn-primary" onClick={handleEnroll}>
                  {course.enrolledStudents?.includes(user?._id) ? 'Continue Learning' : 'Enroll Now'}
                </button>
                <Link to="/courses" className="btn btn-outline">
                  Back to Courses
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal for chapter content */}
      {selectedChapter && (
        <div className="chapter-modal-overlay" onClick={() => setSelectedChapter(null)}>
          <div className="chapter-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedChapter(null)}>&times;</button>
            <h2>{selectedChapter.title}</h2>
            {selectedChapter.duration && <p className="chapter-meta" style={{ marginTop: '0.5rem' }}><span className="icon-wrapper"><Timer size={18} /></span> {selectedChapter.duration}</p>}
            <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            <div className="chapter-full-content" style={{
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              color: '#2d3748',
              fontSize: '1.1rem'
            }}>
              {(() => {
                const getEmbedUrl = (url) => {
                  if (!url) return null;
                  if (url.includes('youtube.com/watch?v=')) {
                    return url.replace('watch?v=', 'embed/');
                  }
                  if (url.includes('youtu.be/')) {
                    return url.replace('youtu.be/', 'youtube.com/embed/');
                  }
                  return url;
                };

                const chapterVideoUrl = getEmbedUrl(selectedChapter.videoUrl);

                return (
                  <>
                    {chapterVideoUrl && (
                      <div style={{ marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <iframe
                          width="100%"
                          height="315"
                          src={chapterVideoUrl}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen>
                        </iframe>
                      </div>
                    )}

                    {selectedChapter.content ? (
                      <div>{selectedChapter.content}</div>
                    ) : null}

                    {selectedChapter.lessons && selectedChapter.lessons.length > 0 && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Leçons dans ce chapitre :</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {selectedChapter.lessons.map((lesson, idx) => {
                            const lessonVideoUrl = getEmbedUrl(lesson.videoUrl);
                            return (
                              <li key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1a202c' }}>{lesson.title}</div>
                                {lesson.duration && <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}><span className="icon-wrapper"><Timer size={18} /></span> {lesson.duration}</div>}

                                {lessonVideoUrl && (
                                  <div style={{ margin: '1rem 0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <iframe
                                      width="100%"
                                      height="250"
                                      src={lessonVideoUrl}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen>
                                    </iframe>
                                  </div>
                                )}

                                {lesson.content && <div style={{ marginTop: '1rem', color: '#4a5568', lineHeight: '1.6' }}>{lesson.content}</div>}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {!selectedChapter.content && !chapterVideoUrl && (!selectedChapter.lessons || selectedChapter.lessons.length === 0) && (
                      <div style={{ fontStyle: 'italic', color: '#a0aec0' }}>Le contenu de ce chapitre n\'est pas encore disponible.</div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
