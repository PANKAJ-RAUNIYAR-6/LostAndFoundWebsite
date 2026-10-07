import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  Phone,
  Mail,
  ShieldAlert,
  MessageSquare,
  FileCheck,
  Edit,
  Trash2,
  Share2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import MapboxItemViewer from '../../components/common/MapboxItemViewer.jsx';
import ClaimModal from '../../components/common/ClaimModal.jsx';
import AbuseReportModal from '../../components/common/AbuseReportModal.jsx';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await api.getItemById(id);
        if (res.success && res.item) {
          setItem(res.item);
        } else {
          setError(res.message || 'Item details could not be retrieved.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/item/${id}` } } });
      return;
    }

    const posterId = item.user?._id || item.user;
    try {
      const res = await api.startConversation(posterId, item._id);
      if (res.success) {
        navigate('/chat');
      }
    } catch (err) {
      alert(err.message || 'Failed to initialize conversation.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      const res = await api.deleteItem(item._id);
      if (res.success) {
        navigate(item.type === 'LOST' ? '/lost' : '/found');
      }
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '4rem 0' }}>
        <div className="lead">Loading item specifications and location coordinates...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div className="alert alert-danger">{error || 'Item not found.'}</div>
        <Link to="/" className="btn btn-secondary">Return to Home</Link>
      </div>
    );
  }

  const isLost = item.type === 'LOST';
  const itemOwnerId = item.user?._id || item.user;
  const isOwner = user && String(user._id) === String(itemOwnerId);

  const images = (item.images && item.images.length > 0)
    ? item.images
    : [isLost
      ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="container">
      {/* Top Breadcrumb & Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <Link to="/">Home</Link> &gt;
          <Link to={isLost ? '/lost' : '/found'}>{isLost ? 'Lost Items' : 'Found Items'}</Link> &gt;
          <span style={{ color: '#64748b' }}>{item.title}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: '0.85rem' }}>
            {item.type}
          </span>
          <span className="badge badge-verified" style={{ fontSize: '0.85rem' }}>
            {item.status}
          </span>
        </div>
      </div>

      {actionMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} /> {actionMsg}
        </div>
      )}

      {/* Main Grid: Images & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: Gallery */}
        <div>
          <div
            style={{
              width: '100%',
              height: '380px',
              backgroundColor: '#e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <img
              src={images[selectedImage]}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0f172a' }}
            />
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImage === idx ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none'
                  }}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Mapbox Geolocation Viewer */}
          <MapboxItemViewer
            latitude={item.coordinates?.latitude || 28.6139}
            longitude={item.coordinates?.longitude || 77.2090}
            title={item.title}
            locationName={item.location}
          />
        </div>

        {/* Right: Item Metadata & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <Tag size={16} /> <span>{item.category}</span> &bull;
              <Calendar size={16} /> <span>{item.date}</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', color: '#0f172a' }}>{item.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 600, fontSize: '0.95rem' }}>
              <MapPin size={18} /> {item.location}
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#334155' }}>Detailed Description</h4>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-line' }}>
              {item.description}
            </p>
          </div>

          {/* Poster Information Card */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#f8fafc' }}>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', color: '#334155' }}>Reported By</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={item.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={item.user?.name || 'Poster'}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.user?.name || 'Community Member'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Posted on {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {(item.contactPhone || item.contactEmail) && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem', color: '#475569' }}>
                {item.contactPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} color="#2563eb" /> {item.contactPhone}
                  </div>
                )}
                {item.contactEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} color="#2563eb" /> {item.contactEmail}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!isOwner && (
              <>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: { pathname: `/item/${id}` } } });
                    } else {
                      setClaimModalOpen(true);
                    }
                  }}
                  disabled={item.status === 'RESOLVED'}
                >
                  <FileCheck size={19} /> {item.status === 'RESOLVED' ? 'Item Already Recovered' : 'Claim Ownership of this Item'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={handleStartChat}
                >
                  <MessageSquare size={19} /> Contact Reporter in Real-Time Chat
                </button>
              </>
            )}

            {(isOwner || isAdmin) && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to={`/edit-item/${item._id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Edit size={16} /> Edit Details
                </Link>
                <button type="button" className="btn btn-danger" onClick={handleDelete} style={{ flex: 1 }}>
                  <Trash2 size={16} /> Remove Listing
                </button>
              </div>
            )}

            {/* Abuse Report Link */}
            {!isOwner && (
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.8125rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  marginTop: '0.5rem'
                }}
              >
                <ShieldAlert size={15} /> Report suspicious listing, harassment, or fake post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={item}
        onClaimSubmitted={() => {
          setItem(prev => ({ ...prev, status: 'CLAIM_PENDING' }));
          setActionMsg('Claim request submitted! The poster and administrators will review your proof.');
        }}
      />

      {/* Abuse Report Modal */}
      <AbuseReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        item={item}
        targetUser={item.user}
      />
    </div>
  );
};

export default ItemDetails;
