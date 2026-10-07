import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../services/api.js';

export const OTPVerification = () => {
  const { user, verifyUserOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || user?.email || '';
  const devOtp = location.state?.devOtp || null;

  const [code, setCode] = useState(devOtp || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (user) {
        await verifyUserOTP(code.trim());
      } else {
        await api.verifyOTP(email, code.trim());
      }
      setMessage('Email verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      const res = await api.sendOTP(email);
      setMessage(`New OTP sent to ${email}`);
      if (res.devOtp) {
        setCode(res.devOtp);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', padding: '2.5rem 1rem' }}>
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <ShieldCheck size={32} />
        </div>

        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Email Verification (OTP)</h1>
        <p className="lead" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          We sent a 6-digit confirmation code to: <br />
          <strong style={{ color: '#0f172a' }}>{email || 'your registered email'}</strong>
        </p>

        {devOtp && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.8125rem',
              color: '#065f46',
              marginBottom: '1rem',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>Dev & Test Mode Active:</div>
            <div>Generated OTP: <strong style={{ letterSpacing: '2px', fontSize: '1rem', color: '#047857' }}>{devOtp}</strong></div>
            <button
              type="button"
              onClick={() => setCode(devOtp)}
              style={{ background: 'none', border: 'none', color: '#059669', textDecoration: 'underline', cursor: 'pointer', padding: 0, marginTop: '4px', fontSize: '0.75rem' }}
            >
              Click to Auto-fill code
            </button>
          </div>
        )}

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            maxLength={6}
            className="form-control"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            style={{
              textAlign: 'center',
              letterSpacing: '8px',
              fontSize: '1.5rem',
              fontWeight: 700,
              padding: '0.75rem'
            }}
            required
          />

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#64748b' }}>Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={13} /> {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <Link to="/dashboard" style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Skip for now &amp; go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
