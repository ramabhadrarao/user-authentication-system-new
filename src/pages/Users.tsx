import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  Users as UsersIcon, 
  UserCheck, 
  Shield, 
  Search,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  approved: boolean;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  isMasterAdmin: boolean;
}

const Users: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    loadUsers();
    loadPermissions();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response.users || []);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await apiService.getPermissionsByModule();
      setPermissions(response.permissions || {});
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await apiService.approveUser(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, approved: true } : user
      ));
      setMessage({ type: 'success', text: 'User approved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to approve user' });
    }
  };

  const handleUpdatePermissions = async (userPermissions: string[]) => {
    if (!selectedUser) return;

    try {
      await apiService.updateUserPermissions(selectedUser._id, userPermissions);
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, permissions: userPermissions } : user
      ));
      setShowPermissionModal(false);
      setSelectedUser(null);
      setMessage({ type: 'success', text: 'Permissions updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update permissions' });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasPermission('user:read')) {
    return (
      <div className="page-body">
        <div className="container-xl">
          <div className="empty">
            <div className="empty-img">
              <Shield size={48} />
            </div>
            <p className="empty-title">Access Denied</p>
            <p className="empty-subtitle text-muted">
              You don't have permission to view users.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">
                  <UsersIcon size={24} className="me-2" />
                  User Management
                </h2>
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

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Users</h3>
            <div className="card-actions">
              <div className="input-icon">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-icon-addon">
                  <Search size={18} />
                </span>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th className="w-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm me-3 bg-secondary text-white">
                          {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </span>
                        <div>
                          <div className="fw-bold">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.username}
                          </div>
                          <div className="text-muted">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div>
                        <span className={`badge ${user.approved ? 'bg-success' : 'bg-warning'}`}>
                          {user.approved ? 'Approved' : 'Pending'}
                        </span>
                        {user.isMasterAdmin && (
                          <span className="badge bg-primary ms-1">Admin</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {user.isMasterAdmin ? 'All' : user.permissions.length}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td>
                      <div className="btn-list">
                        {!user.approved && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApproveUser(user._id)}
                            title="Approve User"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {!user.isMasterAdmin && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowPermissionModal(true);
                            }}
                            title="Manage Permissions"
                          >
                            <Shield size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permission Modal */}
        {showPermissionModal && selectedUser && (
          <PermissionModal
            user={selectedUser}
            permissions={permissions}
            onSave={handleUpdatePermissions}
            onClose={() => {
              setShowPermissionModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

interface PermissionModalProps {
  user: User;
  permissions: any;
  onSave: (permissions: string[]) => void;
  onClose: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  user,
  permissions,
  onSave,
  onClose
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user.permissions || []
  );

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="modal modal-blur show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Manage Permissions - {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.username}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {Object.entries(permissions).map(([module, modulePermissions]: [string, any]) => (
              <div key={module} className="mb-4">
                <h6 className="mb-3">{module}</h6>
                <div className="row">
                  {modulePermissions.map((permission: any) => (
                    <div key={permission.name} className="col-md-6 mb-2">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.name)}
                          onChange={() => handlePermissionToggle(permission.name)}
                        />
                        <span className="form-check-label">
                          <strong>{permission.name}</strong>
                          <div className="text-muted small">{permission.description}</div>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => onSave(selectedPermissions)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;