import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../api';
import './Auth.css';
import { Check, FileText, Rocket, Target, X } from 'lucide-react';


const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', requestedRole: 'student', instructorName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier s'il y a un paramètre de programme dans l'URL
    const urlParams = new URLSearchParams(location.search);
    const programParam = urlParams.get('program');
    
    if (programParam) {
      setSelectedProgram(decodeURIComponent(programParam));
      console.log(`<span className="icon-wrapper"><Target size={18} /></span> User interested in program: ${programParam}`);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('<span className="icon-wrapper"><Rocket size={18} /></span> Create Account button clicked!');
    console.log('<span className="icon-wrapper"><FileText size={18} /></span> Form data:', formData);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      console.log('<span className="icon-wrapper"><Check size={18} /></span> Registration successful:', res.data);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('<span className="icon-wrapper"><X size={18} /></span> Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join thousands of learners on EduPortal</p>
          {selectedProgram && (
            <div className="selected-program-notice">
              <strong><span className="icon-wrapper"><Target size={18} /></span> Programme sélectionné:</strong> {selectedProgram}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="requestedRole">Account Type</label>
            <select name="requestedRole" id="requestedRole" value={formData.requestedRole} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="instructor">Request to become Instructor</option>
            </select>
            {formData.requestedRole === 'instructor' && (
              <small className="form-help-text">
                Your request will be reviewed by an administrator before approval.
              </small>
            )}
          </div>

          {formData.requestedRole === 'instructor' && (
            <div className="form-group">
              <label htmlFor="instructorName">Nom d'instructeur requis *</label>
              <input
                type="text"
                id="instructorName"
                name="instructorName"
                placeholder="Entrez votre nom d'instructeur (ex: CIDO)"
                value={formData.instructorName}
                onChange={handleChange}
                required={formData.requestedRole === 'instructor'}
              />
              <small className="form-help-text">
                Ce nom sera affiché aux administrateurs pour approbation.
              </small>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;