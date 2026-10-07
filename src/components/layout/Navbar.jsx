import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  MessageSquare,
  Bell,
  Award,
  User,
  Shield,
  LogOut,
  Globe,
  Menu,
  X,
  Compass,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import api from '../../services/api.js';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      api.getNotifications()
        .then(res => {
          if (res.success && res.notifications) {
            const unread = res.notifications.filter(n => !n.isRead).length;
            setUnreadNotifs(unread);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: 8,
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Compass size={22} />
          </div>

          <span>
            Find<span style={{ color: '#0f172a' }}>It</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>

          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/')}`}
              onClick={closeMobileMenu}
            >
              {t('navHome')}
            </Link>
          </li>

          <li>
            <Link
              to="/lost"
              className={`nav-link ${isActive('/lost')}`}
              onClick={closeMobileMenu}
            >
              {t('navLostItems')}
            </Link>
          </li>

          <li>
            <Link
              to="/found"
              className={`nav-link ${isActive('/found')}`}
              onClick={closeMobileMenu}
            >
              {t('navFoundItems')}
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about')}`}
              onClick={closeMobileMenu}
            >
              {t('navAbout')}
            </Link>
          </li>

          {isAuthenticated && (
            <li>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard')}`}
                onClick={closeMobileMenu}
              >
                {t('navDashboard')}
              </Link>
            </li>
          )}

          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin')}`}
                style={{
                  color: '#b91c1c',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                onClick={closeMobileMenu}
              >
                <Shield size={16} />
                {t('navAdmin')}
              </Link>
            </li>
          )}

          {/* MOBILE REPORT BUTTON */}
          {isAuthenticated && (
            <li className="mobile-report-item">
              <Link
                to="/report-lost"
                className="btn btn-primary btn-sm mobile-report-btn"
                onClick={closeMobileMenu}
              >
                <PlusCircle size={15} />
                Report
              </Link>
            </li>
          )}
        </ul>

        {/* Action Buttons & Profile */}
        <div className="navbar-actions">

          {/* Language Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#f1f5f9',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px'
            }}
          >
            <Globe size={15} color="#64748b" />

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none'
              }}
              aria-label="Choose interface language"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {isAuthenticated ? (
            <>
              {/* DESKTOP REPORT BUTTON */}
              <Link
                to="/report-lost"
                className="btn btn-primary btn-sm desktop-report-btn"
              >
                <PlusCircle size={15} />
                Report
              </Link>

              {/* Chat Button */}
              <Link
                to="/chat"
                className="btn btn-secondary btn-sm"
                style={{
                  position: 'relative',
                  padding: '0.375rem 0.625rem'
                }}
                title="Real-Time Messages"
              >
                <MessageSquare size={17} />
              </Link>

              {/* Notifications Button */}
              <Link
                to="/notifications"
                className="btn btn-secondary btn-sm"
                style={{
                  position: 'relative',
                  padding: '0.375rem 0.625rem'
                }}
                title="Notifications"
              >
                <Bell size={17} />

                {unreadNotifs > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      minWidth: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px'
                    }}
                  >
                    {unreadNotifs}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div
                className="desktop-user-dropdown"
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setUserDropdownOpen(!userDropdownOpen)
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.625rem',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={
                      user?.profileImage ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={user?.name || 'User'}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      objectFit: 'cover'
                    }}
                  />

                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      backgroundColor: '#ffffff',
                      boxShadow:
                        '0 10px 25px -5px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      width: '210px',
                      zIndex: 100,
                      padding: '0.5rem 0'
                    }}
                  >
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}
                      >
                        {user?.name}
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b'
                        }}
                      >
                        {user?.email}
                      </div>

                      <div
                        style={{
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: '#d97706',
                          fontWeight: 600
                        }}
                      >
                        <Award size={13} />
                        {user?.rewardPoints || 0} Reward Pts
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      className="nav-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem'
                      }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} />
                      {t('navDashboard')}
                    </Link>

                    <Link
                      to="/claims"
                      className="nav-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem'
                      }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FileCheck size={16} />
                      {t('navClaims')}
                    </Link>

                    <Link
                      to="/rewards"
                      className="nav-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem'
                      }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Award size={16} />
                      {t('navRewards')}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="nav-link"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          color: '#b91c1c'
                        }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Shield size={16} />
                        Admin Console
                      </Link>
                    )}

                    <div
                      style={{
                        borderTop: '1px solid #f1f5f9',
                        margin: '0.25rem 0'
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <LogOut size={16} />
                      {t('navLogout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="desktop-auth-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
              >
                {t('navLogin')}
              </Link>

              <Link
                to="/register"
                className="btn btn-primary btn-sm"
              >
                {t('navRegister')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;