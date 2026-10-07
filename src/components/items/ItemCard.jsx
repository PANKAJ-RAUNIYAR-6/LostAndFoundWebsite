import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const ItemCard = ({ item }) => {
  const { t } = useLanguage();
  const isLost = item.type === 'LOST';

  const defaultImage = isLost
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';

  const imageSrc = (item.images && item.images.length > 0) ? item.images[0] : defaultImage;

  const statusClass = {
    OPEN: isLost ? 'badge-lost' : 'badge-found',
    CLAIM_PENDING: 'badge-pending',
    RESOLVED: 'badge-resolved',
    CLOSED: 'badge-secondary'
  }[item.status] || 'badge-secondary';

  const statusText = {
    OPEN: isLost ? 'LOST' : 'FOUND',
    CLAIM_PENDING: 'Claim Pending',
    RESOLVED: 'Recovered / Resolved',
    CLOSED: 'Closed'
  }[item.status] || item.status;

  return (
    <div className="card card-hover" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image container */}
      <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#e2e8f0' }}>
        <img
          src={imageSrc}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '6px' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? 'LOST' : 'FOUND'}
          </span>
          <span className={`badge ${statusClass}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.625rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b' }}>
          <Tag size={13} />
          <span>{item.category}</span>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
          <Link to={`/item/${item._id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
            {item.title}
          </Link>
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="#2563eb" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} style={{ flexShrink: 0 }} />
              <span>{item.date}</span>
            </div>
            <Link
              to={`/item/${item._id}`}
              className="btn btn-outline-primary btn-sm"
              style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
            >
              {t('viewDetails')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
