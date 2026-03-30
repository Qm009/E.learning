import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AIAssistant.css';
import { BarChart, BookOpen, GraduationCap, Lightbulb, Rocket, Target, User, Users } from 'lucide-react';


const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '👋 Bonjour ! Je suis votre assistant IA éducatif. Je peux vous aider avec :',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'bot',
      content: '<span className="icon-wrapper"><BookOpen size={18} /></span> Questions sur les cours et programmation',
      timestamp: new Date()
    },
    {
      id: 3,
      type: 'bot',
      content: '<span className="icon-wrapper"><Target size={18} /></span> Aide aux devoirs et exercices',
      timestamp: new Date()
    },
    {
      id: 4,
      type: 'bot',
      content: '<span className="icon-wrapper"><Lightbulb size={18} /></span> Conseils de carrière et orientation',
      timestamp: new Date()
    },
    {
      id: 5,
      type: 'bot',
      content: '🔧 Support technique et dépannage',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const predefinedQuestions = [
    'Comment puis-je améliorer mes compétences en React ?',
    'Quelles sont les meilleures pratiques pour débuter en JavaScript ?',
    'Comment créer un portfolio développeur web ?',
    'Quels sont les différences entre let et const en JS ?',
    'Comment préparer un entretien technique ?',
    'Quels projets puis-je faire pour débuter en Data Science ?',
    'Comment utiliser Git et GitHub efficacement ?',
    'Quels frameworks JavaScript apprendre après React ?',
    'Comment optimiser les performances d\'une application web ?',
    'Quelles compétences recherchent les recruteurs en 2024 ?'
  ];

  const generateAIResponse = async (userMessage) => {
    // Simuler une réponse IA basée sur le contexte éducatif
    const responses = {
      'react': 'Pour améliorer vos compétences en React, je vous recommande : 1) Pratiquez les Hooks fondamentaux (useState, useEffect) 2) Créez des projets réels comme une todo-liste ou une application de météo 3) Étudiez les patterns avancés comme HOCs et Render Props 4) Explorez Next.js ou React Native pour élargir vos compétences.',
      'javascript': 'Les meilleures pratiques pour débuter : 1) Maîtrisez les bases (variables, fonctions, tableaux) 2) Comprenez le DOM et les événements 3) Apprenez ES6+ (arrow functions, destructuring, spread) 4) Pratiquez avec des projets concrets comme une calculatrice ou un jeu simple.',
      'portfolio': 'Un portfolio développeur web efficace doit inclure : 1) Projets variés (3-5 projets de qualité) 2) Code propre et commenté sur GitHub 3) Design responsive et moderne 4) Section "À propos" avec votre parcours 5) Coordonnées professionnelles et liens vers vos réseaux.',
      'entretien': 'Préparation entretien technique : 1) Révisez les algorithmes et structures de données 2) Pratiquez le whiteboarding 3) Préparez des exemples concrets de vos projets 4) Entraînez-vous avec des plateformes comme LeetCode 5) Préparez des questions sur votre expérience et motivations.',
      'projets': 'Projets Data Science débutants : 1) Analyse de datasets avec Python/Pandas 2) Visualisation avec Matplotlib/Seaborn 3) Modèle de machine learning simple (régression linéaire) 4) Tableau de bord avec Streamlit ou Dash 5) Projet de classification avec scikit-learn.',
      'git': 'Git/GitHub efficaces : 1) Commits fréquents et descriptifs 2) Branches fonctionnelles (feature/bugfix) 3) Pull requests pour collaborer 4) Issues pour suivre les bugs 5) README.md complet pour chaque projet.',
      'frameworks': 'Après React : 1) Vue.js (plus facile à apprendre) 2) Angular (pour les grandes applications) 3) Svelte (moderne et performant) 4) Next.js (React avec SSR) 5) Express.js (backend Node.js).',
      'performance': 'Optimisation web : 1) Lazy loading des images 2) Code splitting avec React.lazy 3) Optimisation des bundles (Webpack) 4) Cache stratégique (Service Workers) 5) Monitoring avec Lighthouse.',
      'carriere': 'Compétences recherchées 2024 : 1) React/Next.js 2) Python/ML 3) Cloud (AWS/Azure/GCP) 4) DevOps (Docker/Kubernetes) 5) Soft skills (communication, travail d\'équipe).',
      'personnalis': '<span className="icon-wrapper"><Target size={18} /></span> **Apprentissage Personnalisé activé.**\nPour adapter mes réponses, veuillez m\'indiquer :\n1. Votre niveau actuel (Débutant, Intermédiaire, Avancé)\n2. Votre langage ou outil de prédilection\n3. Votre objectif (Ex: Trouver un emploi, Réussir un examen, Créer un projet personnel)',
      'connaissances': '<span className="icon-wrapper"><BookOpen size={18} /></span> **Base de Connaissances**\nJe suis connecté à plus de 5000 ressources.\nQue cherchez-vous exactement ?\n- Tutoriels de code\n- Exercices pratiques\n- Documentation technique\n- Vidéos explicatives',
      'instantan': '⚡ **Réponses Instantanées**\nJe suis prêt ! Collez simplement votre code ici avec le message d\'erreur que vous obtenez, et je vous expliquerai comment le résoudre étape par étape.',
      'progression': '🔗 **Intégration Cours**\nD\'après vos données, vous êtes actuellement inscrit(e) au cours de JavaScript. Vous en êtes au module "Les Promises". Voulez-vous que je génère un quiz rapide pour tester vos connaissances sur ce chapitre ?'
    };

    // Détecter le contexte de la question
    const lowerMessage = userMessage.toLowerCase();
    let response = '🤖 Je réfléchis à votre question...';

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // Si aucun contexte spécifique, réponse générale
    if (response === '🤖 Je réfléchis à votre question...') {
      response = '<span className="icon-wrapper"><GraduationCap size={18} /></span> Je suis là pour vous aider dans votre parcours d\'apprentissage ! Posez-moi vos questions sur la programmation, les cours, les projets ou votre carrière. N\'hésitez pas à demander des éclaircissements si besoin.';
    }

    // Simuler un délai de "réflexion"
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    return response;
  };

  const sendMessageInternal = async (text) => {
    if (text.trim() === '') return;

    const userMessageObj = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessageObj]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(text);
      
      const aiMessageObj = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessageObj]);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
      // Remonter en douceur jusqu'à la zone de chat
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessageInternal(inputMessage);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessageInternal(suggestion);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);
    
    // Générer des suggestions basées sur l'entrée
    if (value.length > 2) {
      const filtered = predefinedQuestions.filter(q => 
        q.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleFeatureClick = (featureId) => {
    let prompt = '';
    switch(featureId) {
      case 'personnalise':
        prompt = "Activer l'apprentissage personnalisé";
        break;
      case 'connaissances':
        prompt = "Rechercher dans la base de connaissances";
        break;
      case 'instantane':
        prompt = "J'ai besoin d'une réponse instantanée pour du code";
        break;
      case 'integration':
        prompt = "Où en est ma progression dans mes cours ?";
        break;
      default:
        break;
    }
    
    if (prompt) {
      // Envoyer le message de l'IA immédiatement en interne
      sendMessageInternal(prompt);
    }
  };

  useEffect(() => {
    // Faire défiler vers le bas automatiquement
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="ai-assistant">
      {/* Header */}
      <section className="ai-header">
        <div className="container">
          <div className="header-content">
            <div className="ai-info">
              <div className="ai-avatar">
                <span className="ai-icon">🤖</span>
              </div>
              <div className="ai-details">
                <h1>EduPortal AI Assistant</h1>
                <p>Votre assistant personnel pour l'apprentissage et le développement</p>
                <div className="ai-status">
                  <span className="status-dot online"></span>
                  <span>En ligne - Prêt à vous aider</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/courses" className="btn btn-outline">
                <span className="icon-wrapper"><BookOpen size={18} /></span> Voir les cours
              </Link>
              <Link to="/community-support" className="btn btn-outline">
                <span className="icon-wrapper"><Users size={18} /></span> Retour à la communauté
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="chat-container">
        <div className="container">
          <div className="chat-layout">
            
            {/* Sidebar */}
            <aside className="chat-sidebar">
              <div className="sidebar-section">
                <h3><span className="icon-wrapper"><Lightbulb size={18} /></span> Questions Rapides</h3>
                <div className="quick-questions">
                  {predefinedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="quick-question-btn"
                      onClick={() => handleSuggestionClick(question)}
                    >
                      {question.length > 50 ? question.substring(0, 47) + '...' : question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3><span className="icon-wrapper"><Target size={18} /></span> Sujets Populaires</h3>
                <div className="topics-grid">
                  <div className="topic-card">
                    <span className="topic-icon">⚛️</span>
                    <span>React & JavaScript</span>
                  </div>
                  <div className="topic-card">
                    <span className="topic-icon">🐍</span>
                    <span>Python & Data Science</span>
                  </div>
                  <div className="topic-card">
                    <span className="topic-icon">🎨</span>
                    <span>Design & UX</span>
                  </div>
                  <div className="topic-card">
                    <span className="topic-icon">💼</span>
                    <span>Carrière & Portfolio</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <h3><span className="icon-wrapper"><BarChart size={18} /></span> Statistiques</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">Questions aujourd\'hui</span>
                    <span className="stat-value">127</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Étudiants aidés</span>
                    <span className="stat-value">2,847</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Satisfaction</span>
                    <span className="stat-value">4.8/5</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Chat Messages */}
            <main className="chat-main">
              <div className="chat-messages" ref={messagesEndRef}>
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'user' ? (
                        <div className="user-avatar"><span className="icon-wrapper"><User size={18} /></span></div>
                      ) : (
                        <div className="ai-avatar">
                          <span className="ai-icon">🤖</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="message-author">
                          {message.type === 'user' ? 'Vous' : 'AI Assistant'}
                        </span>
                      </div>
                      <div className="message-text">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="message bot typing">
                    <div className="message-avatar">
                      <div className="ai-avatar">
                        <span className="ai-icon typing">🤖</span>
                      </div>
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="chat-input-container">
                {suggestions.length > 0 && (
                  <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span className="icon-wrapper"><Lightbulb size={18} /></span> {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="input-form">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={handleInputChange}
                      placeholder="Posez votre question ici..."
                      className="chat-input"
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      className="send-btn"
                      disabled={isTyping || inputMessage.trim() === ''}
                    >
                      <span className="send-icon">📤</span>
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ai-features">
        <div className="container">
          <div className="features-header">
            <h2><span className="icon-wrapper"><Rocket size={18} /></span> Fonctionnalités Avancées</h2>
            <p>Découvrez comment notre IA peut transformer votre apprentissage</p>
          </div>
          
          <div className="features-grid">
            <div 
              className="feature-card interactive-card" 
              onClick={() => handleFeatureClick('personnalise')}
              style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="feature-icon"><span className="icon-wrapper"><Target size={18} /></span></div>
              <h3>Apprentissage Personnalisé</h3>
              <p>Adapte ses réponses selon votre niveau et vos objectifs d'apprentissage</p>
            </div>
            
            <div 
              className="feature-card interactive-card" 
              onClick={() => handleFeatureClick('connaissances')}
              style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="feature-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></div>
              <h3>Base de Connaissances</h3>
              <p>Accès à des milliers de ressources éducatives et tutoriels</p>
            </div>
            
            <div 
              className="feature-card interactive-card" 
              onClick={() => handleFeatureClick('instantane')}
              style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="feature-icon">⚡</div>
              <h3>Réponses Instantanées</h3>
              <p>Obtenez de l'aide immédiatement 24/7 pour vos questions techniques</p>
            </div>
            
            <div 
              className="feature-card interactive-card" 
              onClick={() => handleFeatureClick('integration')}
              style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="feature-icon">🔗</div>
              <h3>Intégration Cours</h3>
              <p>Connecté directement à vos cours et progression pour un suivi personnalisé</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAssistant;
