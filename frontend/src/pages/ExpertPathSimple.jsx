import React from 'react';
import { MonitorPlay, Rocket, Target, Trophy, User } from 'lucide-react';


const ExpertPathSimple = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '50px 20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '50px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          Expert <span style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Path</span> to Excellence
        </h1>
        <p style={{
          fontSize: '1.3rem',
          marginBottom: '30px',
          lineHeight: '1.6',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Learn from industry experts and professionals with years of experience in their fields. 
          Transform your career with cutting-edge knowledge and practical skills.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto 50px'
      }}>
        {/* Feature 1 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '20px'
          }}><span className="icon-wrapper"><Target size={18} /></span></div>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>Industry-Relevant Skills</h3>
          <p style={{
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            Learn practical skills that are directly applicable in today's competitive job market.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Explore Courses
          </button>
        </div>

        {/* Feature 2 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '20px'
          }}><span className="icon-wrapper"><MonitorPlay size={18} /></span></div>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>Expert Instructors</h3>
          <p style={{
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            Learn from professionals with real-world experience and proven track records.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Meet Instructors
          </button>
        </div>

        {/* Feature 3 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '20px'
          }}><span className="icon-wrapper"><Trophy size={18} /></span></div>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>Certified Learning</h3>
          <p style={{
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            Earn recognized certificates that validate your expertise and boost your career.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            View Certificates
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>500+</div>
          <div style={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Expert Instructors</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>10,000+</div>
          <div style={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Active Learners</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>95%</div>
          <div style={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Success Rate</div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>50+</div>
          <div style={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Industry Partners</div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        marginTop: '50px'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          color: 'white',
          border: 'none',
          padding: '20px 40px',
          borderRadius: '30px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
          marginRight: '20px'
        }}>
          <span className="icon-wrapper"><Rocket size={18} /></span> Start Learning
        </button>
        <button style={{
          background: 'transparent',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          padding: '20px 40px',
          borderRadius: '30px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <span className="icon-wrapper"><User size={18} /></span> My Dashboard
        </button>
      </div>
    </div>
  );
};

export default ExpertPathSimple;
