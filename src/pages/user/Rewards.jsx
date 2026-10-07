import React, { useState, useEffect } from 'react';
import { Award, Star, Gift, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const Rewards = () => {
  const { user } = useAuth();
  const [rewardData, setRewardData] = useState({ totalPoints: 0, rewards: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.getMyRewards();
        if (res.success) {
          setRewardData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={24} color="#d97706" /> Community Reward &amp; Honor System
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Earn points for reporting lost and found items, returning items to rightful owners, and positive feedback.
        </p>
      </div>

      {/* Rewards Header Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fef3c7' }}>
            Current Honor Balance
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {rewardData.totalPoints || user?.rewardPoints || 0} Points
          </div>
          <p style={{ margin: '6px 0 0', color: '#fef3c7', fontSize: '0.9rem' }}>
            Tier: Community Guardian &bull; Verified Helper
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '1rem 1.25rem', borderRadius: '10px', maxWidth: '320px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>How to earn points:</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
            <li>+25 pts for reporting a found item</li>
            <li>+50 pts for safely returning an item</li>
            <li>+10 pts on verified user registration</li>
            <li>+10 pts for submitting a lost report</li>
          </ul>
        </div>
      </div>

      {/* Points History Ledger */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Points Distribution History</h3>

        {loading ? (
          <div className="lead text-center" style={{ padding: '2rem' }}>Loading reward log...</div>
        ) : rewardData.rewards?.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem 0' }}>
            No reward transactions yet. Report an item or resolve a claim to receive points!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rewardData.rewards.map((r) => (
              <div
                key={r._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '8px', borderRadius: '50%' }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{r.reason}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#047857' }}>
                  +{r.points} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
