import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FileCheck,
  Award,
  Bell,
  MessageSquare,
  PlusCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../services/api.js';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [claims, setClaims] = useState({ claimsMade: [], claimsReceived: [] });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [itemsRes, claimsRes, notifsRes] = await Promise.all([
          api.getMyItems().catch(() => ({ items: [] })),
          api.getMyClaims().catch(() => ({ claimsMade: [], claimsReceived: [] })),
          api.getNotifications().catch(() => ({ notifications: [] }))
        ]);

        if (itemsRes.items) setMyItems(itemsRes.items);
        if (claimsRes.claimsMade) setClaims(claimsRes);
        if (notifsRes.notifications) setNotifications(notifsRes.notifications.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const lostCount = myItems.filter(i => i.type === 'LOST').length;
  const foundCount = myItems.filter(i => i.type === 'FOUND').length;
  const pendingReceivedClaims = claims.claimsReceived.filter(c => c.status === 'PENDING').length;

  return (
    <div>
      {/* Top Stat Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '10px' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{lostCount}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>My Lost Reports</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '12px', borderRadius: '10px' }}>
            <Search size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{foundCount}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>My Found Reports</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '12px', borderRadius: '10px' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingReceivedClaims}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Pending Claims on My Items</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '12px', borderRadius: '10px' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.rewardPoints || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Reward Points Earned</div>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Quick Actions & My Recent Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link to="/report-lost" className="btn btn-outline-primary" style={{ padding: '0.875rem', justifyContent: 'flex-start' }}>
                <PlusCircle size={18} color="#ef4444" /> Report Lost Item
              </Link>
              <Link to="/report-found" className="btn btn-outline-primary" style={{ padding: '0.875rem', justifyContent: 'flex-start' }}>
                <CheckCircle2 size={18} color="#10b981" /> Report Found Item
              </Link>
              <Link to="/chat" className="btn btn-secondary" style={{ padding: '0.875rem', justifyContent: 'flex-start' }}>
                <MessageSquare size={18} color="#2563eb" /> Real-Time Chat
              </Link>
              <Link to="/claims" className="btn btn-secondary" style={{ padding: '0.875rem', justifyContent: 'flex-start' }}>
                <FileCheck size={18} color="#f59e0b" /> Manage Claims
              </Link>
            </div>
          </div>

          {/* My Recent Reports */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>My Recent Listings</h3>
              <Link to="/my-lost" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>View All</Link>
            </div>

            {myItems.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>
                You haven't reported any lost or found items yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myItems.slice(0, 4).map((it) => (
                  <div
                    key={it._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`badge ${it.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                        {it.type}
                      </span>
                      <div>
                        <Link to={`/item/${it._id}`} style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                          {it.title}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{it.location}</div>
                      </div>
                    </div>
                    <span className="badge badge-verified">{it.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & Claims Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recent In-App Alerts */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="#2563eb" /> Recent Notifications
              </h3>
              <Link to="/notifications" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>See All</Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>No recent alerts.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      backgroundColor: n.isRead ? '#ffffff' : '#eff6ff',
                      border: n.isRead ? '1px solid #e2e8f0' : '1px solid #bfdbfe'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{n.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>{n.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Claims Banner if any */}
          {pendingReceivedClaims > 0 && (
            <div
              className="card"
              style={{
                backgroundColor: '#fffbeb',
                borderColor: '#fde68a',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <h4 style={{ color: '#92400e', margin: 0, fontSize: '1rem' }}>Attention: Action Required</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350f' }}>
                You have {pendingReceivedClaims} pending ownership claim(s) waiting for verification on your reported items.
              </p>
              <Link to="/claims" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                Review Claim Requests <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
