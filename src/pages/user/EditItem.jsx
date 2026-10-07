import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, CheckCircle2 } from 'lucide-react';
import MapboxLocationPicker from '../../components/common/MapboxLocationPicker.jsx';
import ImageUploader from '../../components/forms/ImageUploader.jsx';
import api from '../../services/api.js';

export const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const [catsRes, itemRes] = await Promise.all([
          api.getCategories(),
          api.getItemById(id)
        ]);

        if (catsRes.categories) setCategories(catsRes.categories);
        if (itemRes.success && itemRes.item) {
          const it = itemRes.item;
          setFormData({
            title: it.title,
            description: it.description,
            category: it.category,
            type: it.type,
            status: it.status,
            date: it.date,
            location: it.location,
            latitude: it.coordinates?.latitude || 28.6139,
            longitude: it.coordinates?.longitude || 77.2090,
            contactPhone: it.contactPhone || '',
            contactEmail: it.contactEmail || '',
            images: it.images || []
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await api.updateItem(id, formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/item/${id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container text-center" style={{ padding: '3rem' }}>Loading listing...</div>;
  }

  if (!formData) {
    return <div className="container alert alert-danger">Item not found.</div>;
  }

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.65rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Edit size={24} color="#2563eb" /> Edit Item Listing
        </h1>
        <p className="lead" style={{ fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
          Update item descriptions, upload additional photos, or change recovery status
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} /> Item listing updated successfully! Redirecting...
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Item Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="OPEN">OPEN</option>
              <option value="CLAIM_PENDING">CLAIM_PENDING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Detailed Description</label>
          <textarea
            name="description"
            rows={4}
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <ImageUploader
          images={formData.images}
          onChange={(imgs) => setFormData({ ...formData, images: imgs })}
          maxImages={4}
        />

        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#fafbfc' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#1e293b' }}>
            Mapbox Geolocation &amp; Place Details
          </h4>
          <MapboxLocationPicker
            initialLatitude={formData.latitude}
            initialLongitude={formData.longitude}
            initialLocation={formData.location}
            onChange={({ latitude, longitude, locationName }) => {
              setFormData(prev => ({
                ...prev,
                latitude,
                longitude,
                location: locationName || prev.location
              }));
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
