import React, { useState } from 'react';
import { Link } from '../components/Layout/Link';
import { apiService } from '../services/api';
import Alert from '../components/UI/Alert';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await apiService.forgotPassword(email);
      setSubmitted(true);
      setMessage({ 
        type: 'success', 
        text: 'If an account with this email exists, you will receive password reset instructions.' 
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send reset email' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="card card-md">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="avatar avatar-xl bg-success text-white">
                  <Mail size={32} />
                </div>
              </div>
              <h2 className="h3 mb-3">Check your email</h2>
              <p className="text-muted mb-4">
                We've sent password reset instructions to your email address. 
                Please check your inbox and follow the link to reset your password.
              </p>
              <Link href="/login" className="btn btn-primary">
                <ArrowLeft size={16} className="me-2" />
                Back to Login
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
            <h2 className="h2 text-center mb-4">Forgot your password?</h2>
            
            <p className="text-muted text-center mb-4">
              Enter your email address and we'll send you a link to reset your password.
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
                <label className="form-label">Email address</label>
                <div className="input-icon">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="input-icon-addon">
                    <Mail size={18} />
                  </span>
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send reset instructions'}
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

export default ForgotPassword;