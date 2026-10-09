
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: '440px', padding: '2rem 1rem' }}
    >
      <div className="card" style={{ padding: '2rem' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.75rem'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem'
            }}
          >
            <Compass size={28} />
          </div>

          <h1
            style={{
              fontSize: '1.6rem',
              margin: '0 0 0.25rem'
            }}
          >
            Welcome Back
          </h1>

          <p
            className="lead"
            style={{
              fontSize: '0.875rem',
              margin: 0
            }}
          >
            Log in to manage your lost & found items and active claims
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger"
            style={{ fontSize: '0.85rem' }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>

            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <label className="form-label">Password</label>

              <Link
                to="/forgot-password"
                style={{
                  fontSize: '0.75rem',
                  color: '#2563eb'
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.25rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#475569'
          }}
        >
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
