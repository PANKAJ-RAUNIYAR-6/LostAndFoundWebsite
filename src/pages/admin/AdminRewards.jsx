import React, { useState, useEffect } from 'react';
import { Award, PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';

export const AdminRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [points, setPoints] = useState(50);
  const [reason, setReason] = useState('Special community contribution bonus');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchData = async () => {
    try {
      const [rewRes, usrRes] = await Promise.all([
        api.getAllRewardsAdmin(),
        api.getAdminUsers()
      ]);
      if (rewRes.success && rewRes.rewards) setRewards(rewRes.rewards);
      if (usrRes.success && usrRes.users) {
        setUsers(usrRes.users);
        if (usrRes.users.length > 0) setSelectedUser(usrRes.users[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAward = async (e) => {
    e.preventDefault();
    if (!selectedUser || !points || !reason.trim()) return;

    try {
      const res = await api.awardPointsAdmin({
        userId: selectedUser,
        points: Number(points),
        reason: reason.trim()
      });

      if (res.success) {
        setMsg(`Successfully awarded ${points} bonus points!`);
        fetchData();
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      alert(err.message || 'Award failed.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706' }}>
          <Award size={24} /> Reward Points Economy &amp; Distribution
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Manage user point incentives, view reward records, and grant bonus points
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Grant Bonus Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Award Bonus Points to User</h3>
          <form onSubmit={handleAward} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select User</label>
              <select
                className="form-control"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email}) - Current: {u.rewardPoints || 0} pts
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Points to Grant</label>
              <input
                type="number"
                min="5"
                max="1000"
                step="5"
                className="form-control"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Reason / Justification</label>
              <input
                type="text"
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <PlusCircle size={16} /> Credit Reward Points
            </button>
          </form>
        </div>

        {/* Rewards Feed */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Point Transactions History</h3>

          {loading ? (
            <div className="text-center" style={{ padding: '2rem' }}>Loading reward transactions...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
              {rewards.map((r) => (
                <div
                  key={r._id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.user?.name || 'User'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.reason}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>
                    +{r.points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRewards;
