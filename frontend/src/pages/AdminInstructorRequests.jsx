import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../api';
import './AdminInstructorRequests.css';
import { Check, X } from 'lucide-react';


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
      
      const response = await axios.get(`${API_BASE_URL}/api/users/pending-instructors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('<span className="icon-wrapper"><Check size={18} /></span> Response status:', response.status);
      console.log('<span className="icon-wrapper"><Check size={18} /></span> Response data:', response.data);
      console.log('<span className="icon-wrapper"><Check size={18} /></span> Response data length:', response.data.length);
      
      setPendingRequests(response.data);
    } catch (error) {
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error fetching pending requests:', error);
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error response:', error.response?.data);
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Approving instructor with ID:', requestId);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      // Essayer avec l'URL originale et PUT
      const response = await axios.put(`${API_BASE_URL}/api/users/${requestId}`, {
        status: 'approved',
        role: 'instructor'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('<span className="icon-wrapper"><Check size={18} /></span> Approval response:', response.data);
      setMessage('<span className="icon-wrapper"><Check size={18} /></span> Instructeur approuvé avec succès!');
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error approving instructor:', error);
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error response:', error.response?.data);
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error status:', error.response?.status);
      setMessage(`<span className="icon-wrapper"><X size={18} /></span> Erreur: ${error.response?.data?.message || 'Erreur lors de l\'approbation de l\'instructeur'}`);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Rejecting instructor with ID:', requestId);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      // Essayer avec l'URL originale et PUT
      const response = await axios.put(`${API_BASE_URL}/api/users/${requestId}`, {
        status: 'rejected'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('<span className="icon-wrapper"><Check size={18} /></span> Rejection response:', response.data);
      setMessage('<span className="icon-wrapper"><Check size={18} /></span> Demande d\'instructeur rejetée avec succès!');
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error rejecting instructor:', error);
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error response:', error.response?.data);
      console.error('<span className="icon-wrapper"><X size={18} /></span> Error status:', error.response?.status);
      setMessage(`<span className="icon-wrapper"><X size={18} /></span> Erreur: ${error.response?.data?.message || 'Erreur lors du rejet de la demande d\'instructeur'}`);
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
                <div className="request-actions">
                  <button 
                    onClick={() => handleApprove(request._id)}
                    className="btn btn-sm btn-success"
                    title="Approuver la demande"
                  >
                    <span className="icon-wrapper"><Check size={18} /></span> Approuver
                  </button>
                  <button 
                    onClick={() => handleReject(request._id)}
                    className="btn btn-sm btn-danger"
                    title="Rejeter la demande"
                  >
                    <span className="icon-wrapper"><X size={18} /></span> Rejeter
                  </button>
                </div>
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
