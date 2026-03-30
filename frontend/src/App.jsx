import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './index.css';
import './styles/GlobalButtons.css';
import { Trophy } from 'lucide-react';

// Lazy loading components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const ChapterDetail = lazy(() => import('./pages/ChapterDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const InstructorCourses = lazy(() => import('./pages/InstructorCourses'));
const CertifiedDegree = lazy(() => import('./pages/CertifiedDegree'));
const ExpertPathSimple = lazy(() => import('./pages/ExpertPathSimple'));
const FeaturePage = lazy(() => import('./pages/FeaturePage'));
const Specifications = lazy(() => import('./pages/Specifications'));
const Quiz = lazy(() => import('./pages/Quiz'));
const AdminTest = lazy(() => import('./pages/AdminTest'));
const CommunitySupport = lazy(() => import('./pages/CommunitySupport'));
const Certificate = lazy(() => import('./pages/Certificate'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const UploadCourse = lazy(() => import('./pages/UploadCourse'));

// Simple loading fallback
const Loader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    background: '#f8fafc' 
  }}>
    <div className="spinner"></div>
  </div>
);

function App() {
  useEffect(() => {
    console.log('E-Learning App Optimized Init');
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/courses/:courseId/chapter/:chapterIndex" element={<ChapterDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Role Protected Routes */}
              <Route path="/instructor" element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/instructor/courses" element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorCourses />
                </ProtectedRoute>
              } />
              <Route path="/instructor/upload-course" element={
                <ProtectedRoute requiredRole="instructor">
                  <UploadCourse />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/specifications" element={<Specifications />} />
              <Route path="/expert-courses" element={<ExpertPathSimple />} />
              <Route path="/certified-degree" element={<CertifiedDegree />} />
              <Route path="/quality-education" element={<FeaturePage title="Quality Education" description="High-quality content with interactive lessons and real-world projects." icon={<Trophy size={18} />} />} />
              <Route path="/community-support" element={<CommunitySupport />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;