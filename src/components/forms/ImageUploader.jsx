import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';

export const ImageUploader = ({ images = [], onChange, maxImages = 4 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setUploadError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.uploadImages(formData);
      if (res.success && res.urls) {
        onChange([...images, ...res.urls]);
      } else {
        setUploadError(res.message || 'Image upload failed.');
      }
    } catch (err) {
      setUploadError(err.message || 'Error uploading images.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Item Photographs / Visual Proof ({images.length}/{maxImages})</span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Cloudinary / Secure Storage</span>
      </label>

      {/* Image Previews */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
          {images.map((url, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                height: '90px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <img src={url} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(239, 68, 68, 0.85)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Drop Zone */}
      {images.length < maxImages && (
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            cursor: uploading ? 'wait' : 'pointer',
            transition: 'border-color 0.2s ease'
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <UploadCloud size={32} color={uploading ? '#94a3b8' : '#2563eb'} style={{ marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
            {uploading ? 'Processing & Uploading...' : 'Click or Drag images here to upload'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Supports JPG, PNG, WEBP up to 5MB each
          </span>
        </label>
      )}

      {uploadError && (
        <div className="alert alert-danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', margin: 0 }}>
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
