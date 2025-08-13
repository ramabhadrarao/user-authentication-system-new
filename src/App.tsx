import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Products from './pages/Products';
import Permissions from './pages/Permissions';
import Reports from './pages/Reports';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  requireAuth?: boolean;
  permission?: string;
}

const routes: RouteConfig[] = [
  { path: '/', component: Dashboard, requireAuth: true, permission: 'dashboard:read' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/dashboard', component: Dashboard, requireAuth: true, permission: 'dashboard:read' },
  { path: '/profile', component: Profile, requireAuth: true },
  { path: '/users', component: Users, requireAuth: true, permission: 'user:read' },
  { path: '/products', component: Products, requireAuth: true, permission: 'product:read' },
  { path: '/permissions', component: Permissions, requireAuth: true, permission: 'permission:read' },
  { path: '/reports', component: Reports, requireAuth: true, permission: 'dashboard:read' }
];

const Router: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Find matching route
  const matchRoute = (path: string) => {
    // Handle parameterized routes like /reset-password/:token
    for (const route of routes) {
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      
      if (routeParts.length !== pathParts.length) continue;
      
      let matches = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) continue; // Parameter match
        if (routeParts[i] !== pathParts[i]) {
          matches = false;
          break;
        }
      }
      
      if (matches) return route;
    }
    
    return routes.find(route => route.path === path);
  };

  const currentRoute = matchRoute(currentPath) || routes.find(r => r.path === '/dashboard');

  if (!currentRoute) {
    return <div className="text-center mt-5">Page not found</div>;
  }

  // Handle authentication and permissions
  if (currentRoute.requireAuth && !user) {
    if (currentPath !== '/login') {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    return <currentRoute.component />;
  }

  if (user && (currentPath === '/login' || currentPath === '/register')) {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return <Dashboard />;
  }

  if (currentRoute.permission && !hasPermission(currentRoute.permission)) {
    return (
      <Layout>
        <div className="empty">
          <div className="empty-img">
            <img src="/placeholder-unauthorized.svg" height="128" alt="" />
          </div>
          <p className="empty-title">Access Denied</p>
          <p className="empty-subtitle text-muted">
            You don't have permission to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  const CurrentComponent = currentRoute.component;

  return (
    <Layout>
      <CurrentComponent />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;