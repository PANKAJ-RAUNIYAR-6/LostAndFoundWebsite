import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../services/api.js';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        profileImage: profileImage.trim()
      });
      setMsg('Profile details successfully updated!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.45rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={22} color="#2563eb" /> Personal Profile &amp; Preferences
        </h2>

        {msg && <div className="alert alert-success"><CheckCircle2 size={18} /> {msg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <img
            src={profileImage || user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
          />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '6px' }}>
              <span className={`badge ${user?.isVerified ? 'badge-verified' : 'badge-pending'}`}>
                {user?.isVerified ? 'Verified Account' : 'Unverified (OTP Pending)'}
              </span>
              <span className="badge badge-found">
                <Award size={12} /> {user?.rewardPoints || 0} Points
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              className="form-control"
              placeholder="+1 555-019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Profile Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://..."
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
