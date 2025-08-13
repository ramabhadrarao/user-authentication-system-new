import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Settings, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/profile');
    window.dispatchEvent(new PopStateEvent('popstate'));
    setDropdownOpen(false);
  };

  return (
    <header className="navbar navbar-expand-md navbar-light d-print-none">
      <div className="container-xl">
        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          Professional Auth System
        </h1>

        <div className="navbar-nav flex-row order-md-last">
          <div className="nav-item d-none d-md-flex me-3">
            <div className="btn-list">
              <button className="btn" title="Notifications">
                <Bell size={18} />
              </button>
            </div>
          </div>

          <div className="nav-item dropdown" ref={dropdownRef}>
            <button 
              className="nav-link d-flex lh-1 text-reset p-0" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ background: 'none', border: 'none' }}
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
              <a 
                href="/profile" 
                className="dropdown-item" 
                onClick={handleProfileClick}
              >
                <Settings size={16} className="me-2" />
                Profile Settings
              </a>
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