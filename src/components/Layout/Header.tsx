import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { Link } from './Link';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="navbar navbar-expand-md d-print-none">
      <div className="container-xl">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          <Link href="/dashboard" className="text-decoration-none">
            Professional Auth System
          </Link>
        </h1>

        <div className="navbar-nav flex-row order-md-last">
          <div className="nav-item d-none d-md-flex me-3">
            <div className="btn-list">
              <button className="btn" title="Notifications">
                <Bell size={18} />
                <span className="badge bg-red"></span>
              </button>
            </div>
          </div>

          <div className="nav-item dropdown">
            <button 
              className="nav-link d-flex lh-1 text-reset p-0" 
              data-bs-toggle="dropdown" 
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span 
                className="avatar avatar-sm" 
                style={{ 
                  backgroundImage: user?.profilePhotoUrl 
                    ? `url(http://localhost:5000${user.profilePhotoUrl})` 
                    : undefined 
                }}
              >
                {!user?.profilePhotoUrl && (
                  <User size={20} />
                )}
              </span>
              <div className="d-none d-xl-block ps-2">
                <div>{user?.displayName || user?.username}</div>
                <div className="mt-1 small text-muted">
                  {user?.isMasterAdmin ? 'Master Admin' : 'User'}
                </div>
              </div>
            </button>
            
            <div className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${dropdownOpen ? 'show' : ''}`}>
              <Link href="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <Settings size={16} className="me-2" />
                Profile Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <LogOut size={16} className="me-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;