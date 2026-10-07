import React from 'react';
import ItemCard from './ItemCard.jsx';
import { PackageOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const ItemGrid = ({ items = [], loading = false }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="grid-cards">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card" style={{ height: '320px', backgroundColor: '#f1f5f9', opacity: 0.7 }}>
            <div style={{ height: '160px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem' }} />
            <div style={{ height: '20px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '16px', width: '90%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <PackageOpen size={52} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1e293b' }}>
          {t('noItemsFound')}
        </h3>
        <p className="lead" style={{ fontSize: '0.95rem' }}>
          Try clearing your search terms or filters to browse all registered reports.
        </p>
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
