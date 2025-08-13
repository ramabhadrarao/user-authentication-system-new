import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  Users, 
  Package, 
  Shield, 
  Activity,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
  pendingApprovals: number;
}

const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    activeUsers: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const promises = [];
      
      if (hasPermission('user:read')) {
        promises.push(apiService.getUsers());
      }
      
      if (hasPermission('product:read')) {
        promises.push(apiService.getProducts());
      }

      const results = await Promise.allSettled(promises);
      
      let userCount = 0;
      let productCount = 0;
      let activeCount = 0;
      let pendingCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (index === 0 && hasPermission('user:read')) {
            // Users data
            const users = result.value.users || [];
            userCount = users.length;
            activeCount = users.filter((u: any) => u.approved).length;
            pendingCount = users.filter((u: any) => !u.approved).length;
          } else if ((index === 1 && hasPermission('user:read')) || (index === 0 && !hasPermission('user:read'))) {
            // Products data
            const products = result.value.products || [];
            productCount = products.length;
          }
        }
      });

      setStats({
        totalUsers: userCount,
        totalProducts: productCount,
        activeUsers: activeCount,
        pendingApprovals: pendingCount
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        {/* Welcome Section */}
        <div className="row row-deck row-cards mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <h2 className="page-title">
                      Welcome back, {user?.displayName || user?.username}!
                    </h2>
                    <p className="text-muted">
                      Here's what's happening with your system today.
                    </p>
                  </div>
                  <div className="col-auto">
                    <div className="avatar avatar-xl">
                      {user?.profilePhotoUrl ? (
                        <img 
                          src={`http://localhost:5000${user.profilePhotoUrl}`} 
                          alt="Profile"
                          className="avatar-img"
                        />
                      ) : (
                        <div className="avatar-initials bg-primary text-white">
                          {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row row-deck row-cards">
          {hasPermission('user:read') && (
            <>
              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Total Users</div>
                      <div className="ms-auto lh-1">
                        <Users className="text-primary" size={24} />
                      </div>
                    </div>
                    <div className="h1 mb-3">{stats.totalUsers}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: '75%' }}
                            role="progressbar"
                          ></div>
                        </div>
                      </div>
                      <div className="ms-3">
                        <small className="text-muted">75%</small>
                      </div>
                    </div>
                    <div className="text-muted">
                      <span className="text-primary d-inline-flex align-items-center lh-1">
                        12% <TrendingUp size={16} className="ms-1" />
                      </span>
                      increase from last month
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Active Users</div>
                      <div className="ms-auto lh-1">
                        <Activity className="text-success" size={24} />
                      </div>
                    </div>
                    <div className="h1 mb-3">{stats.activeUsers}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                            role="progressbar"
                          ></div>
                        </div>
                      </div>
                      <div className="ms-3">
                        <small className="text-muted">
                          {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                        </small>
                      </div>
                    </div>
                    <div className="text-muted">Approved and active</div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Pending Approvals</div>
                      <div className="ms-auto lh-1">
                        <Shield className="text-warning" size={24} />
                      </div>
                    </div>
                    <div className="h1 mb-3">{stats.pendingApprovals}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div 
                            className="progress-bar bg-warning" 
                            style={{ width: stats.pendingApprovals > 0 ? '60%' : '0%' }}
                            role="progressbar"
                          ></div>
                        </div>
                      </div>
                      <div className="ms-3">
                        <small className="text-muted">60%</small>
                      </div>
                    </div>
                    <div className="text-muted">Awaiting review</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {hasPermission('product:read') && (
            <div className="col-sm-6 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Total Products</div>
                    <div className="ms-auto lh-1">
                      <Package className="text-info" size={24} />
                    </div>
                  </div>
                  <div className="h1 mb-3">{stats.totalProducts}</div>
                  <div className="d-flex mb-2">
                    <div className="flex-fill">
                      <div className="progress progress-xs">
                        <div 
                          className="progress-bar bg-info" 
                          style={{ width: '85%' }}
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                    <div className="ms-3">
                      <small className="text-muted">85%</small>
                    </div>
                  </div>
                  <div className="text-muted">
                    <span className="text-success d-inline-flex align-items-center lh-1">
                      8% <TrendingUp size={16} className="ms-1" />
                    </span>
                    increase from last week
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="row row-deck row-cards mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  {hasPermission('user:read') && (
                    <div className="col-md-4">
                      <div className="d-flex align-items-center mb-3">
                        <Users className="me-3 text-primary" size={24} />
                        <div>
                          <div className="font-weight-medium">Manage Users</div>
                          <div className="small text-muted">View and manage user accounts</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {hasPermission('product:read') && (
                    <div className="col-md-4">
                      <div className="d-flex align-items-center mb-3">
                        <Package className="me-3 text-info" size={24} />
                        <div>
                          <div className="font-weight-medium">Manage Products</div>
                          <div className="small text-muted">Add and edit product catalog</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {hasPermission('permission:read') && (
                    <div className="col-md-4">
                      <div className="d-flex align-items-center mb-3">
                        <Shield className="me-3 text-success" size={24} />
                        <div>
                          <div className="font-weight-medium">Permissions</div>
                          <div className="small text-muted">Configure user permissions</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="row row-deck row-cards mt-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">System Status</h3>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-fill">Database Connection</div>
                  <div className="text-success">●</div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-fill">API Server</div>
                  <div className="text-success">●</div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-fill">Email Service</div>
                  <div className="text-warning">●</div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="flex-fill">File Upload</div>
                  <div className="text-success">●</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar avatar-xs me-3 bg-primary text-white">U</div>
                  <div className="flex-fill">
                    <div className="small">New user registered</div>
                    <div className="text-muted small">2 minutes ago</div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar avatar-xs me-3 bg-success text-white">P</div>
                  <div className="flex-fill">
                    <div className="small">Product updated</div>
                    <div className="text-muted small">15 minutes ago</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-xs me-3 bg-warning text-white">S</div>
                  <div className="flex-fill">
                    <div className="small">System backup completed</div>
                    <div className="text-muted small">1 hour ago</div>
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

export default Dashboard;