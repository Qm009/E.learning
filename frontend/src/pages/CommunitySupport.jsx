import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CommunitySupport.css';
import { Brain, Book, BookOpen, Calendar, Check, Clipboard, Heart, LifeBuoy, Map, MessageSquare, MonitorPlay, Pin, Rocket, Search, Star, User, Video, Wrench } from 'lucide-react';


const CommunitySupport = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [resourcesData, setResourcesData] = useState([
    {
      id: 1,
      title: 'JavaScript Roadmap 2024',
      type: 'roadmap',
      description: 'Complete learning path for JavaScript development',
      downloads: 1234,
      rating: 4.8
    },
    {
      id: 2,
      title: 'React Cheatsheet',
      type: 'cheatsheet',
      description: 'Quick reference for React hooks and patterns',
      downloads: 892,
      rating: 4.9
    },
    {
      id: 3,
      title: 'Python Data Science Guide',
      type: 'guide',
      description: 'Comprehensive guide for data science with Python',
      downloads: 756,
      rating: 4.7
    }
  ]);

  const discussions = [
    {
      id: 1,
      title: 'Best practices for React hooks?',
      author: 'Sarah Chen',
      avatar: 'SC',
      category: 'React Development',
      content: 'I am struggling with useEffect and dependency arrays. Can someone explain the best practices?',
      replies: 12,
      likes: 24,
      time: '2 hours ago',
      isPinned: true
    },
    {
      id: 2,
      title: 'Python vs JavaScript for beginners?',
      author: 'Marc Dubois',
      avatar: 'MD',
      category: 'Career Advice',
      content: 'I am new to programming and wondering which language to start with. Any recommendations?',
      replies: 8,
      likes: 15,
      time: '5 hours ago'
    },
    {
      id: 3,
      title: 'Tips for passing technical interviews',
      author: 'Emma Wilson',
      avatar: 'EW',
      category: 'Career Advice',
      content: 'Sharing my experience from recent interviews at top tech companies...',
      replies: 23,
      likes: 45,
      time: '1 day ago'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'React Workshop: Advanced Hooks',
      date: 'March 25, 2024',
      time: '2:00 PM EST',
      type: 'workshop',
      attendees: 45,
      maxAttendees: 50
    },
    {
      id: 2,
      title: 'Python Study Group',
      date: 'March 27, 2024',
      time: '6:00 PM EST',
      type: 'study-group',
      attendees: 12,
      maxAttendees: 20
    },
    {
      id: 3,
      title: 'Career Q&A with Industry Experts',
      date: 'March 30, 2024',
      time: '3:00 PM EST',
      type: 'webinar',
      attendees: 128,
      maxAttendees: 200
    }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    console.log('New post:', newPost);
    setNewPost({ title: '', content: '', category: 'general' });
  };

  const handleDownloadResource = (resource) => {
    // Créer un contenu factice pour le téléchargement
    const resourceContent = `
# ${resource.title}

## Description
${resource.description}

## Type
${resource.type}

## Statistiques
- Téléchargements: ${resource.downloads}
- Note: ${resource.rating}/5

## Contenu généré automatiquement
Ceci est un exemple de ressource éducative générée par EduPortal.
Pour plus de ressources, visitez notre plateforme d'apprentissage.

---
Généré le ${new Date().toLocaleDateString('fr-FR')}
    `.trim();

    // Créer un blob et déclencher le téléchargement
    const blob = new Blob([resourceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Mettre à jour le compteur de téléchargements
    setResourcesData(prev => prev.map(r => 
      r.id === resource.id 
        ? { ...r, downloads: r.downloads + 1 }
        : r
    ));

    // Afficher un message de confirmation
    alert(`${resource.title} téléchargé avec succès !`);
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="community-support">
      {/* Header */}
      <section className="community-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1>Community Support</h1>
              <p>Connect, learn, and grow with fellow learners from around the world</p>
              <div className="header-actions">
                <Link to="/ai-assistant" className="btn btn-primary">
                  <span className="icon-wrapper"><Brain size={18} /></span> Ask our AI Assistant
                </Link>
                <button className="btn btn-outline" onClick={() => setActiveTab('discussions')}>
                  Browse Discussions
                </button>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat">
                <span className="stat-number">15,234</span>
                <span className="stat-label">Active Members</span>
              </div>
              <div className="stat">
                <span className="stat-number">3,456</span>
                <span className="stat-label">Discussions</span>
              </div>
              <div className="stat">
                <span className="stat-number">892</span>
                <span className="stat-label">Online Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="community-nav">
        <div className="container">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'discussions' ? 'active' : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              <span className="nav-icon"><span className="icon-wrapper"><MessageSquare size={18} /></span></span>
              <span className="nav-text">Discussions</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <span className="nav-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
              <span className="nav-text">Resources</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <span className="nav-icon"><span className="icon-wrapper"><Calendar size={18} /></span></span>
              <span className="nav-text">Events</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              <span className="nav-icon"><span className="icon-wrapper"><LifeBuoy size={18} /></span></span>
              <span className="nav-text">Get Help</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="community-content">
        <div className="container">
          
          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Community Discussions</h2>
                <div className="content-actions">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <span className="search-icon"><span className="icon-wrapper"><Search size={18} /></span></span>
                  </div>
                  <button className="btn btn-primary">
                    ➕ New Discussion
                  </button>
                </div>
              </div>

              <div className="discussions-grid">
                {filteredDiscussions.map(discussion => (
                  <div key={discussion.id} className="discussion-card">
                    <div className="discussion-header">
                      <div className="author-info">
                        <div className="author-avatar">{discussion.avatar}</div>
                        <div className="author-details">
                          <span className="author-name">{discussion.author}</span>
                          <span className="discussion-time">{discussion.time}</span>
                        </div>
                      </div>
                      {discussion.isPinned && <span className="pinned-badge"><span className="icon-wrapper"><Pin size={14} /></span> Pinned</span>}
                    </div>
                    
                    <div className="discussion-content">
                      <h3>{discussion.title}</h3>
                      <p>{discussion.content}</p>
                    </div>
                    
                    <div className="discussion-meta">
                      <span className="category">{discussion.category}</span>
                      <div className="discussion-stats">
                        <span className="stat"><span className="icon-wrapper"><MessageSquare size={18} /></span> {discussion.replies}</span>
                        <span className="stat"><span className="icon-wrapper"><Heart size={18} /></span> {discussion.likes}</span>
                      </div>
                    </div>
                    
                    <div className="discussion-actions">
                      <button className="btn btn-outline btn-sm">Reply</button>
                      <button className="btn btn-outline btn-sm">Like</button>
                      <button className="btn btn-outline btn-sm">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Learning Resources</h2>
                <p>Download guides, cheatsheets, and learning materials</p>
              </div>

              <div className="resources-grid">
                {resourcesData.map(resource => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-icon">
                      {resource.type === 'roadmap' && <span className="icon-wrapper"><Map size={18} /></span>}
                      {resource.type === 'cheatsheet' && <span className="icon-wrapper"><Clipboard size={18} /></span>}
                      {resource.type === 'guide' && <span className="icon-wrapper"><Book size={18} /></span>}
                    </div>
                    
                    <div className="resource-content">
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                    </div>
                    
                    <div className="resource-meta">
                      <div className="resource-stats">
                        <span className="stat"><span className="icon-wrapper"><Rocket size={14} /></span> {resource.downloads}</span>
                        <span className="stat"><span className="icon-wrapper"><Star size={18} /></span> {resource.rating}</span>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleDownloadResource(resource)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Upcoming Events</h2>
                <p>Join workshops, study groups, and webinars</p>
              </div>

              <div className="events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-date">
                      <div className="date">{event.date.split(',')[0]}</div>
                      <div className="time">{event.time}</div>
                    </div>
                    
                    <div className="event-content">
                      <span className="event-type">
                        {event.type === 'workshop' && <><span className="icon-wrapper"><Wrench size={14} /></span> Workshop</>}
                        {event.type === 'study-group' && <><span className="icon-wrapper"><BookOpen size={14} /></span> Study Group</>}
                        {event.type === 'webinar' && <><span className="icon-wrapper"><Video size={14} /></span> Webinar</>}
                      </span>
                      <h3>{event.title}</h3>
                      <div className="attendee-info">
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                        <div className="attendee-bar">
                          <div 
                            className="attendee-fill" 
                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="event-actions">
                      <button className="btn btn-primary">Join Event</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Get Help</h2>
                <p>Find answers to common questions or contact support</p>
              </div>

              <div className="help-sections">
                <div className="help-category">
                  <h3><span className="icon-wrapper"><BookOpen size={18} /></span> Learning Help</h3>
                  <ul className="help-links">
                    <li><Link to="/help/courses">Course Navigation</Link></li>
                    <li><Link to="/help/progress">Tracking Progress</Link></li>
                    <li><Link to="/help/certificates">Getting Certificates</Link></li>
                    <li><Link to="/help/technical">Technical Issues</Link></li>
                  </ul>
                </div>

                <div className="help-category">
                  <h3><span className="icon-wrapper"><User size={18} /></span> Account Help</h3>
                  <ul className="help-links">
                    <li><Link to="/help/login">Login Problems</Link></li>
                    <li><Link to="/help/profile">Profile Settings</Link></li>
                    <li><Link to="/help/billing">Billing & Payments</Link></li>
                    <li><Link to="/help/privacy">Privacy & Security</Link></li>
                  </ul>
                </div>

                <div className="help-category full-width">
                  <h3><span className="icon-wrapper"><LifeBuoy size={18} /></span> Contact Support</h3>
                  <div className="contact-options">
                    <div className="contact-card ai-assistant-card">
                      <h4><span className="icon-wrapper"><Brain size={18} /></span> AI Assistant</h4>
                      <p>Get instant answers to your questions 24/7</p>
                      <Link to="/ai-assistant" className="btn btn-primary">
                        <span className="icon-wrapper"><MessageSquare size={18} /></span> Chat with AI
                      </Link>
                    </div>
                    
                    <div className="contact-card">
                      <h4><span className="icon-wrapper"><MessageSquare size={18} /></span> Live Chat</h4>
                      <p>Chat with our support team</p>
                      <button className="btn btn-primary">Start Chat</button>
                    </div>
                    
                    <div className="contact-card">
                      <h4><span className="icon-wrapper"><MonitorPlay size={18} /></span> Email Support</h4>
                      <p>Get help via email within 24 hours</p>
                      <button className="btn btn-outline">Send Email</button>
                    </div>
                    
                    <div className="contact-card">
                      <h4><span className="icon-wrapper"><Smartphone size={18} /></span> Phone Support</h4>
                      <p>Mon-Fri, 9AM-6PM EST</p>
                      <button className="btn btn-outline">Call Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="community-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join Our Community?</h2>
            <p>Get help, share knowledge, and connect with learners worldwide</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <span className="icon-wrapper"><Rocket size={18} /></span> Get Started Free
              </Link>
              <Link to="/courses" className="btn btn-outline btn-large">
                <span className="icon-wrapper"><BookOpen size={18} /></span> Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunitySupport;
