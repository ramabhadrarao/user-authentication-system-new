import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Shield, Lock, Eye, Edit, Trash2, Plus } from 'lucide-react';

interface Permission {
  _id: string;
  name: string;
  model: string;
  action: string;
  description: string;
  module: string;
}

const Permissions: React.FC = () => {
  const { hasPermission } = useAuth();
  const [permissions, setPermissions] = useState<{ [key: string]: Permission[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const response = await apiService.getPermissionsByModule();
      setPermissions(response.permissions || {});
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus size={16} className="text-success" />;
      case 'read':
        return <Eye size={16} className="text-info" />;
      case 'update':
        return <Edit size={16} className="text-warning" />;
      case 'delete':
        return <Trash2 size={16} className="text-danger" />;
      default:
        return <Lock size={16} className="text-muted" />;
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-success';
      case 'read':
        return 'bg-info';
      case 'update':
        return 'bg-warning';
      case 'delete':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (!hasPermission('permission:read')) {
    return (
      <div className="page-body">
        <div className="container-xl">
          <div className="empty">
            <div className="empty-img">
              <Shield size={48} />
            </div>
            <p className="empty-title">Access Denied</p>
            <p className="empty-subtitle text-muted">
              You don't have permission to view permissions.
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
                  <Shield size={24} className="me-2" />
                  Permission Management
                </h2>
                <div className="page-subtitle">
                  Manage system permissions and access control
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-deck row-cards">
          {Object.entries(permissions).map(([module, modulePermissions]) => (
            <div key={module} className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Shield size={18} className="me-2" />
                    {module}
                  </h3>
                  <div className="card-actions">
                    <span className="badge bg-primary">
                      {modulePermissions.length} permissions
                    </span>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {modulePermissions.map((permission) => (
                      <div key={permission._id} className="list-group-item">
                        <div className="d-flex align-items-center">
                          <span className="me-3">
                            {getActionIcon(permission.action)}
                          </span>
                          <div className="flex-fill">
                            <div className="fw-bold">{permission.name}</div>
                            <div className="text-muted small">{permission.description}</div>
                          </div>
                          <span className={`badge ${getActionBadgeClass(permission.action)} ms-2`}>
                            {permission.action.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Permission Matrix */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Permission Matrix</h3>
              </div>
              <div className="table-responsive">
                <table className="table card-table table-vcenter">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>Model</th>
                      <th className="text-center">Create</th>
                      <th className="text-center">Read</th>
                      <th className="text-center">Update</th>
                      <th className="text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissions).map(([module, modulePermissions]) => {
                      const models = [...new Set(modulePermissions.map(p => p.model))];
                      return models.map((model) => {
                        const modelPermissions = modulePermissions.filter(p => p.model === model);
                        const hasCreate = modelPermissions.some(p => p.action === 'create');
                        const hasRead = modelPermissions.some(p => p.action === 'read');
                        const hasUpdate = modelPermissions.some(p => p.action === 'update');
                        const hasDelete = modelPermissions.some(p => p.action === 'delete');

                        return (
                          <tr key={`${module}-${model}`}>
                            <td>{module}</td>
                            <td>
                              <span className="badge bg-secondary">{model}</span>
                            </td>
                            <td className="text-center">
                              {hasCreate ? (
                                <span className="badge bg-success">✓</span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td className="text-center">
                              {hasRead ? (
                                <span className="badge bg-info">✓</span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td className="text-center">
                              {hasUpdate ? (
                                <span className="badge bg-warning">✓</span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td className="text-center">
                              {hasDelete ? (
                                <span className="badge bg-danger">✓</span>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Permission Legend */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Permission Legend</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Plus size={16} className="text-success me-2" />
                      <span className="badge bg-success me-2">CREATE</span>
                      <span>Create new records</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Eye size={16} className="text-info me-2" />
                      <span className="badge bg-info me-2">READ</span>
                      <span>View and list records</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Edit size={16} className="text-warning me-2" />
                      <span className="badge bg-warning me-2">UPDATE</span>
                      <span>Modify existing records</span>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Trash2 size={16} className="text-danger me-2" />
                      <span className="badge bg-danger me-2">DELETE</span>
                      <span>Remove records</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;