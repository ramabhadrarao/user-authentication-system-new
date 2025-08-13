import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import LoadingSpinner from '../UI/LoadingSpinner';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="page">
      <Sidebar />
      <div className="page-wrapper">
        <Header />
        <div className="page-body">
          <div className="container-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;