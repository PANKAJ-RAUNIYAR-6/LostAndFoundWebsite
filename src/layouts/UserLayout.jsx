import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  Package,
  FileCheck,
  MessageSquare,
  Award,
  Bell,
  Star,
  User,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export const UserLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="lead">Loading your dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Report Lost', path: '/report-lost', icon: PlusCircle },
    { label: 'Report Found', path: '/report-found', icon: Search },
    { label: 'My Lost Items', path: '/my-lost', icon: Package },
    { label: 'My Found Items', path: '/my-found', icon: Package },
    { label: 'Claims', path: '/claims', icon: FileCheck },
    { label: 'Live Chat', path: '/chat', icon: MessageSquare },
    { label: 'Rewards', path: '/rewards', icon: Award },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Feedback & Rating', path: '/feedback', icon: Star },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '1.5rem', marginBottom: '3rem' }}>
        {/* User Summary Header Card */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={user?.name}
              style={{ width: '56px', height: '56px', borderRadius: '9999px', border: '2px solid #ffffff', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0 }}>{user?.name}</h2>
                {user?.isVerified ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem' }}>
                    <ShieldCheck size={14} color="#67e8f9" /> Verified
                  </span>
                ) : (
                  <Link
                    to="/verify-otp"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    <AlertTriangle size={13} /> Verify Email (OTP)
                  </Link>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#bfdbfe', marginTop: '2px' }}>
                {user?.email} &bull; Role: {user?.role?.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Reward Balance
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef08a', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                <Award size={20} /> {user?.rewardPoints || 0} pts
              </div>
            </div>
            <Link to="/report-lost" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#ffffff', color: '#1e40af', fontWeight: 700 }}>
              <PlusCircle size={15} /> Quick Post
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
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
          {navItems.map(item => {
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
                  color: active ? '#ffffff' : '#475569',
                  backgroundColor: active ? '#2563eb' : '#ffffff',
                  border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Child Pages Outlet */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default UserLayout;
