import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';


const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'instructor') {
    // Special check for instructor role
    if (user.role !== 'instructor') {
      // User is not an instructor
      return <Navigate to="/dashboard" replace />;
    }
    
    // Check if instructor is approved
    if (user.status === 'pending') {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>⏳ En attente de validation</h2>
            <p>Votre demande pour devenir instructeur est en cours de validation par notre équipe.</p>
            <p>Nous vous contacterons dès que votre demande sera traitée.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>
              Retour au tableau de bord
            </button>
          </div>
        </div>
      );
    }
    
    if (user.status === 'rejected') {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h2><span className="icon-wrapper"><X size={18} /></span> Demande rejetée</h2>
            <p>Votre demande pour devenir instructeur n'a pas été approuvée.</p>
            <p>Contactez notre support pour plus d'informations.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>
              Retour au tableau de bord
            </button>
          </div>
        </div>
      );
    }
  }

  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have the required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
