import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Upload } from 'lucide-react';
import ImageUploader from '../forms/ImageUploader.jsx';
import api from '../../services/api.js';

export const ClaimModal = ({ isOpen, onClose, item, onClaimSubmitted }) => {
  const [proofDescription, setProofDescription] = useState('');
  const [proofImages, setProofImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) {
      setError('Please provide detailed evidence or identifying marks proving your ownership.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createClaim({
        itemId: item._id,
        proofDescription,
        proofImages
      });

      if (res.success) {
        setSuccessMsg('Your claim request has been officially recorded and submitted to the poster!');
        if (onClaimSubmitted) onClaimSubmitted(res.claim);
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
          setProofDescription('');
          setProofImages([]);
        }, 1800);
      } else {
        setError(res.message || 'Failed to submit claim.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while submitting claim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Submit Ownership Claim</h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>For: {item.title}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div className="alert alert-success" style={{ margin: '1rem 0' }}>
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="alert alert-info" style={{ fontSize: '0.85rem', margin: 0 }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>
                Please state specific details only the rightful owner would know (e.g. serial numbers, wallpaper, engraving, hidden pocket contents, receipt photos).
              </span>
            </div>

            {error && <div className="alert alert-danger" style={{ margin: 0 }}>{error}</div>}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Proof of Ownership / Verifiable Details</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Explain unique identifying marks, contents, lock screen picture, purchase date, or exact brand details..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                required
              />
            </div>

            <ImageUploader
              images={proofImages}
              onChange={setProofImages}
              maxImages={3}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting Claim...' : 'Submit Claim Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClaimModal;
