import React, { useState, useEffect } from 'react';
import { Users, Shield, Ban, CheckCircle2, Trash2, Award } from 'lucide-react';
import api from '../../services/api.js';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.getAdminUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentBlocked) => {
    try {
      const res = await api.updateUserStatusAdmin(userId, { isBlocked: !currentBlocked });
      if (res.success) {
        setMsg(`User ${!currentBlocked ? 'suspended' : 're-activated'}.`);
        fetchUsers();
        setTimeout(() => setMsg(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole.toUpperCase()}?`)) return;
    try {
      const res = await api.updateUserStatusAdmin(userId, { role: newRole });
      if (res.success) {
        setMsg(`Role updated to ${newRole}.`);
        fetchUsers();
        setTimeout(() => setMsg(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user account permanently?')) return;
    try {
      const res = await api.deleteUserAdmin(userId);
      if (res.success) {
        setUsers(users.filter(u => u._id !== userId));
        setMsg('User account removed.');
        setTimeout(() => setMsg(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} color="#2563eb" /> User Account Management &amp; Moderation
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Manage user permissions, block suspicious accounts, and view verification statuses
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading user registry...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>User Profile</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email / Phone</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Verification</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Reward Pts</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                          alt={u.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.phone || 'No phone'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-lost' : 'badge-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${u.isVerified ? 'badge-found' : 'badge-pending'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#d97706' }}>
                      {u.rewardPoints || 0}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${u.isBlocked ? 'badge-lost' : 'badge-found'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleToggleRole(u._id, u.role)}
                          title="Change Role"
                        >
                          <Shield size={13} /> {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${u.isBlocked ? 'btn-success' : 'btn-secondary'}`}
                          onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                          title={u.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          <Ban size={13} /> {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id)}
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
