import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/Layout/Link';
import Alert from '../components/UI/Alert';
import { Lock, User, LogIn, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    <div 
      className="page page-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e5e7eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="container container-tight py-4" style={{ maxWidth: '28rem' }}>
        {/* Logo/Brand Section */}
        <div className="text-center mb-4">
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              background: '#1e293b',
              borderRadius: '1rem',
              marginBottom: '1rem'
            }}
          >
            <Shield size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Professional Auth System
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Secure access to your dashboard
          </p>
        </div>
        
        <div 
          className="card"
          style={{
            border: 'none',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '0.75rem',
            overflow: 'hidden'
          }}
        >
          {/* Card Header */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: '#fff',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.25rem', marginBottom: 0 }}>
              Sign in to continue to your account
            </p>
          </div>

          <div className="card-body" style={{ padding: '2rem' }}>
            {error && (
              <Alert type="error" onClose={() => setError('')} className="mb-3">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                  Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="login"
                    placeholder="Enter username or email"
                    value={formData.login}
                    onChange={handleChange}
                    required
                    style={{
                      paddingLeft: '2.5rem',
                      height: '2.75rem',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#206bc4'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280'
                    }}
                  >
                    <User size={20} />
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                  <span>Password</span>
                  <Link 
                    href="/forgot-password" 
                    style={{ 
                      float: 'right', 
                      fontSize: '0.875rem',
                      color: '#206bc4',
                      textDecoration: 'none'
                    }}
                  >
                    Forgot password?
                  </Link>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
                      height: '2.75rem',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#206bc4'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280'
                    }}
                  >
                    <Lock size={20} />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Remember me on this device
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
                style={{
                  height: '3rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: loading ? '#94a3b8' : '#206bc4',
                  border: 'none',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1a5db1')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#206bc4')}
              >
                {loading ? (
                  <>
                    <span 
                      className="spinner-border spinner-border-sm" 
                      style={{ width: '1rem', height: '1rem' }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="hr-text" style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
              <span 
                style={{
                  background: '#fff',
                  padding: '0 1rem',
                  color: '#94a3b8',
                  fontSize: '0.875rem',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                or
              </span>
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: '#e5e7eb',
                  zIndex: 0
                }}
              />
            </div>

            <Link 
              href="/register" 
              className="btn w-100"
              style={{
                height: '2.75rem',
                background: '#fff',
                border: '2px solid #e5e7eb',
                color: '#1e293b',
                fontWeight: 500,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              Create new account
            </Link>
          </div>
        </div>
        
        {/* Demo Credentials */}
        <div 
          className="text-center mt-4"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '1rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <strong>Demo Credentials</strong>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Username:</span>{' '}
              <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: '#1e293b' }}>
                admin
              </code>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Password:</span>{' '}
              <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: '#1e293b' }}>
                admin123
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            © 2024 Professional Auth System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;