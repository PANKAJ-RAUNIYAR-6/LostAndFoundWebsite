import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, CheckCircle2, XCircle, Clock, ExternalLink, ShieldAlert, Award } from 'lucide-react';
import api from '../../services/api.js';

export const MyClaims = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'made'
  const [claimsData, setClaimsData] = useState({ claimsMade: [], claimsReceived: [] });
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchClaims = async () => {
    try {
      const res = await api.getMyClaims();
      if (res.success) {
        setClaimsData(res);
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

  const handleUpdateStatus = async (claimId, status) => {
    try {
      const res = await api.updateClaimStatus(claimId, { status });
      if (res.success) {
        setActionMsg(`Claim ${status === 'ACCEPTED' ? 'approved! Item marked resolved and reward points awarded.' : 'rejected.'}`);
        fetchClaims();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  const claimsList = activeTab === 'received' ? claimsData.claimsReceived : claimsData.claimsMade;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={24} color="#2563eb" /> Ownership Claims &amp; Verification
          </h2>
          <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
            Inspect proof of ownership and confirm return of lost belongings
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '4px' }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setActiveTab('received')}
            style={{
              backgroundColor: activeTab === 'received' ? '#ffffff' : 'transparent',
              color: activeTab === 'received' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'received' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Claims Received ({claimsData.claimsReceived.length})
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setActiveTab('made')}
            style={{
              backgroundColor: activeTab === 'made' ? '#ffffff' : 'transparent',
              color: activeTab === 'made' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'made' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Claims I Made ({claimsData.claimsMade.length})
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} /> {actionMsg}
        </div>
      )}

      {loading ? (
        <div className="lead text-center" style={{ padding: '2rem' }}>Loading claims data...</div>
      ) : claimsList.length === 0 ? (
        <div className="card text-center" style={{ padding: '3.5rem 1.5rem' }}>
          <FileCheck size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Claims Found in this Tab</h3>
          <p className="text-muted">
            {activeTab === 'received'
              ? 'No one has submitted a claim on your reported items yet.'
              : 'You have not submitted any ownership claims on found items.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {claimsList.map((claim) => {
            const isPending = claim.status === 'PENDING';
            const isAccepted = claim.status === 'ACCEPTED';
            const isRejected = claim.status === 'REJECTED';

            return (
              <div key={claim._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                      Item: {claim.item?.title || 'Reported Item'}
                    </span>
                    {claim.item?._id && (
                      <Link to={`/item/${claim.item._id}`} style={{ color: '#2563eb', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <ExternalLink size={13} /> View
                      </Link>
                    )}
                  </div>

                  <span className={`badge ${isPending ? 'badge-pending' : isAccepted ? 'badge-resolved' : 'badge-lost'}`}>
                    {claim.status}
                  </span>
                </div>

                {/* Submitter & Proof */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {activeTab === 'received' ? 'Claimant Profile' : 'Item Poster / Finder'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={(activeTab === 'received' ? claim.claimant?.profileImage : claim.owner?.profileImage) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt="User"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {activeTab === 'received' ? claim.claimant?.name : claim.owner?.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {activeTab === 'received' ? claim.claimant?.email : claim.owner?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Submitted Evidence &amp; Proof Details
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      {claim.proofDescription}
                    </p>
                  </div>
                </div>

                {/* Proof Images if provided */}
                {claim.proofImages && claim.proofImages.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Proof Photographs Attached
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                      {claim.proofImages.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                          <img
                            src={img}
                            alt="Proof"
                            style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons for received claims */}
                {activeTab === 'received' && isPending && (
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateStatus(claim._id, 'REJECTED')}
                    >
                      <XCircle size={15} color="#ef4444" /> Decline Claim
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(claim._id, 'ACCEPTED')}
                    >
                      <CheckCircle2 size={15} /> Accept Claim (+50 Reward Pts)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
