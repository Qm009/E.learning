import React from 'react';
import { Link } from 'react-router-dom';
import './ExpertPath.css';
import { Book, MonitorPlay, Rocket, Target, Trophy, User } from 'lucide-react';


const ExpertPath = () => {
  console.log('ExpertPath component rendered!');
  return (
    <div className="expert-path">
      {/* TEST VISIBLE - Si vous voyez ceci, le composant fonctionne! */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'red',
        color: 'white',
        padding: '10px',
        zIndex: '9999',
        borderRadius: '5px'
      }}>
        EXPERT PATH COMPONENT LOADED!
      </div>
      
      {/* TEST CSS - Si vous voyez ceci, le CSS fonctionne! */}
      <div className="expert-icon-container" style={{
        position: 'fixed',
        top: '60px',
        right: '10px',
        zIndex: '9999',
        fontSize: '2rem'
      }}>
        🎨 CSS TEST
      </div>
      
      {/* Hero Section */}
      <section className="expert-hero">
        <div className="expert-hero-content">
          <div className="expert-hero-text">
            <h1 className="expert-hero-title">
              Expert <span>Path</span> to Excellence
            </h1>
            <p className="expert-hero-description">
              Learn from industry experts and professionals with years of experience in their fields. 
              Transform your career with cutting-edge knowledge and practical skills.
            </p>
            <div className="expert-hero-cta">
              <Link to="/courses" className="expert-btn expert-btn-primary expert-btn-lg">
                <span><span className="icon-wrapper"><Rocket size={18} /></span></span>
                Start Learning
              </Link>
              <Link to="/dashboard" className="expert-btn expert-btn-outline expert-btn-lg">
                <span><span className="icon-wrapper"><User size={18} /></span></span>
                My Dashboard
              </Link>
            </div>
          </div>
          <div className="expert-hero-visual">
            <div className="expert-showcase">
              <div className="expert-icon-container">
                <span><span className="icon-wrapper"><Book size={18} /></span></span>
              </div>
              <h3>Expert-Led Courses</h3>
              <p>
                Access premium content from top industry professionals and accelerate your learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="expert-features">
        <div className="expert-feature-card">
          <div className="expert-feature-icon"><span className="icon-wrapper"><Target size={18} /></span></div>
          <h3 className="expert-feature-title">Industry-Relevant Skills</h3>
          <p className="expert-feature-description">
            Learn practical skills that are directly applicable in today's competitive job market.
          </p>
          <Link to="/courses" className="expert-btn expert-btn-primary">
            Explore Courses
          </Link>
        </div>

        <div className="expert-feature-card">
          <div className="expert-feature-icon"><span className="icon-wrapper"><MonitorPlay size={18} /></span></div>
          <h3 className="expert-feature-title">Expert Instructors</h3>
          <p className="expert-feature-description">
            Learn from professionals with real-world experience and proven track records.
          </p>
          <Link to="/instructor" className="expert-btn expert-btn-primary">
            Meet Instructors
          </Link>
        </div>

        <div className="expert-feature-card">
          <div className="expert-feature-icon"><span className="icon-wrapper"><Trophy size={18} /></span></div>
          <h3 className="expert-feature-title">Certified Learning</h3>
          <p className="expert-feature-description">
            Earn recognized certificates that validate your expertise and boost your career.
          </p>
          <Link to="/certified-degree" className="expert-btn expert-btn-primary">
            View Certificates
          </Link>
        </div>

        <div className="expert-feature-card">
          <div className="expert-feature-icon">💼</div>
          <h3 className="expert-feature-title">Career Advancement</h3>
          <p className="expert-feature-description">
            Get job-ready skills and career guidance from industry experts.
          </p>
          <Link to="/dashboard" className="expert-btn expert-btn-primary">
            Track Progress
          </Link>
        </div>

        <div className="expert-feature-card">
          <div className="expert-feature-icon">🤝</div>
          <h3 className="expert-feature-title">Community Support</h3>
          <p className="expert-feature-description">
            Join a thriving community of learners and professionals.
          </p>
          <Link to="/community-support" className="expert-btn expert-btn-primary">
            Join Community
          </Link>
        </div>

        <div className="expert-feature-card">
          <div className="expert-feature-icon">🤖</div>
          <h3 className="expert-feature-title">AI-Powered Learning</h3>
          <p className="expert-feature-description">
            Get personalized learning paths with advanced AI assistance.
          </p>
          <Link to="/ai-assistant" className="expert-btn expert-btn-primary">
            Try AI Assistant
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="expert-stats">
        <div className="expert-stat-card">
          <div className="expert-stat-number">500+</div>
          <div className="expert-stat-label">Expert Instructors</div>
        </div>

        <div className="expert-stat-card">
          <div className="expert-stat-number">10,000+</div>
          <div className="expert-stat-label">Active Learners</div>
        </div>

        <div className="expert-stat-card">
          <div className="expert-stat-number">95%</div>
          <div className="expert-stat-label">Success Rate</div>
        </div>

        <div className="expert-stat-card">
          <div className="expert-stat-number">50+</div>
          <div className="expert-stat-label">Industry Partners</div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="expert-testimonials">
        <h2>
          What Our <span>Experts</span> Say
        </h2>

        <div className="expert-testimonial-grid">
          <div className="expert-testimonial-card">
            <p className="expert-testimonial-content">
              "The expert path program transformed my career. The practical skills and industry insights I gained were invaluable."
            </p>
            <div className="expert-testimonial-author">
              <div className="expert-testimonial-avatar">JD</div>
              <div className="expert-testimonial-info">
                <h4>John Doe</h4>
                <p>Senior Developer</p>
              </div>
            </div>
          </div>

          <div className="expert-testimonial-card">
            <p className="expert-testimonial-content">
              "Learning from industry experts gave me confidence and skills to advance in my career."
            </p>
            <div className="expert-testimonial-author">
              <div className="expert-testimonial-avatar">SM</div>
              <div className="expert-testimonial-info">
                <h4>Sarah Miller</h4>
                <p>Product Manager</p>
              </div>
            </div>
          </div>

          <div className="expert-testimonial-card">
            <p className="expert-testimonial-content">
              "The expert-led courses provided exactly what I needed to transition into a new role."
            </p>
            <div className="expert-testimonial-author">
              <div className="expert-testimonial-avatar">MJ</div>
              <div className="expert-testimonial-info">
                <h4>Michael Johnson</h4>
                <p>Data Scientist</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertPath;
