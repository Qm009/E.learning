import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Check, X } from 'lucide-react';


const AdminTest = () => {
  const { user } = useContext(AuthContext);

  console.log('AdminTest component - User:', user);
  console.log('AdminTest component - User role:', user?.role);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🧪 Admin Test Page</h1>
      
      {user ? (
        <div>
          <h2><span className="icon-wrapper"><Check size={18} /></span> User is authenticated</h2>
          <p><strong>Name:</strong> {user.name || 'Unknown'}</p>
          <p><strong>Email:</strong> {user.email || 'Unknown'}</p>
          <p><strong>Role:</strong> {user.role || 'Unknown'}</p>
          <p><strong>ID:</strong> {user.id || 'Unknown'}</p>
        </div>
      ) : (
        <div>
          <h2><span className="icon-wrapper"><X size={18} /></span> No user found</h2>
          <p>Please login first</p>
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/admin" style={{ 
          padding: '1rem 2rem', 
          background: '#007bff', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Go to Admin Dashboard
        </a>
      </div>
    </div>
  );
};

export default AdminTest;
