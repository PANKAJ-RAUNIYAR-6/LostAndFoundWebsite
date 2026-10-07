import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api.js';

export const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchClaims = async () => {
    try {
      const res = await api.getAllClaimsAdmin();
      if (res.success && res.claims) {
        setClaims(res.claims);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdate = async (id, status) => {
    const notes = prompt(`Admin reason or verification notes for ${status}:`, 'Verified by administrator.');
    try {
      const res = await api.updateClaimStatus(id, { status, adminNotes: notes || '' });
      if (res.success) {
        setMsg(`Claim status updated to ${status}.`);
        fetchClaims();
        setTimeout(() => setMsg(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck size={24} color="#2563eb" /> All System Ownership Claims Moderation
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Supervisory access to all ownership claims, submitted evidence, and dispute resolution
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading claims ledger...</div>
        ) : claims.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>No claims recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Item</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Claimant</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Owner / Poster</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Proof Evidence</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Admin Override</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Link to={`/item/${c.item?._id || c.item}`} style={{ fontWeight: 600, color: '#0f172a' }}>
                        {c.item?.title || 'Item listing'}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{c.claimant?.name || 'Claimant'}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{c.owner?.name || 'Owner'}</td>
                    <td style={{ padding: '0.75rem 0.5rem', maxWidth: '240px', color: '#475569' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.proofDescription}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${c.status === 'ACCEPTED' ? 'badge-found' : c.status === 'PENDING' ? 'badge-pending' : 'badge-lost'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdate(c._id, 'ACCEPTED')}
                          title="Approve Claim"
                        >
                          <CheckCircle2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdate(c._id, 'REJECTED')}
                          title="Decline Claim"
                        >
                          <XCircle size={13} />
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

export default AdminClaims;
