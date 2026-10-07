import React, { useState, useEffect } from 'react';
import { Grid, PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.createCategoryAdmin({
        name: name.trim(),
        description: description.trim()
      });

      if (res.success) {
        setName('');
        setDescription('');
        setMsg('Category added successfully.');
        fetchCategories();
        setTimeout(() => setMsg(null), 2500);
      }
    } catch (err) {
      alert(err.message || 'Creation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item category?')) return;
    try {
      await api.deleteCategoryAdmin(id);
      setCategories(categories.filter(c => c._id !== id));
      setMsg('Category removed.');
      setTimeout(() => setMsg(null), 2500);
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Grid size={24} color="#2563eb" /> Item Categories Taxonomy Management
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Manage the item classifications used for reporting and filtering
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Create Category Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Create New Category</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sports Equipment & Gear"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Brief summary of item types included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} /> Add Category
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active Categories ({categories.length})</h3>

          {loading ? (
            <div className="text-center" style={{ padding: '2rem' }}>Loading categories...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
              {categories.map((c) => (
                <div
                  key={c._id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{c.name}</strong>
                    {c.description && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.description}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c._id)}
                    title="Delete Category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
