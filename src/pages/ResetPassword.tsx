import React, { useState, useEffect } from 'react';
import { Link } from '../components/Layout/Link';
import { apiService } from '../services/api';
import Alert from '../components/UI/Alert';
import { Lock, CheckCircle } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extract token from URL
    const path = window.location.pathname;
    const tokenFromUrl = path.split('/reset-password/')[1];
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      await apiService.resetPassword(token, formData.password);
      setSuccess(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Password reset failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="card card-md">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="avatar avatar-xl bg-danger text-white">
                  <Lock size={32} />
                </div>
              </div>
              <h2 className="h3 mb-3">Invalid Reset Link</h2>
              <p className="text-muted mb-4">
                This password reset link is invalid or has expired. 
                Please request a new one.
              </p>
              <Link href="/forgot-password" className="btn btn-primary">
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="card card-md">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="avatar avatar-xl bg-success text-white">
                  <CheckCircle size={32} />
                </div>
              </div>
              <h2 className="h3 mb-3">Password Reset Successful!</h2>
              <p className="text-muted mb-4">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link href="/login" className="btn btn-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <h1 className="h2 text-primary">Professional Auth System</h1>
        </div>
        
        <div className="card card-md">
          <div className="card-body">
            <h2 className="h2 text-center mb-4">Reset your password</h2>
            
            <p className="text-muted text-center mb-4">
              Enter your new password below.
            </p>
            
            {message.text && (
              <Alert 
                type={message.type as 'success' | 'error'} 
                onClose={() => setMessage({ type: '', text: '' })} 
                className="mb-3"
              >
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <div className="input-icon">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                  <span className="input-icon-addon">
                    <Lock size={18} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <div className="input-icon">
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-icon-addon">
                    <Lock size={18} />
                  </span>
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-muted mt-3">
          Remember your password?{' '}
          <Link href="/login" className="text-decoration-none">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;