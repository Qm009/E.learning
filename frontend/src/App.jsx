import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import ChapterDetail from './pages/ChapterDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourses from './pages/InstructorCourses';
import CertifiedDegree from './pages/CertifiedDegree';
import ExpertPathSimple from './pages/ExpertPathSimple';
import FeaturePage from './pages/FeaturePage';
import Specifications from './pages/Specifications';
import Quiz from './pages/Quiz';
import AdminTest from './pages/AdminTest';
import CommunitySupport from './pages/CommunitySupport';
import Certificate from './pages/Certificate';
import AIAssistant from './pages/AIAssistant';
import UploadCourse from './pages/UploadCourse';
import './App.css';
import './styles/GlobalButtons.css';
import { Trophy } from 'lucide-react';


function App() {
  console.log('App component rendered');
  console.log('Current path:', window.location.hash || window.location.pathname);
  
  // Global button click handler for debugging
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
        console.log(' GLOBAL: Button clicked:', e.target.textContent.trim(), e.target.className);
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:courseId/chapter/:chapterIndex" element={<ChapterDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/instructor" 
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/courses" 
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorCourses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/instructor/upload-course" 
              element={
                <ProtectedRoute requiredRole="instructor">
                  <UploadCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-test" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminTest />
                </ProtectedRoute>
              } 
            />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/specifications" element={<Specifications />} />
            <Route path="/test-expert" element={
              <div style={{
                padding: '50px',
                background: 'green',
                color: 'white',
                textAlign: 'center',
                fontSize: '24px'
              }}>
                TEST ROUTE WORKS!
              </div>
            } />
            <Route path="/expert-courses" element={
              <>
                <div style={{
                  position: 'fixed',
                  top: '50px',
                  right: '10px',
                  background: 'blue',
                  color: 'white',
                  padding: '10px',
                  zIndex: '9999',
                  borderRadius: '5px'
                }}>
                  ROUTE /expert-courses FOUND!
                </div>
                <ExpertPathSimple />
              </>
            } />
            <Route path="/certified-degree" element={<CertifiedDegree />} />
            <Route path="/quality-education" element={<FeaturePage title="Quality Education" description="High-quality content with interactive lessons and real-world projects." icon="<span className="icon-wrapper"><Trophy size={18} /></span>" />} />
            <Route path="/community-support" element={<CommunitySupport />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;