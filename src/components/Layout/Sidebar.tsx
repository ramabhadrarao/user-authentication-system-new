import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Package, 
  Shield, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  permission?: string;
  masterAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: Home,
    label: 'Dashboard',
    permission: 'dashboard:read'
  },
  {
    href: '/users',
    icon: Users,
    label: 'User Management',
    permission: 'user:read',
    masterAdminOnly: true
  },
  {
    href: '/products',
    icon: Package,
    label: 'Products',
    permission: 'product:read'
  },
  {
    href: '/permissions',
    icon: Shield,
    label: 'Permissions',
    permission: 'permission:read',
    masterAdminOnly: true
  },
  {
    href: '/reports',
    icon: BarChart3,
    label: 'Reports',
    permission: 'dashboard:read'
  }
];

const Sidebar: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = window.location.pathname;

  const isNavItemVisible = (item: NavItem): boolean => {
    if (item.masterAdminOnly && !user?.isMasterAdmin) {
      return false;
    }
    
    if (item.permission) {
      return hasPermission(item.permission);
    }
    
    return true;
  };

  const handleNavClick = (href: string) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setIsOpen(false);
  };

  const visibleItems = navItems.filter(isNavItemVisible);
  console.log('Visible nav items:', visibleItems.length); // Debug

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="navbar-toggler d-lg-none position-fixed"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'fixed',
          top: '1rem', 
          left: '1rem', 
          zIndex: 1001,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          padding: '0.5rem',
          borderRadius: '0.25rem'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`navbar navbar-vertical navbar-expand-lg navbar-dark ${isOpen ? 'show' : ''}`}
        style={{ 
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '15rem',
          background: '#1e293b',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="container-fluid" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Brand */}
          <h1 className="navbar-brand navbar-brand-autodark" style={{ margin: 0, padding: '1.5rem 1rem', textAlign: 'center' }}>
            <a 
              href="/dashboard" 
              style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 600 }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard');
              }}
            >
              Auth System
            </a>
          </h1>

          {/* Navigation */}
          <div className="navbar-collapse" style={{ flex: 1, display: 'block' }}>
            <ul className="navbar-nav" style={{ listStyle: 'none', padding: '0 1rem', margin: 0 }}>
              {visibleItems.map((item) => {
                const isActive = currentPath === item.href;
                const Icon = item.icon;
                
                return (
                  <li className="nav-item" key={item.href} style={{ marginBottom: '0.25rem' }}>
                    <a 
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      href={item.href}
                      style={{
                        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        background: isActive ? '#206bc4' : 'transparent',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                    >
                      <span className="nav-link-icon" style={{ marginRight: '0.75rem', display: 'inline-flex' }}>
                        <Icon size={18} />
                      </span>
                      <span className="nav-link-title">
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="navbar-backdrop d-lg-none"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
        />
      )}
    </>
  );
};

export default Sidebar;