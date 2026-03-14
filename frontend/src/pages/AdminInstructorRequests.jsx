import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminInstructorRequests.css';

const AdminInstructorRequests = () => {
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');
      console.log('🔑 Token length:', token?.length);
      
      const response = await axios.get('http://localhost:5000/api/users/pending-instructors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', response.data);
      console.log('✅ Response data length:', response.data.length);
      
      setPendingRequests(response.data);
    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/users/approve-instructor/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Stocker la notification pour l'utilisateur
      if (response.data.notificationTimestamp) {
        localStorage.setItem('lastInstructorNotification', response.data.notificationTimestamp);
      }
      
      setMessage('Instructeur approuvé avec succès!');
      fetchPendingRequests();
      setTimeout(() => setMessage(''), 3000);
      
      // Forcer le rechargement de la page pour mettre à jour le rôle de l'utilisateur
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      setMessage('Erreur lors de l\'approbation');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/users/reject-instructor/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Demande rejetée');
      fetchPendingRequests();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors du rejet');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="admin-requests-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des demandes...</p>
      </div>
    );
  }

  return (
    <div className="admin-instructor-requests">
      <div className="requests-header">
        <h1>Demandes d'instructeur</h1>
        <p>Gérez les demandes pour devenir instructeur</p>
      </div>

      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="requests-stats">
        <div className="stat-card">
          <h3>{pendingRequests.length}</h3>
          <p>Demandes en attente</p>
        </div>
      </div>

      <div className="requests-list">
        {pendingRequests.length === 0 ? (
          <div className="no-requests">
            <h3>🎉</h3>
            <p>Aucune demande en attente</p>
          </div>
        ) : (
          pendingRequests.map(request => {
            console.log('Rendering request:', request);
            console.log('Request instructorName:', request.instructorName);
            return (
            <div key={request._id} className="request-card">
              <div className="request-info">
                <div className="user-avatar">
                  {request.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <h3>{request.name}</h3>
                  <p>{request.email}</p>
                  {request.instructorName && (
                    <p className="instructor-name-display">
                      <strong>Nom d'instructeur:</strong> {request.instructorName}
                    </p>
                  )}
                  <span className="request-date">
                    Demandé le: {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="request-status">
                <span className="status-badge pending">En attente</span>
              </div>
              <div className="request-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(request._id)}
                >
                  ✅ Approuver
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(request._id)}
                >
                  ❌ Rejeter
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminInstructorRequests;
