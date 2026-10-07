import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, ExternalLink, Package } from 'lucide-react';
import api from '../../services/api.js';

export const MyLostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await api.getMyItems('LOST');
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lost report?')) return;
    try {
      await api.deleteItem(id);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateItem(id, { status: newStatus });
      setItems(items.map(i => i._id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#b91c1c', margin: 0 }}>My Lost Item Reports</h2>
          <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>Manage status, edit details, or remove solved items</p>
        </div>
        <Link to="/report-lost" className="btn btn-danger btn-sm">
          <PlusCircle size={15} /> Report Another Lost Item
        </Link>
      </div>

      {loading ? (
        <div className="lead text-center" style={{ padding: '2rem' }}>Loading your items...</div>
      ) : items.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
          <Package size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Lost Items Reported Yet</h3>
          <p className="text-muted">If you misplaced an item, register it to alert the community.</p>
          <Link to="/report-lost" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Report a Lost Item
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((it) => (
            <div
              key={it._id}
              className="card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={(it.images && it.images.length > 0) ? it.images[0] : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=200&q=80'}
                  alt={it.title}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
                    <Link to={`/item/${it._id}`} style={{ color: '#0f172a' }}>{it.title}</Link>
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {it.category} &bull; {it.location} &bull; {it.date}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  value={it.status}
                  onChange={(e) => handleStatusChange(it._id, e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLAIM_PENDING">CLAIM_PENDING</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <Link to={`/item/${it._id}`} className="btn btn-secondary btn-sm" title="View Public Listing">
                  <ExternalLink size={14} /> View
                </Link>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(it._id)}
                  title="Delete Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLostItems;
