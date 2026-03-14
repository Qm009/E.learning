import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AdminInstructorRequests from './AdminInstructorRequests';
import './Admin.css';

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [message, setMessage] = useState('');

  console.log('AdminDashboard component rendered');
  console.log('User from context:', user);
  console.log('User role:', user?.role);

  useEffect(() => {
    console.log('AdminDashboard useEffect triggered, user:', user);
    if (!user) {
      console.log('No user, still loading or not authenticated');
      return;
    }
    if (user.role !== 'admin') {
      console.log('User role is not admin, user role is:', user.role);
      setLoading(false);
      return;
    }
    console.log('User is admin, fetching data');
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coursesRes = await axios.get('http://localhost:5000/api/courses');

      const allUsers = usersRes.data;
      const students = allUsers.filter(u => u.role === 'student');
      const instructors = allUsers.filter(u => u.role === 'instructor');

      setUsers(allUsers);
      setStats({
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalCourses: coursesRes.data.length,
        totalEnrollments: coursesRes.data.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0),
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setMessage('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', userForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User created successfully!');
      setUserForm({ name: '', email: '', password: '', role: 'student' });
      setShowCreateUser(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User updated successfully!');
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'student' });
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User deleted successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetForm = () => {
    setUserForm({ name: '', email: '', password: '', role: 'student' });
    setEditingUser(null);
    setShowCreateUser(false);
  };

  const filteredUsers = users.filter(u => {
    if (activeTab === 'students') return u.role === 'student';
    if (activeTab === 'instructors') return u.role === 'instructor';
    return true;
  });

  // Check if user is not authenticated
  if (!user) {
    return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="header-content">
            <h1>💂 Admin Dashboard</h1>
            <p>Manage users, courses, and platform statistics</p>
          </div>
        </div>
        <div className="container-lg admin-content">
          <div className="access-denied">
            <h2>🔒 Authentication Required</h2>
            <p>You need to be logged in to access the admin panel.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is not admin
  if (user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="header-content">
            <h1>💂 Admin Dashboard</h1>
            <p>Manage users, courses, and platform statistics</p>
          </div>
        </div>
        <div className="container-lg admin-content">
          <div className="access-denied">
            <h2>⛔ Access Denied</h2>
            <p>You do not have permission to access the admin panel.</p>
            <p className="user-role-info">Your current role: <strong>{user.role}</strong></p>
            <p className="user-role-info">Only administrators can access this panel.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <h1>💂 Admin Dashboard</h1>
          <p>Manage users, courses, and platform statistics</p>
        </div>
      </div>

      <div className="container-lg admin-content">
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="stat-trend">↑ +12% this month</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍🏫</div>
            <h3>{stats.totalInstructors}</h3>
            <p>Active Instructors</p>
            <span className="stat-trend">↑ +3% this month</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
            <span className="stat-trend">🔄 No change</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <h3>{stats.totalEnrollments}</h3>
            <p>Total Enrollments</p>
            <span className="stat-trend">↑ +8% this month</span>
          </div>
        </div>

        {/* User Management */}
        <div className="users-management">
          <div className="management-header">
            <h2>User Management</h2>
            <div className="header-actions">
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                  onClick={() => setActiveTab('students')}
                >
                  Students ({stats.totalStudents})
                </button>
                <button
                  className={`tab-btn ${activeTab === 'instructors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('instructors')}
                >
                  Instructors ({stats.totalInstructors})
                </button>
                <button
                  className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requests')}
                >
                  📋 Instructor Requests
                </button>
                <button
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Users
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateUser(true)}
              >
                + Add User
              </button>
            </div>
          </div>

          {/* Create/Edit User Form */}
          {(showCreateUser || editingUser) && (
            <div className="user-form-modal">
              <div className="form-overlay" onClick={resetForm}></div>
              <div className="form-container">
                <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>
                <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingUser ? 'Update User' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : activeTab === 'requests' ? (
            <AdminInstructorRequests />
          ) : (
            <div className="users-table">
              {filteredUsers.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-info">
                            <span className="user-avatar">{user.name.charAt(0)}</span>
                            {user.name}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No users found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;