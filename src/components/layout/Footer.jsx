import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: '#2563eb', padding: '4px', borderRadius: '6px', display: 'flex' }}>
                <Compass size={20} color="#fff" />
              </div>
              FindIt Lost & Found
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Bridging the gap between losers and finders with verified ownership claims, Mapbox geolocation, and real-time chat.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#10b981' }}>
              <ShieldCheck size={16} /> Verified Security & Privacy Protocol
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/">{t('navHome')}</Link></li>
              <li><Link to="/lost">{t('navLostItems')}</Link></li>
              <li><Link to="/found">{t('navFoundItems')}</Link></li>
              <li><Link to="/report-lost">{t('navReportLost')}</Link></li>
              <li><Link to="/report-found">{t('navReportFound')}</Link></li>
              <li><Link to="/about">{t('navAbout')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Community & Safety
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/feedback">Community Reviews & Rating</Link></li>
              <li><Link to="/rewards">Reward Points System</Link></li>
              <li><Link to="/about">Safe Handover Guidelines</Link></li>
              <li><span style={{ color: '#94a3b8' }}>Mapbox Spatial Geocoding</span></li>
              <li><span style={{ color: '#94a3b8' }}>Socket.IO Real-time Engine</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Support & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#3b82f6" /> support@findit.org
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#3b82f6" /> +1 (800) 555-LOST
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#3b82f6" /> Campus Center Desk #102
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.8125rem' }}>
          <div>
            &copy; {new Date().getFullYear()} FindIt Full-Stack Lost & Found. Built with MERN Stack + Mapbox + Socket.IO.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Powered with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>for Community Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
