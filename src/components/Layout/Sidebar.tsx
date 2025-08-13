import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from './Link';
import { 
  Home, 
  Users, 
  Package, 
  Shield, 
  Settings,
  BarChart3
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

  const isNavItemVisible = (item: NavItem): boolean => {
    if (item.masterAdminOnly && !user?.isMasterAdmin) {
      return false;
    }
    
    if (item.permission) {
      return hasPermission(item.permission);
    }
    
    return true;
  };

  return (
    <aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <h1 className="navbar-brand navbar-brand-autodark">
          <Link href="/dashboard" className="text-decoration-none text-white">
            Auth System
          </Link>
        </h1>

        <div className="collapse navbar-collapse" id="sidebar-menu">
          <ul className="navbar-nav pt-lg-3">
            {navItems.filter(isNavItemVisible).map((item) => (
              <li className="nav-item" key={item.href}>
                <Link href={item.href} className="nav-link">
                  <span className="nav-link-icon d-md-none d-lg-inline-block">
                    <item.icon size={18} />
                  </span>
                  <span className="nav-link-title">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;