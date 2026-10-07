import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Search } from 'lucide-react';
import MapboxLocationPicker from '../../components/common/MapboxLocationPicker.jsx';
import ImageUploader from '../../components/forms/ImageUploader.jsx';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const ReportFoundItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    latitude: 28.6139,
    longitude: 77.2090,
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getCategories().then(res => {
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
        setFormData(prev => ({ ...prev, category: res.categories[0].name }));
      }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = ({ latitude, longitude, locationName }) => {
    setFormData(prev => ({
      ...prev,
      latitude,
      longitude,
      location: locationName || prev.location
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in title, description, and location.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createItem({
        ...formData,
        type: 'FOUND'
      });

      if (res.success && res.item) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/item/${res.item._id}`);
        }, 1500);
      } else {
        setError(res.message || 'Failed to submit found item report.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating your report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#047857', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={24} /> Report a Found Item
        </h1>
        <p className="lead" style={{ fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
          Help return an item to its owner! You will earn +25 reward points for reporting.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={20} /> Found item registered! Redirecting to listing...
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Item Title / Headline</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="e.g. Set of 3 Dorm Keys with Blue Keychain"
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
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date Found</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Detailed Description</label>
          <textarea
            name="description"
            rows={4}
            className="form-control"
            placeholder="Describe what you found and where it is currently stored or handed over for safekeeping..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cloudinary Image Uploader */}
        <ImageUploader
          images={formData.images}
          onChange={(newImages) => setFormData({ ...formData, images: newImages })}
          maxImages={4}
        />

        {/* Mapbox Location Picker */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#fafbfc' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#1e293b' }}>
            Mapbox Geolocation &amp; Place Details
          </h4>
          <MapboxLocationPicker
            initialLatitude={formData.latitude}
            initialLongitude={formData.longitude}
            initialLocation={formData.location}
            onChange={handleLocationChange}
          />
        </div>

        {/* Contact Preferences */}
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              className="form-control"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+1 555-019-2834"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              className="form-control"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
            {loading ? 'Publishing Report...' : 'Publish Found Item Report (+25 pts)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportFoundItem;
