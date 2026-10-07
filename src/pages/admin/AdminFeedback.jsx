import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../../services/api.js';

export const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFeedbacks().then(res => {
      if (res.success && res.feedbacks) {
        setFeedbacks(res.feedbacks);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={24} color="#f59e0b" fill="#f59e0b" /> User Feedback &amp; Rating Moderation
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Review platform ratings, reviews, and suggestions submitted by users
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading feedbacks...</div>
        ) : feedbacks.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>No feedback reviews submitted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={fb.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'}
                      alt="User"
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <strong style={{ fontSize: '0.9rem' }}>{fb.user?.name || 'Community Member'}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} color={s <= fb.rating ? '#f59e0b' : '#cbd5e1'} fill={s <= fb.rating ? '#f59e0b' : 'none'} />
                    ))}
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155' }}>
                  "{fb.comment}"
                </p>

                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Submitted on {new Date(fb.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
