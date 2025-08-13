import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '../components/Layout/Link';
import Alert from '../components/UI/Alert';
import { User, Mail, Lock } from 'lucide-react';

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
      <div className="page page-center">
        <div className="container container-tight py-4">
          <div className="card card-md">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="avatar avatar-xl bg-success text-white">
                  <User size={32} />
                </div>
              </div>
              <h2 className="h3 mb-3">Registration Successful!</h2>
              <p className="text-muted mb-4">
                Your account has been created successfully. Please wait for admin approval 
                before you can log in to the system.
              </p>
              <Link href="/login" className="btn btn-primary">
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
            <h2 className="h2 text-center mb-4">Create new account</h2>
            
            {error && (
              <Alert type="error" onClose={() => setError('')} className="mb-3">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <div className="input-icon">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Choose username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-icon-addon">
                    <User size={18} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-icon">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-icon-addon">
                    <Mail size={18} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-icon">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <span className="input-icon-addon">
                    <Lock size={18} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon">
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm your password"
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
                  {loading ? 'Creating account...' : 'Create new account'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-muted mt-3">
          Already have account?{' '}
          <Link href="/login" className="text-decoration-none">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;