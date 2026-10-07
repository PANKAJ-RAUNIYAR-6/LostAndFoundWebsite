import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const FeedbackRating = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.getFeedbacks();
      if (res.success && res.feedbacks) {
        setFeedbacks(res.feedbacks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback comments.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createFeedback({
        rating,
        comment: comment.trim(),
        targetType: 'PLATFORM'
      });

      if (res.success) {
        setSuccess('Thank you! Your rating and testimonial have been submitted.');
        setComment('');
        fetchFeedbacks();
        setTimeout(() => setSuccess(null), 3500);
      } else {
        setError(res.message || 'Submission failed.');
      }
    } catch (err) {
      setError(err.message || 'Error submitting feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={24} color="#f59e0b" fill="#f59e0b" /> Community Feedback &amp; Ratings
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Rate your experience with item recovery, communication, and help us improve
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Submit Feedback Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Submit Your Rating</h3>

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} /> {success}
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Overall Rating</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star
                      size={28}
                      color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                      fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Your Review &amp; Experience</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="How easy was it to report or claim your belongings? Any suggestions for improvement?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Post Community Feedback'}
            </button>
          </form>
        </div>

        {/* Existing Feedbacks Feed */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Community Reviews ({feedbacks.length})</h3>

          {feedbacks.length === 0 ? (
            <p className="text-muted">No reviews recorded yet. Be the first to share your experience!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '480px', overflowY: 'auto' }}>
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  style={{
                    padding: '0.875rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={fb.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                        alt="User"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {fb.user?.name || 'Community Member'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          color={s <= fb.rating ? '#f59e0b' : '#cbd5e1'}
                          fill={s <= fb.rating ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', fontStyle: 'italic' }}>
                    "{fb.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackRating;
