import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);

  // Sample quiz data - in a real app, this would come from the backend
  const sampleQuizzes = {
    'course1': {
      title: 'Introduction to Programming',
      questions: [
        {
          question: 'What is a variable?',
          options: ['A type of function', 'A container for storing data', 'A programming language', 'A computer hardware'],
          correct: 1,
          explanation: 'A variable is a container that holds data values that can be changed during program execution.'
        },
        {
          question: 'Which of these is NOT a programming language?',
          options: ['Python', 'JavaScript', 'HTML', 'Java'],
          correct: 2,
          explanation: 'HTML is a markup language, not a programming language. It\'s used to structure web content.'
        },
        {
          question: 'What does "debugging" mean?',
          options: ['Writing code', 'Finding and fixing errors', 'Running programs', 'Designing interfaces'],
          correct: 1,
          explanation: 'Debugging is the process of finding and removing bugs (errors) from computer programs.'
        },
        {
          question: 'What is an algorithm?',
          options: ['A computer virus', 'A step-by-step procedure to solve a problem', 'A type of database', 'A programming tool'],
          correct: 1,
          explanation: 'An algorithm is a finite sequence of well-defined instructions to solve a problem or accomplish a task.'
        },
        {
          question: 'Which data type stores whole numbers?',
          options: ['String', 'Float', 'Integer', 'Boolean'],
          correct: 2,
          explanation: 'Integer data type stores whole numbers (positive, negative, or zero) without decimal points.'
        }
      ]
    },
    'course2': {
      title: 'Web Development Fundamentals',
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'],
          correct: 0,
          explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.'
        },
        {
          question: 'Which CSS property is used to change text color?',
          options: ['font-color', 'text-color', 'color', 'foreground-color'],
          correct: 2,
          explanation: 'The color property in CSS is used to set the color of text content.'
        },
        {
          question: 'What is JavaScript primarily used for?',
          options: ['Styling web pages', 'Creating web page structure', 'Adding interactivity to web pages', 'Storing data'],
          correct: 2,
          explanation: 'JavaScript is a programming language that enables interactive web pages and dynamic content.'
        },
        {
          question: 'Which HTTP method is used to retrieve data?',
          options: ['POST', 'PUT', 'GET', 'DELETE'],
          correct: 2,
          explanation: 'The GET method requests a representation of the specified resource and should only retrieve data.'
        },
        {
          question: 'What is responsive design?',
          options: ['Fast loading websites', 'Websites that work on all devices', 'Secure websites', 'Interactive websites'],
          correct: 1,
          explanation: 'Responsive design ensures websites look good and function well on all devices (desktop, tablet, mobile).'
        }
      ]
    },
    'course3': {
      title: 'Data Science Basics',
      questions: [
        {
          question: 'What is machine learning?',
          options: ['A type of computer hardware', 'A programming language', 'A method of data analysis that automates analytical model building', 'A database management system'],
          correct: 2,
          explanation: 'Machine learning is a method of data analysis that automates analytical model building using algorithms.'
        },
        {
          question: 'Which library is commonly used for data manipulation in Python?',
          options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
          correct: 1,
          explanation: 'Pandas is a powerful Python library for data manipulation and analysis, providing data structures and operations.'
        },
        {
          question: 'What is a DataFrame?',
          options: ['A type of chart', 'A 2-dimensional labeled data structure', 'A machine learning algorithm', 'A database table'],
          correct: 1,
          explanation: 'A DataFrame is a 2-dimensional labeled data structure with columns that can be of different types, similar to a spreadsheet or SQL table.'
        },
        {
          question: 'What does EDA stand for?',
          options: ['Electronic Data Analysis', 'Exploratory Data Analysis', 'Enhanced Data Algorithm', 'External Data Access'],
          correct: 1,
          explanation: 'EDA stands for Exploratory Data Analysis, the process of analyzing datasets to summarize their main characteristics.'
        },
        {
          question: 'Which of these is a supervised learning algorithm?',
          options: ['K-means clustering', 'Principal Component Analysis', 'Linear Regression', 't-SNE'],
          correct: 2,
          explanation: 'Linear Regression is a supervised learning algorithm that predicts a continuous output variable based on input features.'
        }
      ]
    },
    'course4': {
      title: 'React.js Fundamentals',
      questions: [
        {
          question: 'What is React?',
          options: ['A database', 'A JavaScript library for building user interfaces', 'A CSS framework', 'A backend framework'],
          correct: 1,
          explanation: 'React is a JavaScript library for building user interfaces, particularly web application user interfaces.'
        },
        {
          question: 'What is JSX?',
          options: ['A database query language', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A testing framework'],
          correct: 1,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.'
        },
        {
          question: 'What is a React component?',
          options: ['A CSS class', 'A reusable piece of UI', 'A database table', 'A server endpoint'],
          correct: 1,
          explanation: 'A React component is a reusable piece of UI that can contain its own logic and rendering.'
        },
        {
          question: 'What hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1,
          explanation: 'useState is a React hook that allows you to add state to functional components.'
        },
        {
          question: 'What does the useEffect hook do?',
          options: ['Manages component state', 'Handles side effects in components', 'Creates context', 'Manages routing'],
          correct: 1,
          explanation: 'useEffect allows you to perform side effects in function components, such as data fetching or DOM manipulation.'
        }
      ]
    },
    'course5': {
      title: 'Database Management',
      questions: [
        {
          question: 'What does SQL stand for?',
          options: ['Simple Query Language', 'Structured Query Language', 'System Query Language', 'Standard Query Language'],
          correct: 1,
          explanation: 'SQL stands for Structured Query Language, used for managing and manipulating relational databases.'
        },
        {
          question: 'Which SQL command is used to retrieve data from a database?',
          options: ['INSERT', 'UPDATE', 'DELETE', 'SELECT'],
          correct: 3,
          explanation: 'The SELECT statement is used to retrieve data from one or more tables in a database.'
        },
        {
          question: 'What is a primary key?',
          options: ['A foreign key reference', 'A unique identifier for a record', 'A type of index', 'A database table'],
          correct: 1,
          explanation: 'A primary key is a unique identifier for each record in a database table.'
        },
        {
          question: 'What is normalization in databases?',
          options: ['Compressing data', 'Organizing data to reduce redundancy', 'Encrypting data', 'Backing up data'],
          correct: 1,
          explanation: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.'
        },
        {
          question: 'Which of these is NOT a type of database relationship?',
          options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'Single-to-Single'],
          correct: 3,
          explanation: 'The main types of database relationships are One-to-One, One-to-Many, and Many-to-Many.'
        }
      ]
    },
    'course6': {
      title: 'Cybersecurity Essentials',
      questions: [
        {
          question: 'What is phishing?',
          options: ['A type of fish', 'A cyber attack that uses disguised email', 'A password cracking technique', 'A firewall type'],
          correct: 1,
          explanation: 'Phishing is a cyber attack where attackers disguise themselves as trustworthy entities to trick individuals into revealing sensitive information.'
        },
        {
          question: 'What is encryption?',
          options: ['Compressing files', 'Converting data into a coded format', 'Deleting files permanently', 'Backing up data'],
          correct: 1,
          explanation: 'Encryption is the process of converting data into a coded format to prevent unauthorized access.'
        },
        {
          question: 'What is a firewall?',
          options: ['A physical barrier', 'A network security system', 'A type of virus', 'A backup device'],
          correct: 1,
          explanation: 'A firewall is a network security system that monitors and controls incoming and outgoing network traffic.'
        },
        {
          question: 'What is two-factor authentication (2FA)?',
          options: ['Using two passwords', 'A security process requiring two forms of identification', 'A type of encryption', 'A firewall feature'],
          correct: 1,
          explanation: 'Two-factor authentication requires users to provide two different forms of identification before accessing an account.'
        },
        {
          question: 'What should you do if you suspect a security breach?',
          options: ['Ignore it', 'Change all passwords immediately', 'Delete all files', 'Restart your computer'],
          correct: 1,
          explanation: 'If you suspect a security breach, immediately change all passwords and contact your IT security team.'
        }
      ]
    },
    'course7': {
      title: 'Cloud Computing',
      questions: [
        {
          question: 'What is cloud computing?',
          options: ['Weather prediction software', 'Delivering computing services over the internet', 'A type of database', 'A programming language'],
          correct: 1,
          explanation: 'Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software—over the internet.'
        },
        {
          question: 'Which of these is NOT a major cloud provider?',
          options: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform', 'Oracle Cloud'],
          correct: 3,
          explanation: 'Oracle Cloud is a cloud provider, but the three major ones are AWS, Azure, and Google Cloud Platform.'
        },
        {
          question: 'What is IaaS?',
          options: ['Internet as a Service', 'Infrastructure as a Service', 'Information as a Service', 'Integration as a Service'],
          correct: 1,
          explanation: 'IaaS stands for Infrastructure as a Service, providing virtualized computing resources over the internet.'
        },
        {
          question: 'What is scalability in cloud computing?',
          options: ['Making applications smaller', 'The ability to handle increased load', 'Reducing costs', 'Improving security'],
          correct: 1,
          explanation: 'Scalability in cloud computing refers to the ability of a system to handle increased load by adding resources.'
        },
        {
          question: 'What is a hybrid cloud?',
          options: ['A cloud made of different metals', 'A combination of public and private clouds', 'A cloud for hybrid vehicles', 'A backup cloud'],
          correct: 1,
          explanation: 'A hybrid cloud is a computing environment that combines public cloud services with private cloud infrastructure.'
        }
      ]
    },
    'course9': {
      title: 'French Language Basics',
      questions: [
        {
          question: 'How do you say "Hello" in French?',
          options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
          correct: 0,
          explanation: 'Bonjour is the standard greeting in French, used during the day until evening.'
        },
        {
          question: 'What does "Merci" mean?',
          options: ['Please', 'Thank you', 'Excuse me', 'Goodbye'],
          correct: 1,
          explanation: 'Merci means "thank you" in French, a polite expression of gratitude.'
        },
        {
          question: 'Which article is used before masculine nouns starting with a consonant?',
          options: ['La', 'L\'', 'Le', 'Les'],
          correct: 2,
          explanation: 'Le is the definite article used before masculine singular nouns starting with a consonant.'
        },
        {
          question: 'How do you say "I am" in French?',
          options: ['Je suis', 'Tu es', 'Il est', 'Nous sommes'],
          correct: 0,
          explanation: 'Je suis is the first person singular form of the verb être (to be) in French.'
        },
        {
          question: 'What is the French word for "water"?',
          options: ['Feu', 'Eau', 'Terre', 'Air'],
          correct: 1,
          explanation: 'Eau means water in French, one of the four classical elements.'
        }
      ]
    },
    'course10': {
      title: 'World History Fundamentals',
      questions: [
        {
          question: 'In which year did World War II end?',
          options: ['1944', '1945', '1946', '1947'],
          correct: 1,
          explanation: 'World War II ended in 1945 with the surrender of Japan following the atomic bombings.'
        },
        {
          question: 'Who was the first President of the United States?',
          options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
          correct: 2,
          explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797.'
        },
        {
          question: 'Which ancient civilization built the pyramids at Giza?',
          options: ['Romans', 'Greeks', 'Egyptians', 'Mesopotamians'],
          correct: 2,
          explanation: 'The ancient Egyptians built the pyramids at Giza around 2580–2565 BC during the Fourth Dynasty.'
        },
        {
          question: 'The Renaissance period began in which country?',
          options: ['France', 'England', 'Italy', 'Spain'],
          correct: 2,
          explanation: 'The Renaissance began in Italy during the 14th century, spreading to other parts of Europe.'
        },
        {
          question: 'Which empire was ruled by Genghis Khan?',
          options: ['Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'British Empire'],
          correct: 2,
          explanation: 'Genghis Khan founded the Mongol Empire in 1206, which became the largest contiguous empire in history.'
        }
      ]
    },
    'course11': {
      title: 'Basic Biology',
      questions: [
        {
          question: 'What is the basic unit of life?',
          options: ['Atom', 'Molecule', 'Cell', 'Tissue'],
          correct: 2,
          explanation: 'The cell is the basic structural and functional unit of all living organisms.'
        },
        {
          question: 'Which organelle is known as the "powerhouse" of the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
          correct: 1,
          explanation: 'Mitochondria are known as the powerhouse of the cell because they generate ATP, the cell\'s energy currency.'
        },
        {
          question: 'What is photosynthesis?',
          options: ['Respiration process', 'Process where plants make food using sunlight', 'Cell division', 'Water transport'],
          correct: 1,
          explanation: 'Photosynthesis is the process by which plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.'
        },
        {
          question: 'Which blood type is known as the universal donor?',
          options: ['A', 'B', 'AB', 'O negative'],
          correct: 3,
          explanation: 'O negative blood type is known as the universal donor because it can be given to anyone with any blood type.'
        },
        {
          question: 'What is DNA?',
          options: ['A type of cell', 'Genetic material that carries hereditary information', 'A protein', 'A carbohydrate'],
          correct: 1,
          explanation: 'DNA (Deoxyribonucleic acid) is a molecule that carries the genetic instructions for the development and function of living organisms.'
        }
      ]
    },
    'course12': {
      title: 'Introduction to Psychology',
      questions: [
        {
          question: 'Who is considered the father of psychology?',
          options: ['Sigmund Freud', 'Carl Jung', 'Wilhelm Wundt', 'Ivan Pavlov'],
          correct: 2,
          explanation: 'Wilhelm Wundt is considered the father of psychology as he established the first psychology laboratory in 1879.'
        },
        {
          question: 'What is classical conditioning?',
          options: ['Learning through rewards', 'Learning through association', 'Learning through observation', 'Learning through trial and error'],
          correct: 1,
          explanation: 'Classical conditioning is a learning process that occurs through associations between an environmental stimulus and a naturally occurring stimulus.'
        },
        {
          question: 'Which part of the brain is responsible for memory?',
          options: ['Cerebellum', 'Hippocampus', 'Medulla oblongata', 'Pons'],
          correct: 1,
          explanation: 'The hippocampus is crucial for forming and retrieving memories, playing a key role in learning and memory.'
        },
        {
          question: 'What is the term for judging others based on first impressions?',
          options: ['Stereotyping', 'Halo effect', 'Confirmation bias', 'Anchoring bias'],
          correct: 1,
          explanation: 'The halo effect is a cognitive bias where our overall impression of a person influences how we perceive their specific traits.'
        },
        {
          question: 'What does IQ stand for?',
          options: ['Intelligence Quotient', 'Internal Quality', 'Individual Quality', 'Intelligence Quality'],
          correct: 0,
          explanation: 'IQ stands for Intelligence Quotient, a score derived from standardized tests designed to measure intelligence.'
        }
      ]
    },
    'course13': {
      title: 'Art History Basics',
      questions: [
        {
          question: 'Who painted the Mona Lisa?',
          options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
          correct: 2,
          explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519, one of the most famous paintings in the world.'
        },
        {
          question: 'What art movement was Vincent van Gogh associated with?',
          options: ['Impressionism', 'Cubism', 'Post-Impressionism', 'Surrealism'],
          correct: 2,
          explanation: 'Vincent van Gogh is associated with Post-Impressionism, characterized by vivid colors and emotional intensity.'
        },
        {
          question: 'Which period is known for its focus on harmony, balance, and idealized human forms?',
          options: ['Baroque', 'Renaissance', 'Romanticism', 'Modern Art'],
          correct: 1,
          explanation: 'The Renaissance period (14th-17th centuries) emphasized harmony, balance, and idealized human forms.'
        },
        {
          question: 'What is the primary medium used in fresco painting?',
          options: ['Oil', 'Watercolor', 'Pigments on wet plaster', 'Acrylic'],
          correct: 2,
          explanation: 'Fresco painting involves applying pigments to wet plaster, creating a durable and long-lasting artwork.'
        },
        {
          question: 'Which artist is famous for cutting off his own ear?',
          options: ['Pablo Picasso', 'Salvador Dalí', 'Vincent van Gogh', 'Claude Monet'],
          correct: 2,
          explanation: 'Vincent van Gogh famously cut off part of his left ear in 1888 during a period of mental crisis.'
        }
      ]
    },
    'course14': {
      title: 'Basic Economics',
      questions: [
        {
          question: 'What is supply and demand?',
          options: ['Government regulations', 'The relationship between availability and desire for goods', 'Banking system', 'Stock market'],
          correct: 1,
          explanation: 'Supply and demand is an economic model that describes how the price and quantity of goods are determined by the balance between supply and demand.'
        },
        {
          question: 'What is inflation?',
          options: ['Increase in stock prices', 'Decrease in purchasing power of money', 'Government debt', 'Bank interest rates'],
          correct: 1,
          explanation: 'Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power.'
        },
        {
          question: 'What is GDP?',
          options: ['Government spending', 'Gross Domestic Product - total value of goods and services produced', 'Bank deposits', 'Stock dividends'],
          correct: 1,
          explanation: 'GDP (Gross Domestic Product) measures the total value of goods and services produced within a country in a specific time period.'
        },
        {
          question: 'What is a monopoly?',
          options: ['Multiple sellers in a market', 'Single seller dominating the market', 'Government control', 'Free market competition'],
          correct: 1,
          explanation: 'A monopoly exists when a single seller dominates the market, giving them significant control over price and supply.'
        },
        {
          question: 'What is fiscal policy?',
          options: ['Central bank actions', 'Government spending and taxation policies', 'Trade regulations', 'Labor laws'],
          correct: 1,
          explanation: 'Fiscal policy refers to the use of government spending and taxation to influence economic conditions.'
        }
      ]
    },
    'course15': {
      title: 'Environmental Science',
      questions: [
        {
          question: 'What is climate change?',
          options: ['Weather patterns', 'Long-term changes in temperature and weather patterns', 'Seasonal variations', 'Daily temperature fluctuations'],
          correct: 1,
          explanation: 'Climate change refers to long-term changes in temperature and typical weather patterns in a place.'
        },
        {
          question: 'What is the greenhouse effect?',
          options: ['Plant growth process', 'Trapping of heat in the atmosphere by gases', 'Ocean currents', 'Wind patterns'],
          correct: 1,
          explanation: 'The greenhouse effect is the process by which gases in Earth\'s atmosphere trap heat, keeping the planet warm enough to support life.'
        },
        {
          question: 'What is biodiversity?',
          options: ['Weather diversity', 'Variety of life in the world or in a particular habitat', 'Soil types', 'Water sources'],
          correct: 1,
          explanation: 'Biodiversity refers to the variety of life on Earth, including the different species of plants, animals, and microorganisms.'
        },
        {
          question: 'What is deforestation?',
          options: ['Planting trees', 'Clearing of forests for other land uses', 'Forest fires', 'Tree pruning'],
          correct: 1,
          explanation: 'Deforestation is the large-scale removal of forests, often to make way for agriculture or urban development.'
        },
        {
          question: 'What is renewable energy?',
          options: ['Coal and oil', 'Energy from sources that replenish naturally', 'Nuclear power', 'Fossil fuels'],
          correct: 1,
          explanation: 'Renewable energy comes from sources that are naturally replenished, such as solar, wind, hydro, and geothermal power.'
        }
      ]
    },
    'course16': {
      title: 'Music Theory Fundamentals',
      questions: [
        {
          question: 'How many notes are in a standard musical scale?',
          options: ['5', '7', '8', '12'],
          correct: 1,
          explanation: 'A standard major or minor scale consists of 7 different notes before repeating the pattern.'
        },
        {
          question: 'What does BPM stand for in music?',
          options: ['Basic Piano Method', 'Beats Per Minute', 'Bass Performance Mode', 'Background Play Music'],
          correct: 1,
          explanation: 'BPM stands for Beats Per Minute, measuring the tempo or speed of a piece of music.'
        },
        {
          question: 'What is a chord?',
          options: ['A single note', 'Combination of notes played together', 'A musical rest', 'A type of instrument'],
          correct: 1,
          explanation: 'A chord is a group of notes played together, typically consisting of three or more notes.'
        },
        {
          question: 'What is the first note of the C major scale?',
          options: ['C', 'D', 'E', 'F'],
          correct: 0,
          explanation: 'C is the first note (tonic) of the C major scale, which uses all natural notes without sharps or flats.'
        },
        {
          question: 'What is rhythm in music?',
          options: ['Loudness of sound', 'Pattern of sounds and silences', 'Highness or lowness of sound', 'Quality of sound'],
          correct: 1,
          explanation: 'Rhythm refers to the pattern of sounds and silences in music, including beat, tempo, and meter.'
        }
      ]
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5050/api/courses');
        // Always show sample courses for demo purposes
        setCourses([
          { _id: 'course1', title: 'Introduction to Programming', category: 'Development', description: 'Learn the fundamentals of programming with this comprehensive course.' },
          { _id: 'course2', title: 'Web Development Fundamentals', category: 'Development', description: 'Master HTML, CSS, and JavaScript to build modern websites.' },
          { _id: 'course3', title: 'Data Science Basics', category: 'Data Science', description: 'Explore data analysis, visualization, and machine learning concepts.' },
          { _id: 'course4', title: 'React.js Fundamentals', category: 'Development', description: 'Build dynamic user interfaces with React.js components and hooks.' },
          { _id: 'course5', title: 'Database Management', category: 'Database', description: 'Learn SQL, database design, and data management principles.' },
          { _id: 'course6', title: 'Cybersecurity Essentials', category: 'Security', description: 'Understand cybersecurity threats, encryption, and best practices.' },
          { _id: 'course7', title: 'Cloud Computing', category: 'Cloud', description: 'Master cloud services, deployment, and scalability concepts.' },
          { _id: 'course8', title: 'Mobile App Development', category: 'Mobile', description: 'Create mobile applications for iOS and Android platforms.' },
          { _id: 'course9', title: 'French Language Basics', category: 'Languages', description: 'Learn basic French vocabulary, grammar, and conversation skills.' },
          { _id: 'course10', title: 'World History Fundamentals', category: 'History', description: 'Explore key events, civilizations, and figures that shaped world history.' },
          { _id: 'course11', title: 'Basic Biology', category: 'Science', description: 'Discover the fundamental principles of life, cells, and biological processes.' },
          { _id: 'course12', title: 'Introduction to Psychology', category: 'Psychology', description: 'Understand human behavior, cognition, and mental processes.' },
          { _id: 'course13', title: 'Art History Basics', category: 'Arts', description: 'Journey through the history of art from ancient times to modern movements.' },
          { _id: 'course14', title: 'Basic Economics', category: 'Business', description: 'Learn fundamental economic concepts, markets, and financial principles.' },
          { _id: 'course15', title: 'Environmental Science', category: 'Science', description: 'Study environmental systems, climate change, and sustainability.' },
          { _id: 'course16', title: 'Music Theory Fundamentals', category: 'Arts', description: 'Learn the basic elements of music theory, scales, and composition.' }
        ]);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Fallback to sample courses
        setCourses([
          { _id: 'course1', title: 'Introduction to Programming', category: 'Development', description: 'Learn the fundamentals of programming with this comprehensive course.' },
          { _id: 'course2', title: 'Web Development Fundamentals', category: 'Development', description: 'Master HTML, CSS, and JavaScript to build modern websites.' },
          { _id: 'course3', title: 'Data Science Basics', category: 'Data Science', description: 'Explore data analysis, visualization, and machine learning concepts.' },
          { _id: 'course4', title: 'React.js Fundamentals', category: 'Development', description: 'Build dynamic user interfaces with React.js components and hooks.' },
          { _id: 'course5', title: 'Database Management', category: 'Database', description: 'Learn SQL, database design, and data management principles.' },
          { _id: 'course6', title: 'Cybersecurity Essentials', category: 'Security', description: 'Understand cybersecurity threats, encryption, and best practices.' },
          { _id: 'course7', title: 'Cloud Computing', category: 'Cloud', description: 'Master cloud services, deployment, and scalability concepts.' },
          { _id: 'course8', title: 'Mobile App Development', category: 'Mobile', description: 'Create mobile applications for iOS and Android platforms.' },
          { _id: 'course9', title: 'French Language Basics', category: 'Languages', description: 'Learn basic French vocabulary, grammar, and conversation skills.' },
          { _id: 'course10', title: 'World History Fundamentals', category: 'History', description: 'Explore key events, civilizations, and figures that shaped world history.' },
          { _id: 'course11', title: 'Basic Biology', category: 'Science', description: 'Discover the fundamental principles of life, cells, and biological processes.' },
          { _id: 'course12', title: 'Introduction to Psychology', category: 'Psychology', description: 'Understand human behavior, cognition, and mental processes.' },
          { _id: 'course13', title: 'Art History Basics', category: 'Arts', description: 'Journey through the history of art from ancient times to modern movements.' },
          { _id: 'course14', title: 'Basic Economics', category: 'Business', description: 'Learn fundamental economic concepts, markets, and financial principles.' },
          { _id: 'course15', title: 'Environmental Science', category: 'Science', description: 'Study environmental systems, climate change, and sustainability.' },
          { _id: 'course16', title: 'Music Theory Fundamentals', category: 'Arts', description: 'Learn the basic elements of music theory, scales, and composition.' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const startQuiz = (course) => {
    setSelectedCourse(course);
    setQuiz(sampleQuizzes[course._id] || sampleQuizzes['course1']);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    const isCorrect = answerIndex === quiz.questions[questionIndex].correct;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
    setSelectedAnswer(answerIndex);
    setAnswerFeedback({
      isCorrect,
      correctAnswer: quiz.questions[questionIndex].correct,
      explanation: quiz.questions[questionIndex].explanation
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerFeedback(null);
    } else {
      calculateScore();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setAnswerFeedback(null);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);

    // Save quiz result to backend
    saveQuizResult(correctAnswers);
  };

  const saveQuizResult = async (finalScore) => {
    try {
      await axios.post('http://localhost:5050/api/quizzes/results', {
        userId: user._id,
        courseId: selectedCourse._id,
        score: finalScore,
        answers: answers,
        totalQuestions: quiz.questions.length
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  };

  const resetQuiz = () => {
    setSelectedCourse(null);
    setQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  if (!user) {
    return (
      <div className="quiz-page">
        <div className="container-lg">
          <div className="access-denied">
            <h2>🔒 Login Required</h2>
            <p>You need to be logged in to take quizzes and test your knowledge.</p>
            <div className="auth-actions">
              <a href="/login" className="btn btn-primary">Login</a>
              <a href="/register" className="btn btn-outline">Sign Up</a>
            </div>
            <div className="quiz-preview">
              <h3>Available Quizzes</h3>
              <p>Once logged in, you can take quizzes on:</p>
              <ul>
                <li>Introduction to Programming</li>
                <li>Web Development Fundamentals</li>
                <li>Data Science Basics</li>
                <li>React.js Fundamentals</li>
                <li>Database Management</li>
                <li>Cybersecurity Essentials</li>
                <li>Cloud Computing</li>
                <li>Mobile App Development</li>
                <li>French Language Basics</li>
                <li>World History Fundamentals</li>
                <li>Basic Biology</li>
                <li>Introduction to Psychology</li>
                <li>Art History Basics</li>
                <li>Basic Economics</li>
                <li>Environmental Science</li>
                <li>Music Theory Fundamentals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-page">
        <div className="quiz-results">
          <div className="container-lg">
            <div className="results-card">
              <h2>Quiz Results</h2>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{score}%</span>
                </div>
                <p className="score-text">
                  You got {Object.keys(answers).filter(key => answers[key] === quiz.questions[key].correct).length} out of {quiz.questions.length} questions correct
                </p>
              </div>

              <div className="results-details">
                {quiz.questions.map((question, index) => (
                  <div key={index} className="question-result">
                    <h4>Question {index + 1}: {question.question}</h4>
                    <p className={`answer-status ${answers[index] === question.correct ? 'correct' : 'incorrect'}`}>
                      Your answer: {question.options[answers[index]] || 'Not answered'}
                      {answers[index] !== question.correct && (
                        <span> (Correct: {question.options[question.correct]})</span>
                      )}
                    </p>
                    <p className="explanation">{question.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="results-actions">
                <button onClick={resetQuiz} className="btn btn-primary">
                  Take Another Quiz
                </button>
                <button onClick={() => window.location.href = '/courses'} className="btn btn-outline">
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setQuiz(sampleQuizzes[courseId]);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <h1>Quiz Challenge</h1>
          <p>Test your knowledge and learn something new</p>
          
          {quiz && !showResults && (
            <div className="quiz-progress">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Course Selection */}
        {!selectedCourse && (
          <div className="course-selection">
            <h2>Choose a Quiz Topic</h2>
            <div className="course-grid">
              {Object.entries(sampleQuizzes).map(([key, quizData]) => (
                <div 
                  key={key}
                  className={`course-card ${selectedCourse === key ? 'selected' : ''}`}
                  onClick={() => selectCourse(key)}
                >
                  <h3>{quizData.title}</h3>
                  <p>{quizData.questions.length} questions</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Container */}
        {selectedCourse && quiz && !showResults && (
          <div className="quiz-container-main">
            <div className="question-container">
              <div className="question-number">
                Question {currentQuestion + 1}
              </div>
              <h3 className="question-text">
                {quiz.questions[currentQuestion].question}
              </h3>
              
              <div className="options-container">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <label 
                    key={index}
                    className={`option-label ${
                      selectedAnswer === index ? 'selected' : ''
                    } ${
                      selectedAnswer !== null && index === quiz.questions[currentQuestion].correct ? 'correct' : ''
                    } ${
                      selectedAnswer !== null && index === selectedAnswer && selectedAnswer !== quiz.questions[currentQuestion].correct ? 'incorrect' : ''
                    } ${selectedAnswer !== null ? 'disabled' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswer(currentQuestion, index)}
                      disabled={selectedAnswer !== null}
                      className="option-input"
                    />
                    <span className="option-text">{option}</span>
                    {selectedAnswer !== null && index === quiz.questions[currentQuestion].correct && (
                      <span className="answer-indicator correct">Correct</span>
                    )}
                    {selectedAnswer !== null && index === selectedAnswer && selectedAnswer !== quiz.questions[currentQuestion].correct && (
                      <span className="answer-indicator incorrect">Wrong</span>
                    )}
                  </label>
                ))}
              </div>

              {answerFeedback && (
                <div className={`answer-feedback ${answerFeedback.isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                  <div className="feedback-header">
                    <span className={`feedback-icon ${answerFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
                      {answerFeedback.isCorrect ? '' : ''}
                    </span>
                    <span className="feedback-text">
                      {answerFeedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                    </span>
                  </div>
                  {!answerFeedback.isCorrect && (
                    <div className="correct-answer">
                      <strong>Correct answer:</strong> {quiz.questions[currentQuestion].options[quiz.questions[currentQuestion].correct]}
                    </div>
                  )}
                  <div className="explanation">
                    <strong>Explanation:</strong> {answerFeedback.explanation}
                  </div>
                </div>
              )}
            </div>

            <div className="quiz-navigation">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="btn btn-outline"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined}
                className="btn btn-primary"
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="results-container">
            <h2>Quiz Complete!</h2>
            <div className="score-display">
              {score}/{quiz.questions.length}
            </div>
            <div className="score-message">
              You got {score} out of {quiz.questions.length} questions correct!
              {score === quiz.questions.length && ' Perfect Score!'}
              {score >= quiz.questions.length * 0.8 && score < quiz.questions.length && ' Great Job!'}
              {score >= quiz.questions.length * 0.6 && score < quiz.questions.length * 0.8 && ' Good Effort!'}
              {score < quiz.questions.length * 0.6 && ' Keep Learning!'}
            </div>
            <div className="quiz-navigation">
              <button onClick={restartQuiz} className="btn btn-primary">
                Try Again
              </button>
              <button onClick={() => setSelectedCourse(null)} className="btn btn-outline">
                Choose Another Quiz
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            <h2>Loading Quiz...</h2>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;