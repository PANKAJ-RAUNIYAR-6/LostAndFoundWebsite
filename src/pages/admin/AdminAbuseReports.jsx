import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api.js';

export const AdminAbuseReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await api.getAbuseReportsAdmin();
      if (res.success && res.reports) {
        setReports(res.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.updateAbuseReportStatus(id, status);
      if (res.success) {
        setMsg(`Report status updated to ${status}.`);
        fetchReports();
        setTimeout(() => setMsg(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
          <AlertOctagon size={24} /> Abuse Reports &amp; Moderation Flags
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Investigate reported suspicious listings, fake claims, spam, and policy violations
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading abuse reports...</div>
        ) : reports.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>No abuse reports logged.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((rep) => (
              <div
                key={rep._id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: rep.status === 'PENDING' ? '#fff1f2' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    Reason: {rep.reason}
                  </div>
                  <span className={`badge ${rep.status === 'PENDING' ? 'badge-lost' : rep.status === 'RESOLVED' ? 'badge-found' : 'badge-secondary'}`}>
                    {rep.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Details:</strong> {rep.details || 'No additional comment provided.'}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#64748b' }}>
                  <div>
                    Reported by: <strong>{rep.reporter?.name || rep.reporter?.email || 'Anonymous'}</strong> &bull; Date: {new Date(rep.createdAt).toLocaleString()}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {rep.item && (
                      <Link to={`/item/${rep.item._id || rep.item}`} className="btn btn-secondary btn-sm">
                        <ExternalLink size={13} /> View Target Item
                      </Link>
                    )}
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(rep._id, 'RESOLVED')}
                    >
                      Resolve
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateStatus(rep._id, 'DISMISSED')}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAbuseReports;
