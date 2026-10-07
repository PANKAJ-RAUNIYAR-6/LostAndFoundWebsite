import React, { useState } from 'react';
import { X, AlertOctagon, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';

export const AbuseReportModal = ({ isOpen, onClose, item, targetUser }) => {
  const [reason, setReason] = useState('Fake or Suspicious Listing');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.createAbuseReport({
        itemId: item?._id || null,
        targetUserId: targetUser?._id || null,
        reason,
        details
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setDetails('');
        }, 1800);
      } else {
        setError(res.message || 'Failed to submit report.');
      }
    } catch (err) {
      setError(err.message || 'Error submitting report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertOctagon size={22} color="#ef4444" />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Report Abuse or Suspicious Activity</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <span>Thank you. Our moderation team has received your report and will investigate.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Reason for Report</label>
              <select
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Fake or Suspicious Listing">Fake or Suspicious Listing</option>
                <option value="Harassment or Inappropriate Communication">Harassment or Inappropriate Communication</option>
                <option value="Attempted Scam / Extortion">Attempted Scam / Extortion</option>
                <option value="Duplicate or Spam Post">Duplicate or Spam Post</option>
                <option value="Contains Sensitive Personal Data">Contains Sensitive Personal Data</option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Additional Details / Explanation</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe what occurred or why this violates platform guidelines..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AbuseReportModal;
