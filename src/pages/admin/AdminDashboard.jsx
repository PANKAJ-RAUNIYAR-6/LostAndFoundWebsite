import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  Search,
  FileCheck,
  AlertOctagon,
  Award,
  Activity,
  ArrowRight,
  ShieldAlert,
  Database
} from 'lucide-react';
import api from '../../services/api.js';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLost: 0,
    totalFound: 0,
    totalResolved: 0,
    activeClaims: 0,
    pendingReports: 0,
    dbStatus: { connected: false, type: 'Checking...' }
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          api.getAdminStats(),
          api.getActivityLogsAdmin()
        ]);

        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (logsRes.success && logsRes.logs) {
          setActivityLogs(logsRes.logs.slice(0, 8));
        }
      } catch (err) {
        console.error('Admin overview load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  return (
    <div>
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Total Registered Users</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalUsers}</div>
            </div>
            <Users size={28} color="#3b82f6" />
          </div>
          <Link to="/admin/users" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '0.5rem' }}>
            Manage Users <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Lost Item Reports</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalLost}</div>
            </div>
            <Package size={28} color="#ef4444" />
          </div>
          <Link to="/admin/lost" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '0.5rem' }}>
            View Lost Items <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Found Item Listings</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalFound}</div>
            </div>
            <Search size={28} color="#10b981" />
          </div>
          <Link to="/admin/found" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '0.5rem' }}>
            View Found Items <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Recovered &amp; Resolved</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalResolved}</div>
            </div>
            <FileCheck size={28} color="#6366f1" />
          </div>
          <Link to="/admin/claims" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '0.5rem' }}>
            Review Claims <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Abuse Reports</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '2px' }}>{stats.pendingReports}</div>
            </div>
            <AlertOctagon size={28} color="#dc2626" />
          </div>
          <Link to="/admin/abuse-reports" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '0.5rem' }}>
            Moderate Reports <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Database State Banner */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database size={22} color="#2563eb" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Active Database Engine: {stats.dbStatus?.type}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Connection: {stats.dbStatus?.connected ? 'Live MongoDB Connected' : 'Embedded Resilient In-Memory Storage Active'}
            </div>
          </div>
        </div>
        <Link to="/admin/settings" className="btn btn-secondary btn-sm">
          System Diagnostics
        </Link>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#2563eb" /> Recent System Audit Logs
          </h3>
          <Link to="/admin/activity" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            Full Audit Trail &gt;
          </Link>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading activity logs...</div>
        ) : activityLogs.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '1.5rem 0' }}>No activity records found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '0.625rem 0.5rem' }}>Action</th>
                  <th style={{ padding: '0.625rem 0.5rem' }}>User</th>
                  <th style={{ padding: '0.625rem 0.5rem' }}>Details</th>
                  <th style={{ padding: '0.625rem 0.5rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.625rem 0.5rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.625rem 0.5rem', fontWeight: 600 }}>
                      {log.user?.name || log.user?.email || 'System'}
                    </td>
                    <td style={{ padding: '0.625rem 0.5rem', color: '#475569' }}>
                      {log.details}
                    </td>
                    <td style={{ padding: '0.625rem 0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                      {new Date(log.createdAt).toLocaleString()}
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

export default AdminDashboard;
