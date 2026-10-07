import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api.js';

export const AdminFoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await api.getItems({ type: 'FOUND', limit: 100 });
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
    if (!window.confirm('Delete this listing as an administrator?')) return;
    try {
      await api.deleteItem(id);
      setItems(items.filter(i => i._id !== id));
      setMsg('Found listing removed.');
      setTimeout(() => setMsg(null), 2500);
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateItem(id, { status });
      setItems(items.map(i => i._id === id ? { ...i, status } : i));
      setMsg('Status updated.');
      setTimeout(() => setMsg(null), 2500);
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
          <Search size={24} /> Found Items Moderation Console
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Inspect, update status, or delete inappropriate found items across the entire platform
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading found items...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Item</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Finder</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={(it.images && it.images.length > 0) ? it.images[0] : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=60&q=80'}
                          alt={it.title}
                          style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <Link to={`/item/${it._id}`} style={{ fontWeight: 600, color: '#0f172a' }}>
                          {it.title}
                        </Link>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>{it.category}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>{it.location}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{it.user?.name || 'User'}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <select
                        value={it.status}
                        onChange={(e) => handleStatusChange(it._id, e.target.value)}
                        className="form-control"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="CLAIM_PENDING">CLAIM_PENDING</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to={`/item/${it._id}`} className="btn btn-secondary btn-sm" title="View Listing">
                          <ExternalLink size={13} />
                        </Link>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(it._id)} title="Delete">
                          <Trash2 size={13} />
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

export default AdminFoundItems;
