import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, User } from 'lucide-react';
import api from '../../services/api.js';

export const AdminActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getActivityLogsAdmin().then(res => {
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} color="#2563eb" /> Security &amp; Activity Audit Trail
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Comprehensive historical log of user actions, logins, claims, and deletions
        </p>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>No activity logs recorded.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Action Type</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>User / Actor</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Audit Details</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>IP Address</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                      {l.user?.name || l.user?.email || 'System'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                      {l.details}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {l.ip || '127.0.0.1'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                      {new Date(l.createdAt).toLocaleString()}
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

export default AdminActivity;
