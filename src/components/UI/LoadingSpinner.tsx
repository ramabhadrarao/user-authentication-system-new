import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {text && <div className="mt-3 text-muted">{text}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;