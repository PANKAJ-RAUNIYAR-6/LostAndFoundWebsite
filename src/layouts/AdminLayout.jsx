import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Users,
  Search,
  Package,
  FileCheck,
  AlertOctagon,
  Star,
  Award,
  Grid,
  BarChart3,
  Activity,
  Settings,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="lead">Verifying administrator credentials...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: Shield },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Lost Items', path: '/admin/lost', icon: Package },
    { label: 'Found Items', path: '/admin/found', icon: Search },
    { label: 'Claims Moderation', path: '/admin/claims', icon: FileCheck },
    { label: 'Abuse Reports', path: '/admin/abuse-reports', icon: AlertOctagon },
    { label: 'Feedback Moderation', path: '/admin/feedback', icon: Star },
    { label: 'Reward Points', path: '/admin/rewards', icon: Award },
    { label: 'Categories', path: '/admin/categories', icon: Grid },
    { label: 'Audit Trail', path: '/admin/activity', icon: Activity },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '1.5rem', marginBottom: '3rem' }}>
        {/* Admin Header Banner */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 1.75rem',
            border: '1px solid #334155'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: '#dc2626', padding: '10px', borderRadius: '10px', display: 'flex' }}>
              <Shield size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0 }}>Portal Administration Center</h2>
                <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                  Super Admin
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                Full moderation control, analytics, claim verification, and database auditing.
              </p>
            </div>
          </div>

          <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#334155', color: '#ffffff', borderColor: '#475569' }}>
            <ArrowLeft size={15} /> Switch to User View
          </Link>
        </div>

        {/* Admin Navigation Pills */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0.5rem',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          {adminNav.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  color: active ? '#ffffff' : '#334155',
                  backgroundColor: active ? '#0f172a' : '#ffffff',
                  border: active ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Admin Outlet */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
