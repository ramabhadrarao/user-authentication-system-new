import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/Layout/Link';
import Alert from '../components/UI/Alert';
import { User, Mail, Lock, UserPlus, Shield, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <div 
            className="card"
            style={{
              border: 'none',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              borderRadius: '0.75rem',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '5rem',
                  height: '5rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle size={48} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                Registration Successful!
              </h2>
            </div>
            <div className="card-body text-center" style={{ padding: '2rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Your account has been created successfully. Please wait for admin approval 
                before you can log in to the system.
              </p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '2rem' }}>
                You will receive an email notification once your account is approved.
              </p>
              <Link 
                href="/login" 
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="page page-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e5e7eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0'
      }}
    >
      <div className="container container-tight py-4" style={{ maxWidth: '36rem' }}>
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
            Create your secure account
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
              Get Started
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.25rem', marginBottom: 0 }}>
              Create a new account to access the system
            </p>
          </div>

          <div className="card-body" style={{ padding: '2rem' }}>
            {error && (
              <Alert type="error" onClose={() => setError('')} className="mb-3">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      style={{
                        height: '2.5rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      style={{
                        height: '2.5rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                  Username <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{
                      paddingLeft: '2.5rem',
                      height: '2.5rem',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
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
                    <User size={18} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      paddingLeft: '2.5rem',
                      height: '2.5rem',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
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
                    <Mail size={18} />
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                      Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        name="password"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        style={{
                          paddingLeft: '2.5rem',
                          height: '2.5rem',
                          fontSize: '0.95rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.5rem'
                        }}
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
                        <Lock size={18} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 500, color: '#374151' }}>
                      Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          height: '2.5rem',
                          fontSize: '0.95rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.5rem'
                        }}
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
                        <Lock size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    required
                    style={{ marginRight: '0.5rem', marginTop: '0.125rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    I agree to the Terms of Service and Privacy Policy
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
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  style={{ color: '#206bc4', textDecoration: 'none', fontWeight: 500 }}
                >
                  Sign in
                </Link>
              </p>
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

export default Register;