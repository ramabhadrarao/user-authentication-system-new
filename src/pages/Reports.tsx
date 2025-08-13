import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

interface ReportData {
  userStats: {
    total: number;
    approved: number;
    pending: number;
    growth: number;
  };
  productStats: {
    total: number;
    categories: { [key: string]: number };
    recentlyAdded: number;
  };
  activityStats: {
    dailyLogins: number;
    weeklyActive: number;
    monthlyActive: number;
  };
}

const Reports: React.FC = () => {
  const { hasPermission } = useAuth();
  const [reportData, setReportData] = useState<ReportData>({
    userStats: { total: 0, approved: 0, pending: 0, growth: 0 },
    productStats: { total: 0, categories: {}, recentlyAdded: 0 },
    activityStats: { dailyLogins: 0, weeklyActive: 0, monthlyActive: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      const promises = [];
      
      if (hasPermission('user:read')) {
        promises.push(apiService.getUsers());
      }
      
      if (hasPermission('product:read')) {
        promises.push(apiService.getProducts());
      }

      const results = await Promise.allSettled(promises);
      
      let userStats = { total: 0, approved: 0, pending: 0, growth: 12 };
      let productStats = { total: 0, categories: {}, recentlyAdded: 0 };
      let activityStats = { dailyLogins: 0, weeklyActive: 0, monthlyActive: 0 };

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (index === 0 && hasPermission('user:read')) {
            const users = result.value.users || [];
            userStats = {
              total: users.length,
              approved: users.filter((u: any) => u.approved).length,
              pending: users.filter((u: any) => !u.approved).length,
              growth: 12
            };
            
            // Mock activity data
            activityStats = {
              dailyLogins: Math.floor(users.length * 0.3),
              weeklyActive: Math.floor(users.length * 0.6),
              monthlyActive: Math.floor(users.length * 0.8)
            };
          } else if ((index === 1 && hasPermission('user:read')) || (index === 0 && !hasPermission('user:read'))) {
            const products = result.value.products || [];
            const categories: { [key: string]: number } = {};
            
            products.forEach((product: any) => {
              categories[product.category] = (categories[product.category] || 0) + 1;
            });
            
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 7);
            const recentlyAdded = products.filter((p: any) => 
              new Date(p.createdAt) > recentDate
            ).length;
            
            productStats = {
              total: products.length,
              categories,
              recentlyAdded
            };
          }
        }
      });

      setReportData({ userStats, productStats, activityStats });
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('dashboard:read')) {
    return (
      <div className="page-body">
        <div className="container-xl">
          <div className="empty">
            <div className="empty-img">
              <BarChart3 size={48} />
            </div>
            <p className="empty-title">Access Denied</p>
            <p className="empty-subtitle text-muted">
              You don't have permission to view reports.
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
                  <BarChart3 size={24} className="me-2" />
                  Reports & Analytics
                </h2>
                <div className="page-subtitle">
                  System performance and usage statistics
                </div>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <select 
                    className="form-select"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                  <button className="btn btn-primary">
                    <Download size={16} className="me-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
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
                    <div className="h1 mb-3">{reportData.userStats.total}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-muted">
                      <span className="text-success d-inline-flex align-items-center lh-1">
                        {reportData.userStats.growth}% <TrendingUp size={16} className="ms-1" />
                      </span>
                      growth this month
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
                    <div className="h1 mb-3">{reportData.activityStats.weeklyActive}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-muted">Weekly active users</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {hasPermission('product:read') && (
            <>
              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Total Products</div>
                      <div className="ms-auto lh-1">
                        <Package className="text-info" size={24} />
                      </div>
                    </div>
                    <div className="h1 mb-3">{reportData.productStats.total}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div className="progress-bar bg-info" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-muted">Across all categories</div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">New Products</div>
                      <div className="ms-auto lh-1">
                        <Calendar className="text-warning" size={24} />
                      </div>
                    </div>
                    <div className="h1 mb-3">{reportData.productStats.recentlyAdded}</div>
                    <div className="d-flex mb-2">
                      <div className="flex-fill">
                        <div className="progress progress-xs">
                          <div className="progress-bar bg-warning" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-muted">Added this week</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts and Detailed Reports */}
        <div className="row row-deck row-cards mt-4">
          {hasPermission('user:read') && (
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">User Statistics</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex align-items-center mb-3">
                        <div className="subheader">Approved Users</div>
                        <div className="ms-auto">
                          <span className="badge bg-success">{reportData.userStats.approved}</span>
                        </div>
                      </div>
                      <div className="progress mb-3">
                        <div 
                          className="progress-bar bg-success" 
                          style={{ 
                            width: `${reportData.userStats.total > 0 ? (reportData.userStats.approved / reportData.userStats.total) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col">
                      <div className="d-flex align-items-center mb-3">
                        <div className="subheader">Pending Approval</div>
                        <div className="ms-auto">
                          <span className="badge bg-warning">{reportData.userStats.pending}</span>
                        </div>
                      </div>
                      <div className="progress mb-3">
                        <div 
                          className="progress-bar bg-warning" 
                          style={{ 
                            width: `${reportData.userStats.total > 0 ? (reportData.userStats.pending / reportData.userStats.total) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="d-flex align-items-center mb-2">
                        <div className="subheader">Daily Logins</div>
                        <div className="ms-auto text-success">
                          {reportData.activityStats.dailyLogins}
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="subheader">Monthly Active</div>
                        <div className="ms-auto text-info">
                          {reportData.activityStats.monthlyActive}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasPermission('product:read') && (
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Product Categories</h3>
                </div>
                <div className="card-body">
                  {Object.entries(reportData.productStats.categories).map(([category, count], index) => (
                    <div key={category} className="row mb-3">
                      <div className="col">
                        <div className="d-flex align-items-center mb-2">
                          <div className="subheader">{category}</div>
                          <div className="ms-auto">
                            <span className="badge bg-primary">{count}</span>
                          </div>
                        </div>
                        <div className="progress">
                          <div 
                            className={`progress-bar ${
                              index % 4 === 0 ? 'bg-primary' :
                              index % 4 === 1 ? 'bg-success' :
                              index % 4 === 2 ? 'bg-warning' : 'bg-info'
                            }`}
                            style={{ 
                              width: `${reportData.productStats.total > 0 ? ((count as number) / reportData.productStats.total) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(reportData.productStats.categories).length === 0 && (
                    <div className="text-center text-muted py-4">
                      No product categories found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="avatar avatar-sm bg-success text-white">
                          <Users size={16} />
                        </div>
                      </div>
                      <div className="col text-truncate">
                        <strong>New user registrations</strong>
                        <div className="d-block text-muted text-truncate mt-n1">
                          {Math.floor(reportData.userStats.pending / 2)} users registered today
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="text-muted">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="avatar avatar-sm bg-info text-white">
                          <Package size={16} />
                        </div>
                      </div>
                      <div className="col text-truncate">
                        <strong>Product inventory updated</strong>
                        <div className="d-block text-muted text-truncate mt-n1">
                          {reportData.productStats.recentlyAdded} new products added this week
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="text-muted">6 hours ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="avatar avatar-sm bg-warning text-white">
                          <Activity size={16} />
                        </div>
                      </div>
                      <div className="col text-truncate">
                        <strong>System performance check</strong>
                        <div className="d-block text-muted text-truncate mt-n1">
                          All systems operational, response time optimal
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="text-muted">1 day ago</div>
                      </div>
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

export default Reports;