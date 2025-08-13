import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/Layout/Link';
import Alert from '../components/UI/Alert';
import { Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      window.history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <h1 className="h2 text-primary">Professional Auth System</h1>
        </div>
        
        <div className="card card-md">
          <div className="card-body">
            <h2 className="h2 text-center mb-4">Login to your account</h2>
            
            {error && (
              <Alert type="error" onClose={() => setError('')} className="mb-3">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username or Email</label>
                <div className="input-icon mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="login"
                    placeholder="Enter username or email"
                    value={formData.login}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-icon-addon">
                    <User size={18} />
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <label className="form-label">
                  Password
                  <span className="form-label-description">
                    <Link href="/forgot-password" className="text-decoration-none">
                      I forgot password
                    </Link>
                  </span>
                </label>
                <div className="input-icon mb-3">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
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
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-muted mt-3">
          Don't have account yet?{' '}
          <Link href="/register" className="text-decoration-none">
            Sign up
          </Link>
        </div>
        
        <div className="text-center text-muted mt-3">
          <small>
            <strong>Demo Credentials:</strong><br />
            Username: admin | Password: admin123
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;