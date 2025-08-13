import React, { ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, children, onClose, className = '' }) => {
  const alertClasses = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className={`alert ${alertClasses[type]} ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <Icon size={18} className="me-2" />
        <div className="flex-grow-1">{children}</div>
        {onClose && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;