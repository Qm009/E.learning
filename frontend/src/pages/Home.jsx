import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop&auto=format" 
            alt="Education and learning" 
            className="hero-bg-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&h=1080&fit=crop&auto=format";
            }}
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Learn Without <span className="highlight">Limits</span>
            </h1>
            <p className="hero-subtitle">
              Start, switch, or advance your career with more than 5,000 courses, Professional Certificates, and degrees from world-class universities and companies.
            </p>
            <div className="hero-buttons">
              <Link to="/courses" className="btn btn-primary btn-large">
                Start Learning
              </Link>
              <Link to="/certified-degree" className="btn btn-outline btn-large">
                View Certifications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">12,842</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">482</div>
              <div className="stat-label">Expert Instructors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,234</div>
              <div className="stat-label">Total Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose EduPortal?</h2>
            <p>Discover what makes our platform the best choice for your learning journey</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <span>📖</span>
                </div>
              </div>
              <h3>Expert Courses</h3>
              <p>Learn from industry experts and professionals with years of experience in their fields.</p>
              <Link to="/courses" className="feature-link">
                Explore Courses →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <span>🎓</span>
                </div>
              </div>
              <h3>Certified Degrees</h3>
              <p>Earn recognized certificates and degrees upon course completion to boost your career.</p>
              <Link to="/certified-degree" className="feature-link">
                View Programs →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <span>🏆</span>
                </div>
              </div>
              <h3>Quality Education</h3>
              <p>High-quality content with interactive lessons and real-world projects.</p>
              <Link to="/courses" className="feature-link">
                Learn More →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <span>👥</span>
                </div>
              </div>
              <h3>Community Support</h3>
              <p>Join a vibrant community of learners and get help when you need it.</p>
              <Link to="/community-support" className="feature-link">
                Join Community →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses">
        <div className="container">
          <div className="section-header">
            <h2>Popular Courses</h2>
            <p>Discover our most sought-after courses</p>
          </div>
          
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-image">
                <img src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&auto=format" alt="JavaScript" />
                <div className="course-badge">Popular</div>
              </div>
              <div className="course-content">
                <h3>JavaScript Development</h3>
                <p>Master JavaScript from basics to advanced concepts</p>
                <div className="course-meta">
                  <span className="duration">6 weeks</span>
                  <span className="level">Beginner</span>
                  <span className="students">2,341 students</span>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image">
                <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&auto=format" alt="React" />
                <div className="course-badge">Trending</div>
              </div>
              <div className="course-content">
                <h3>React Advanced</h3>
                <p>Build modern web applications with React and Redux</p>
                <div className="course-meta">
                  <span className="duration">8 weeks</span>
                  <span className="level">Intermediate</span>
                  <span className="students">1,892 students</span>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image">
                <img src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&auto=format" alt="Python" />
                <div className="course-badge">New</div>
              </div>
              <div className="course-content">
                <h3>Python for Data Science</h3>
                <p>Learn Python for data analysis and machine learning</p>
                <div className="course-meta">
                  <span className="duration">10 weeks</span>
                  <span className="level">Intermediate</span>
                  <span className="students">1,567 students</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="courses-cta">
            <Link to="/courses" className="btn btn-primary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students achieving their goals with EduPortal</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Free
              </Link>
              <Link to="/courses" className="btn btn-outline btn-large">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;