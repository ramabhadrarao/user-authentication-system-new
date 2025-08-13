import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { User, Mail, Lock, Camera, Save, Key } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.updateProfile(profileData);
      updateUser(response.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Profile update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await apiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Password change failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await apiService.uploadProfilePhoto(file);
      updateUser({ profilePhotoUrl: response.profilePhotoUrl });
      setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Photo upload failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Profile Settings</h2>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <Alert 
            type={message.type as 'success' | 'error'} 
            onClose={() => setMessage({ type: '', text: '' })} 
            className="mb-3"
          >
            {message.text}
          </Alert>
        )}

        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar avatar-xl mb-3 position-relative">
                  {user.profilePhotoUrl ? (
                    <img 
                      src={`http://localhost:5000${user.profilePhotoUrl}`} 
                      alt="Profile"
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-initials bg-primary text-white">
                      {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  
                  <label 
                    htmlFor="photo-upload" 
                    className="position-absolute bottom-0 end-0 btn btn-sm btn-primary rounded-circle"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <Camera size={16} />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                
                <h3 className="m-0">{user.displayName}</h3>
                <div className="text-muted">{user.email}</div>
                
                {user.isMasterAdmin && (
                  <div className="mt-3">
                    <span className="badge bg-primary">Master Admin</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card mt-3">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={16} className="me-2" />
                  Profile Information
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <Key size={16} className="me-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card">
              <div className="card-body">
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <div className="input-icon">
                            <input
                              type="text"
                              className="form-control"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleProfileChange}
                              placeholder="Your first name"
                            />
                            <span className="input-icon-addon">
                              <User size={18} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <div className="input-icon">
                            <input
                              type="text"
                              className="form-control"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              placeholder="Your last name"
                            />
                            <span className="input-icon-addon">
                              <User size={18} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <div className="input-icon">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                        />
                        <span className="input-icon-addon">
                          <Mail size={18} />
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.username}
                        disabled
                      />
                      <div className="form-hint">Username cannot be changed</div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Account Status</label>
                      <div>
                        <span className={`badge ${user.approved ? 'bg-success' : 'bg-warning'}`}>
                          {user.approved ? 'Approved' : 'Pending Approval'}
                        </span>
                        {user.isMasterAdmin && (
                          <span className="badge bg-primary ms-2">Master Admin</span>
                        )}
                      </div>
                    </div>

                    <div className="form-footer">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        <Save size={16} className="me-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <div className="input-icon">
                        <input
                          type="password"
                          className="form-control"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <span className="input-icon-addon">
                          <Lock size={18} />
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <div className="input-icon">
                        <input
                          type="password"
                          className="form-control"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          minLength={6}
                          required
                        />
                        <span className="input-icon-addon">
                          <Lock size={18} />
                        </span>
                      </div>
                      <div className="form-hint">Password must be at least 6 characters long</div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <div className="input-icon">
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <span className="input-icon-addon">
                          <Lock size={18} />
                        </span>
                      </div>
                    </div>

                    <div className="form-footer">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        <Key size={16} className="me-2" />
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;