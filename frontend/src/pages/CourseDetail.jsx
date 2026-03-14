import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Courses.css';
import '../components/CourseFiles.css';

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
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #4a5568;
    line-height: 1;
  }
  
  .close-modal:hover {
    color: #e53e3e;
  }
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = chapterStyles;
  document.head.appendChild(styleSheet);
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourse = async () => {
      let fetchedCourseData = null;
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        if (res.data && res.data._id) {
          setCourse(res.data);
          fetchedCourseData = res.data; // Store the fetched data
        }
      } catch (err) {
        console.error('Failed to load course, falling back to demo:', err);
      }

      // Si on a un VRAI cours complet venant de la base de données (ex: ajouté manuellement)
      if (fetchedCourseData && !fetchedCourseData._id.toString().startsWith('demo')) {
        setCourse(fetchedCourseData);
        setLoading(false);
        return;
      }

      // fallback: try to find the actual course if it matches one of the default courses
      const defaultCourses = [
        {
          _id: '1', title: 'Introduction à JavaScript', description: 'Apprenez les bases de JavaScript...',
          instructor: { name: 'Jean Dupont' }, price: 0, category: 'Développement Web',
          chapters: [
            {
              title: 'Chapitre 1: Introduction à JavaScript',
              content: 'Dans ce premier chapitre, nous allons découvrir ce qu\'est JavaScript et pourquoi il est devenu incontournable pour le développement web moderne. JavaScript (souvent abrégé en JS) est un langage de programmation de haut niveau, souvent compilé à la volée, et multi-paradigme.\n\nIl a été créé en 10 jours en 1995 par Brendan Eich alors qu\'il travaillait chez Netscape Communications. D\'abord appelé Mocha, puis LiveScript, il a finalement été renommé JavaScript pour surfer sur la popularité de Java à l\'époque (bien que les deux langages n\'aient que très peu en commun).\n\nAujourd\'hui, JS s\'exécute non seulement dans les navigateurs grâce à des moteurs performants comme V8, mais aussi côté serveur avec Node.js. C\'est ce qui en fait l\'un des langages les plus versatiles au monde.',
              videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
              lessons: [
                { title: 'Qu\'est-ce que JavaScript ?', duration: '5 min', content: 'JavaScript permet d\'ajouter de l\'interactivité à vos pages HTML.', videoUrl: 'https://www.youtube.com/embed/upDLs1sn7g4' },
                { title: 'Historique et évolution', duration: '8 min', content: 'De sa création en 1995 au standard ECMAScript actuel.' }
              ]
            },
            {
              title: 'Chapitre 2: Variables et types',
              content: 'Une variable est un conteneur permettant de stocker une valeur. En JavaScript moderne, on utilise principalement let et const pour déclarer des variables, remplaçant ainsi l\'ancien mot-clé var qui présentait des comportements liés à sa portée (scope) parfois imprévisibles.\n\nJavaScript propose plusieurs types primitifs : Number, String, Boolean, Undefined, Null, Symbol, et BigInt. Notez que JS a un typage dynamique, ce qui signifie qu\'une même variable peut contenir d\'abord un nombre, puis ensuite une chaîne de caractères.',
              videoUrl: 'https://www.youtube.com/embed/1OsGxDqvbNI',
              lessons: [
                { title: 'Déclaration de variables', duration: '10 min', content: 'Utilisation pratique de let, const et var.' }
              ]
            }
          ]
        },
        {
          _id: '2', title: 'React Avancé', description: 'Maîtrisez React...', instructor: { name: 'Marie Martin' }, price: 0, category: 'Framework JavaScript',
          chapters: [
            {
              title: 'Chapitre 1: Hooks React',
              content: 'Les Hooks ont révolutionné la façon dont nous écrivons des composants React. Introduits dans la version 16.8, ils permettent d\'utiliser l\'état et d\'autres fonctionnalités de React sans avoir à écrire de classes.\n\nLe hook le plus utilisé est useState, qui permet de conserver un état local. Vient ensuite useEffect, qui gère les effets de bord (comme les appels API ou les abonnements). En maîtrisant ces hooks de base, vous pouvez pratiquement tout construire.',
              videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
              lessons: [{ title: 'useState et useEffect', duration: '20 min', content: 'Exemples approfondis sur la gestion d\'état asynchrone.' }]
            }
          ]
        },
        // Mapped minimally for preview, if no match we fallback to the requested demo ID
      ];

      const foundCourse = defaultCourses.find(c => c._id === id);

      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        setCourse({
          _id: id,
          title: 'Demo Course',
          description: 'This is a demo course description used when the backend is not available.',
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
            content: 'Ceci est un exemple de contenu de leçon détaillé pour prévisualiser le rendu des longues descriptions ou exercices pratiques qui peuvent parfois faire plusieurs lignes de long et nécessiter un saut de ligne ou un bon espacement.',
          })),
        });
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!course || !course._id || course._id.toString().startsWith('demo')) {
      alert('This is a demo course. Enrollment is simulated.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert('Enrolled successfully');
    } catch (err) {
      alert('Enrollment failed');
    }
  };

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

              {/* Affichage des fichiers du cours */}
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
                        <a
                          href={`http://localhost:5000${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-download-btn"
                          download={file.originalName}
                        >
                          📥 Télécharger
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="course-detail-meta">
                <div>
                  <p className="meta-label">Instructor</p>
                  <p className="instructor-name">
                    {course.instructor?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="meta-label">Category</p>
                  <p>{course.category}</p>
                </div>
                <div>
                  <p className="meta-label">Chapters</p>
                  <p>{course.chapters?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="course-lessons">
              <h2>Course Curriculum</h2>
              {course.chapters && course.chapters.length > 0 ? (
                <ul>
                  {course.chapters.map((chapter, index) => (
                    <li key={index} className="lesson-item">
                      <div className="chapter-content" onClick={() => setSelectedChapter(chapter)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>
                            📖 Chapitre {index + 1}: {chapter.title}
                          </h4>
                          <span style={{ color: '#667eea', fontSize: '0.9rem', fontWeight: 'bold' }}>Voir le contenu ➔</span>
                        </div>
                        <div className="chapter-meta">
                          {chapter.duration && <span className="duration">⏱️ {chapter.duration}</span>}
                          {chapter.videoUrl && <span style={{ marginLeft: '10px' }}>🎥 Vidéo incluse</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                // Handling lessons when there are no chapters (for custom courses)
                (!course.chapters || course.chapters.length === 0) && course.lessons && course.lessons.length > 0 ? (
                  <ul>
                    {course.lessons.map((lesson, index) => (
                      <li key={index} className="lesson-item">
                        <div className="chapter-content" onClick={() => setSelectedChapter(lesson)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>
                              📖 Leçon {index + 1}: {lesson.title}
                            </h4>
                            <span style={{ color: '#667eea', fontSize: '0.9rem', fontWeight: 'bold' }}>Voir le contenu ➔</span>
                          </div>
                          <div className="chapter-meta">
                            {lesson.duration && <span className="duration">⏱️ {lesson.duration}</span>}
                            {lesson.videoUrl && <span style={{ marginLeft: '10px' }}>🎥 Vidéo incluse</span>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  // Fallback where completely empty
                  <div className="no-chapters">
                    <p>📚 No chapters or lessons available yet for this course.</p>
                  </div>
                )
              )}
            </div>
          </div>

          <aside className="course-detail-sidebar">
            <div className="course-detail-card">
              <p className="price-label">Course price</p>
              <p className="price-value">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </p>
              {user && (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="btn btn-primary btn-block"
                >
                  Enroll Now
                </button>
              )}
              {!user && (
                <p className="course-detail-note">
                  Log in to enroll in this course.
                </p>
              )}
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
            {selectedChapter.duration && <p className="chapter-meta" style={{ marginTop: '0.5rem' }}>⏱️ {selectedChapter.duration}</p>}
            <hr style={{ margin: '1rem 0', borderColor: '#e2e8f0' }} />
            <div className="chapter-full-content" style={{
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              color: '#2d3748',
              fontSize: '1.1rem',
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #667eea'
            }}>
              {/* Extracting YouTube logic to handle watch vs embed formats */}
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
                                {lesson.duration && <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>⏱️ {lesson.duration}</div>}

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
                      <div style={{ fontStyle: 'italic', color: '#a0aec0' }}>Le contenu de ce chapitre n'est pas encore disponible.</div>
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