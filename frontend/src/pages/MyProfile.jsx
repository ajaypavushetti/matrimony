import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiLock, FiEdit2, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useToast } from '../components/Toast';

function MyProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await API.put('/api/auth/me', formData);
      updateUser(res.data.user || formData);
      showSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="page-container-narrow">
      <div className="my-profile-header">
        <div className="my-profile-avatar">
          {getInitials(user?.name)}
        </div>
        <div className="my-profile-name">{user?.name || 'User'}</div>
        <div className="my-profile-email">{user?.email || ''}</div>
      </div>

      {editing ? (
        <div className="card mb-3">
          <h3 className="mb-3">Edit Profile</h3>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your location"
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="settings-list">
          <button className="settings-item" onClick={() => setEditing(true)}>
            <FiEdit2 />
            <span>Edit Profile</span>
            <FiChevronRight className="arrow" />
          </button>

          <Link to="/change-password" className="settings-item">
            <FiLock />
            <span>Change Password</span>
            <FiChevronRight className="arrow" />
          </Link>

          <div className="settings-item" style={{ cursor: 'default' }}>
            <FiUser />
            <div>
              <div style={{ fontWeight: 500 }}>Phone</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                {user?.phone || 'Not set'}
              </div>
            </div>
          </div>

          <button className="settings-item danger" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
            <FiChevronRight className="arrow" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
