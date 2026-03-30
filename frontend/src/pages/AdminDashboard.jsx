import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api';
import AdminInstructorRequests from './AdminInstructorRequests';
import './AdminDashboard.css';
import { BarChart, BookOpen, Check, Clipboard, FileText, GraduationCap, MonitorPlay, Search, Settings, TrendingUp, User, Users, X } from 'lucide-react';


const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingRequests: 0,
    revenue: 0,
    activeUsers: 0,
    completionRate: 0,
    monthlyGrowth: 0,
    topCourses: [],
    userActivity: []
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userFilter, setUserFilter] = useState('all');
  const [courseCategory, setCourseCategory] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const users = usersRes.data;
      let courses = coursesRes.data;

      // Toujours ajouter les cours par défaut en plus des cours existants
      const defaultCourses = getDefaultCourses();
      
      // Combiner les cours existants avec les cours par défaut
      // Éviter les doublons en vérifiant les IDs
      const existingIds = new Set(courses.map(c => c._id));
      const additionalDefaultCourses = defaultCourses.filter(c => !existingIds.has(c._id));
      
      courses = [...courses, ...additionalDefaultCourses];

      console.log('Total courses loaded:', courses.length);
      console.log('Courses:', courses);

      // Calculate analytics data
      const topCourses = courses
        .sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0))
        .slice(0, 5);

      const userActivity = users.slice(0, 10).map(user => ({
        name: user.name,
        role: user.role,
        status: user.status,
        lastActive: user.createdAt || new Date().toISOString()
      }));

      setStats({
        totalStudents: users.filter(u => u.role === 'student').length,
        totalInstructors: users.filter(u => u.role === 'instructor').length,
        totalCourses: courses.length,
        totalEnrollments: courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0),
        pendingRequests: users.filter(u => u.status === 'pending').length,
        revenue: courses.reduce((sum, c) => sum + (c.price || 0), 0),
        activeUsers: users.filter(u => u.status === 'approved').length,
        completionRate: Math.round((courses.length / 10) * 100),
        monthlyGrowth: Math.round(Math.random() * 20 + 5), // Simulation
        topCourses,
        userActivity
      });

      setUsers(users);
      setCourses(courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getDefaultCourses = () => {
    return [
      {
        _id: '1',
        title: 'Introduction à JavaScript',
        description: 'Apprenez JavaScript, le langage le plus populaire pour le développement web.',
        instructor: { name: 'Jean Dupont', _id: 'prof1' },
        category: 'Développement Web',
        level: 'Débutant',
        price: 0,
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
        description: 'Maîtrisez React avec hooks, Redux et les meilleures pratiques.',
        instructor: { name: 'Marie Martin', _id: 'prof2' },
        category: 'Framework JavaScript',
        level: 'Intermédiaire',
        price: 0,
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
        description: 'Explorez Python avec Pandas, NumPy pour l\'analyse de données.',
        instructor: { name: 'Pierre Durand', _id: 'prof3' },
        category: 'Data Science',
        level: 'Intermédiaire',
        price: 0,
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
        description: 'Apprenez les principes du design d\'interface et expérience utilisateur.',
        instructor: { name: 'Sophie Lemaire', _id: 'prof4' },
        category: 'Design',
        level: 'Débutant',
        price: 0,
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
        price: 0,
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
        price: 0,
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
        price: 0,
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
        price: 0,
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
        price: 0,
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
        price: 0,
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
        title: 'TypeScript Avancé',
        description: 'Apprenez TypeScript pour améliorer vos applications JavaScript.',
        instructor: { name: 'Antoine Moreau', _id: 'prof11' },
        category: 'Développement Web',
        level: 'Intermédiaire',
        price: 0,
        enrolledStudents: [40, 41, 42],
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: TypeScript',
            lessons: [
              { title: 'Types et interfaces', duration: '18 min' },
              { title: 'Classes et héritage', duration: '22 min' },
              { title: 'Génériques et décorateurs', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '12',
        title: 'MongoDB et NoSQL',
        description: 'Découvrez les bases de données NoSQL avec MongoDB.',
        instructor: { name: 'Isabelle Fontaine', _id: 'prof12' },
        category: 'Base de Données',
        level: 'Intermédiaire',
        price: 0,
        enrolledStudents: [43, 44, 45],
        image: 'https://images.unsplash.com/photo-1544381970-0c76a6d4f9c1?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: NoSQL',
            lessons: [
              { title: 'Introduction à NoSQL', duration: '15 min' },
              { title: 'MongoDB basics', duration: '20 min' },
              { title: 'Mongoose et Node.js', duration: '25 min' }
            ]
          }
        ]
      },
      {
        _id: '13',
        title: 'Angular Complet',
        description: 'Développez des applications web avec Angular.',
        instructor: { name: 'David Renaud', _id: 'prof13' },
        category: 'Framework JavaScript',
        level: 'Avancé',
        price: 0,
        enrolledStudents: [46, 47],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Angular',
            lessons: [
              { title: 'Architecture Angular', duration: '20 min' },
              { title: 'Components et templates', duration: '25 min' },
              { title: 'Services et HTTP', duration: '22 min' }
            ]
          }
        ]
      },
      {
        _id: '14',
        title: 'SEO et Marketing Digital',
        description: 'Optimisez votre site pour les moteurs de recherche.',
        instructor: { name: 'Laura Martinez', _id: 'prof14' },
        category: 'Marketing',
        level: 'Débutant',
        price: 0,
        enrolledStudents: [48, 49, 50, 51],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: SEO',
            lessons: [
              { title: 'Introduction au SEO', duration: '12 min' },
              { title: 'SEO on-page et off-page', duration: '18 min' },
              { title: 'Analytics et suivi', duration: '15 min' }
            ]
          }
        ]
      },
      {
        _id: '15',
        title: 'Flutter Mobile',
        description: 'Créez des applications mobiles avec Flutter.',
        instructor: { name: 'Kevin Lambert', _id: 'prof15' },
        category: 'Développement Mobile',
        level: 'Intermédiaire',
        price: 0,
        enrolledStudents: [52, 53],
        image: 'https://images.unsplash.com/photo-1512941937309-2a658cd9df13?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Flutter',
            lessons: [
              { title: 'Installation et setup', duration: '15 min' },
              { title: 'Widgets et layouts', duration: '25 min' },
              { title: 'Navigation et state management', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '16',
        title: 'Cybersécurité',
        description: 'Protégez vos applications contre les menaces cybernétiques.',
        instructor: { name: 'Sébastien Rousseau', _id: 'prof16' },
        category: 'Sécurité',
        level: 'Avancé',
        price: 0,
        enrolledStudents: [54, 55],
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Sécurité Web',
            lessons: [
              { title: 'Vulnérabilités communes', duration: '18 min' },
              { title: 'OWASP Top 10', duration: '25 min' },
              { title: 'Bonnes pratiques', duration: '20 min' }
            ]
          }
        ]
      },
      {
        _id: '17',
        title: 'Blockchain et Crypto',
        description: 'Comprenez la technologie blockchain et les cryptomonnaies.',
        instructor: { name: 'Alexandre Chevalier', _id: 'prof17' },
        category: 'Blockchain',
        level: 'Avancé',
        price: 0,
        enrolledStudents: [56, 57],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Blockchain',
            lessons: [
              { title: 'Principes de la blockchain', duration: '20 min' },
              { title: 'Smart contracts', duration: '25 min' },
              { title: 'Décentralisation', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '18',
        title: 'Cloud Computing AWS',
        description: 'Maîtrisez les services cloud d\'Amazon Web Services.',
        instructor: { name: 'Mélanie Perrin', _id: 'prof18' },
        category: 'Cloud',
        level: 'Intermédiaire',
        price: 0,
        enrolledStudents: [58, 59, 60],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: AWS',
            lessons: [
              { title: 'Introduction au cloud', duration: '15 min' },
              { title: 'EC2 et instances', duration: '22 min' },
              { title: 'S3 et stockage', duration: '18 min' }
            ]
          }
        ]
      },
      {
        _id: '19',
        title: 'Tests Automatisés',
        description: 'Assurez la qualité de votre code avec les tests automatisés.',
        instructor: { name: 'François Michel', _id: 'prof19' },
        category: 'Qualité Logicielle',
        level: 'Intermédiaire',
        price: 0,
        enrolledStudents: [61, 62],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Tests',
            lessons: [
              { title: 'Tests unitaires avec Jest', duration: '20 min' },
              { title: 'Tests d\'intégration', duration: '18 min' },
              { title: 'Tests E2E avec Cypress', duration: '25 min' }
            ]
          }
        ]
      },
      {
        _id: '20',
        title: 'Agile et Scrum',
        description: 'Gérez vos projets avec les méthodologies agiles.',
        instructor: { name: 'Nathalie Guillaume', _id: 'prof20' },
        category: 'Management',
        level: 'Débutant',
        price: 0,
        enrolledStudents: [63, 64, 65, 66],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Méthodologies Agiles',
            lessons: [
              { title: 'Principes agiles', duration: '12 min' },
              { title: 'Scrum framework', duration: '18 min' },
              { title: 'Sprints et cérémonies', duration: '15 min' }
            ]
          }
        ]
      },
      {
        _id: '21',
        title: 'GraphQL et Apollo',
        description: 'Modérnisez vos APIs avec GraphQL.',
        instructor: { name: 'Romain Lefebvre', _id: 'prof21' },
        category: 'API',
        level: 'Intermédiaire',
        price: 0,
        enrolledStudents: [67, 68],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: GraphQL',
            lessons: [
              { title: 'Introduction à GraphQL', duration: '15 min' },
              { title: 'Schémas et types', duration: '20 min' },
              { title: 'Apollo Client', duration: '22 min' }
            ]
          }
        ]
      },
      {
        _id: '22',
        title: 'Performance Web',
        description: 'Optimisez la performance de vos applications web.',
        instructor: { name: 'Caroline Fernandez', _id: 'prof22' },
        category: 'Optimisation',
        level: 'Avancé',
        price: 0,
        enrolledStudents: [69, 70],
        image: 'https://images.unsplash.com/photo-1467232004588-a2e9470f3bfe?w=300&h=200&fit=crop&auto=format',
        status: 'published',
        chapters: [
          {
            title: 'Chapitre 1: Optimisation',
            lessons: [
              { title: 'Core Web Vitals', duration: '18 min' },
              { title: 'Lazy loading et code splitting', duration: '22 min' },
              { title: 'Cache et CDN', duration: '20 min' }
            ]
          }
        ]
      }
    ];
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMessage('Cours supprimé avec succès!');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Erreur lors de la suppression du cours');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleEditCourse = (course) => {
    // Pour l'instant, on peut afficher une alerte
    alert(`Fonction de modification du cours "${course.title}" sera implémentée prochainement.`);
  };

  const handleUserAction = async (action, userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/${action}/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(`User ${action}ed successfully!`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error ${action}ing user`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowUserDetails(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role
      };
      
      if (userForm.password) {
        updateData.password = userForm.password;
      }

      await axios.put(`${API_BASE_URL}/api/users/${selectedUser._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('User updated successfully!');
      fetchData();
      setShowUserDetails(false);
      setSelectedUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'student' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMessage('User deleted successfully!');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting user');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = userFilter === 'all' || 
                          (userFilter === 'students' && user.role === 'student') ||
                          (userFilter === 'instructors' && user.role === 'instructor') ||
                          (userFilter === 'pending' && user.status === 'pending');
    
    return matchesSearch && matchesFilter;
  });

  const filteredCourses = courses.filter(course => {
    if (courseCategory === 'all') return true;
    return course.category?.toLowerCase() === courseCategory.toLowerCase();
  });

  const recentCourses = courses.slice(0, 5);
  const pendingUsers = users.filter(u => u.status === 'pending');

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <h2>🚫 Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon"><span className="icon-wrapper"><GraduationCap size={18} /></span></span>
            <span className="logo-text">E-Learning Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <span className="nav-icon"><span className="icon-wrapper"><BarChart size={18} /></span></span>
            <span className="nav-text">Overview</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <span className="nav-icon"><span className="icon-wrapper"><Users size={18} /></span></span>
            <span className="nav-text">Users</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveSection('courses')}
          >
            <span className="nav-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
            <span className="nav-text">Courses</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveSection('requests')}
          >
            <span className="nav-icon"><span className="icon-wrapper"><Clipboard size={18} /></span></span>
            <span className="nav-text">Instructor Requests</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <span className="nav-icon"><span className="icon-wrapper"><TrendingUp size={18} /></span></span>
            <span className="nav-text">Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <span className="nav-icon"><span className="icon-wrapper"><Settings size={18} /></span></span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <div className="user-avatar-small">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div className="user-info-mini">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeSection === 'overview' && 'Dashboard Overview'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'courses' && 'Course Management'}
              {activeSection === 'requests' && 'Instructor Requests'}
              {activeSection === 'analytics' && 'Analytics & Reports'}
              {activeSection === 'settings' && 'System Settings'}
            </h1>
            <p className="page-subtitle">Welcome back, {user?.name}</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search users, courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon"><span className="icon-wrapper"><Search size={18} /></span></span>
            </div>
          </div>
        </header>

        {/* Messages */}
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Content Sections */}
        <div className="admin-content">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="overview-section">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card animated">
                  <div className="stat-icon students"><span className="icon-wrapper"><Users size={18} /></span></div>
                  <div className="stat-content">
                    <h3>{stats.totalStudents}</h3>
                    <p>Total Students</p>
                    <span className="stat-trend positive">↑ +12% this month</span>
                  </div>
                </div>
                <div className="stat-card animated">
                  <div className="stat-icon instructors"><span className="icon-wrapper"><MonitorPlay size={18} /></span></div>
                  <div className="stat-content">
                    <h3>{stats.totalInstructors}</h3>
                    <p>Active Instructors</p>
                    <span className="stat-trend positive">↑ +3% this month</span>
                  </div>
                </div>
                <div className="stat-card animated">
                  <div className="stat-icon courses"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
                  <div className="stat-content">
                    <h3>{stats.totalCourses}</h3>
                    <p>Total Courses</p>
                    <span className="stat-trend neutral">🔄 No change</span>
                  </div>
                </div>
                <div className="stat-card animated">
                  <div className="stat-icon revenue">💰</div>
                  <div className="stat-content">
                    <h3>€{stats.revenue}</h3>
                    <p>Total Revenue</p>
                    <span className="stat-trend positive">↑ +18% this month</span>
                  </div>
                </div>
              </div>

              
              {/* Recent Activity */}
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon"><span className="icon-wrapper"><User size={18} /></span></span>
                    <div className="activity-content">
                      <h4>New User Registration</h4>
                      <p>John Doe joined as a student</p>
                      <span className="activity-time">2 minutes ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
                    <div className="activity-content">
                      <h4>New Course Published</h4>
                      <p>"Advanced JavaScript" by Jane Smith</p>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon"><span className="icon-wrapper"><Clipboard size={18} /></span></span>
                    <div className="activity-content">
                      <h4>Instructor Request</h4>
                      <p>Mike Johnson requested instructor access</p>
                      <span className="activity-time">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>User Management</h2>
                <div className="user-filters">
                  <select 
                    className="filter-select" 
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students</option>
                    <option value="instructors">Instructors</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="table-row">
                        <td className="user-cell">
                          <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                          <span className="user-name">{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? '👑' : user.role === 'instructor' ? '<span className="icon-wrapper"><MonitorPlay size={18} /></span>' : '👨‍<span className="icon-wrapper"><GraduationCap size={18} /></span>'} {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status}`}>
                            {user.status === 'approved' ? '<span className="icon-wrapper"><Check size={18} /></span>' : user.status === 'pending' ? '⏳' : '<span className="icon-wrapper"><X size={18} /></span>'} {user.status}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="btn btn-sm btn-primary"
                              title="Edit user"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="btn btn-sm btn-danger"
                              title="Delete user"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses Section */}
          {activeSection === 'courses' && (
            <div className="courses-section">
              <div className="section-header">
                <h2>Course Management</h2>
                <div className="course-stats">
                  <span>Total: {courses.length}</span>
                  <span>Published: {courses.filter(c => c.status === 'published').length}</span>
                  <span>Draft: {courses.filter(c => c.status === 'draft').length}</span>
                </div>
              </div>
              
              {/* Course Categories */}
              <div className="course-categories">
                <button 
                  className={`category-btn ${courseCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('all')}
                >
                  All Courses
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Développement Web' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Développement Web')}
                >
                  Développement Web
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Framework JavaScript' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Framework JavaScript')}
                >
                  Framework JavaScript
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Data Science' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Data Science')}
                >
                  Data Science
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Design' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Design')}
                >
                  Design
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Backend' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Backend')}
                >
                  Backend
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Mobile' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Mobile')}
                >
                  Mobile
                </button>
                <button 
                  className={`category-btn ${courseCategory === 'Cloud' ? 'active' : ''}`}
                  onClick={() => setCourseCategory('Cloud')}
                >
                  Cloud
                </button>
              </div>
              
              <div className="courses-grid">
                {filteredCourses.map(course => (
                  <div key={course._id} className="course-card-admin">
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
                          {course.status === 'published' ? '<span className="icon-wrapper"><Check size={18} /></span>' : '<span className="icon-wrapper"><FileText size={18} /></span>'} {course.status}
                        </span>
                      </div>
                    </div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-meta">
                        <span className="instructor">{course.instructor?.name || 'Unknown'}</span>
                        <span className="students">{course.enrolledStudents?.length || 0} students</span>
                        <span className="level">{course.level}</span>
                      </div>
                      
                      {/* Chapters Display */}
                      {course.chapters && course.chapters.length > 0 && (
                        <div className="course-chapters">
                          <h4><span className="icon-wrapper"><BookOpen size={18} /></span> {course.chapters.length} Chapitres</h4>
                          <div className="chapters-list">
                            {course.chapters.slice(0, 2).map((chapter, index) => (
                              <div key={index} className="chapter-item">
                                <span className="chapter-title">{chapter.title}</span>
                                <span className="chapter-lessons">{chapter.lessons?.length || 0} leçons</span>
                              </div>
                            ))}
                            {course.chapters.length > 2 && (
                              <div className="chapter-more">
                                +{course.chapters.length - 2} chapitres de plus
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="course-actions">
                        <button 
                          onClick={() => handleEditCourse(course)}
                          className="btn btn-sm btn-primary"
                          title="Edit course"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course._id)}
                          className="btn btn-sm btn-danger"
                          title="Delete course"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor Requests Section */}
          {activeSection === 'requests' && (
            <div className="requests-section">
              <AdminInstructorRequests />
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="analytics-section">
              <h2>Analytics & Reports</h2>
              
              {/* Key Metrics */}
              <div className="key-metrics">
                <div className="metric-card">
                  <h3>Monthly Growth</h3>
                  <div className="metric-value">{stats.monthlyGrowth}%</div>
                  <div className="metric-change positive">↑ +2.3% from last month</div>
                </div>
                <div className="metric-card">
                  <h3>Completion Rate</h3>
                  <div className="metric-value">{stats.completionRate}%</div>
                  <div className="metric-change positive">↑ +5% from last month</div>
                </div>
                <div className="metric-card">
                  <h3>Active Users</h3>
                  <div className="metric-value">{stats.activeUsers}</div>
                  <div className="metric-change positive">↑ +12% from last month</div>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3><span className="icon-wrapper"><BarChart size={18} /></span> User Growth</h3>
                  <div className="chart-container">
                    <div className="bar-chart">
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                      <div className="bar" style={{height: '70%'}}></div>
                      <div className="bar" style={{height: '85%'}}></div>
                    </div>
                    <div className="chart-labels">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </div>
                  <div className="chart-summary">
                    <span>Total Users: {users.length}</span>
                    <span>Growth: +{stats.monthlyGrowth}%</span>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h3><span className="icon-wrapper"><TrendingUp size={18} /></span> Course Completion</h3>
                  <div className="chart-container">
                    <div className="progress-chart">
                      <div className="progress-segment" style={{width: '75%', background: '#48bb78'}}></div>
                      <div className="progress-segment" style={{width: '15%', background: '#ed8936'}}></div>
                      <div className="progress-segment" style={{width: '10%', background: '#f56565'}}></div>
                    </div>
                    <div className="progress-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{background: '#48bb78'}}></span>
                        <span>Completed (75%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{background: '#ed8936'}}></span>
                        <span>In Progress (15%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{background: '#f56565'}}></span>
                        <span>Not Started (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Courses */}
              <div className="top-courses-section">
                <h3>Top Performing Courses</h3>
                <div className="top-courses-list">
                  {stats.topCourses?.slice(0, 5).map((course, index) => (
                    <div key={course._id} className="top-course-item">
                      <div className="course-rank">#{index + 1}</div>
                      <div className="course-info">
                        <h4>{course.title}</h4>
                        <p>{course.instructor?.name}</p>
                      </div>
                      <div className="course-stats-mini">
                        <span className="students-count">{course.enrolledStudents?.length || 0} students</span>
                        <span className="course-level">{course.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="settings-section">
              <h2>System Settings</h2>
              <div className="settings-grid">
                <div className="setting-card">
                  <h3>Platform Configuration</h3>
                  <p>Manage platform-wide settings and preferences</p>
                </div>
                <div className="setting-card">
                  <h3>Email Templates</h3>
                  <p>Customize email notifications and templates</p>
                </div>
                <div className="setting-card">
                  <h3>Security Settings</h3>
                  <p>Configure security policies and permissions</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {showUserDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="modal-close" onClick={() => setShowUserDetails(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password (leave empty to keep current)</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  placeholder="New password"
                />
              </div>
                          </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AdminDashboard;
