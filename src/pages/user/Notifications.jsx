import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, ShieldAlert, Award, MessageSquare } from 'lucide-react';
import api from '../../services/api.js';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'CHAT': return <MessageSquare size={18} color="#2563eb" />;
      case 'REWARD': return <Award size={18} color="#d97706" />;
      case 'CLAIM': return <ShieldAlert size={18} color="#059669" />;
      default: return <Bell size={18} color="#475569" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={24} color="#2563eb" /> Notifications Feed
          </h2>
          <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
            Stay informed about claim responses, incoming messages, and item matching updates
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleMarkAllRead}
          disabled={notifications.length === 0}
        >
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="lead text-center" style={{ padding: '2rem' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem 1.5rem', color: '#64748b' }}>
            <Bell size={42} style={{ opacity: 0.35, margin: '0 auto 0.75rem' }} />
            <div>You have no notifications at this time.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: n.isRead ? '#ffffff' : '#f0f9ff',
                  border: n.isRead ? '1px solid #e2e8f0' : '1px solid #bae6fd'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '8px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginTop: '2px' }}>
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>{n.title}</div>
                    <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>{n.message}</p>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {n.link && (
                    <Link to={n.link} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      <ExternalLink size={13} /> View
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMarkRead(n._id)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
