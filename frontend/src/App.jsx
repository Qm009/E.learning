import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import FeaturePage from './pages/FeaturePage';
import Specifications from './pages/Specifications';
import Quiz from './pages/Quiz';
import AdminTest from './pages/AdminTest';
import './App.css';
import './styles/GlobalButtons.css';

function App() {
  console.log('App component rendered');
  
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
            <Route path="/expert-courses" element={<FeaturePage title="Expert Courses" description="Learn from industry experts and professionals with years of experience in their fields." icon="📖" />} />
            <Route path="/certified-degree" element={<CertifiedDegree />} />
            <Route path="/quality-education" element={<FeaturePage title="Quality Education" description="High-quality content with interactive lessons and real-world projects." icon="🏆" />} />
            <Route path="/community-support" element={<FeaturePage title="Community Support" description="Join a vibrant community of learners and get help when you need it." icon="👥" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;