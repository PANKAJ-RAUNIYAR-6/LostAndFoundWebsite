import React from 'react';
import { Compass, ShieldCheck, CheckCircle2, MapPin, Database, Award, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="container" style={{ maxWidth: '900px', padding: '2rem 1rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>About FindIt Lost &amp; Found</h1>
        <p className="lead" style={{ maxWidth: '700px', margin: '0 auto' }}>
          A full-stack, centralized digital solution engineered to replace manual paperwork with verified, real-time recovery.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Introduction & Problem Statement */}
        <div className="card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#1e293b' }}>Problem Statement &amp; Motivation</h2>
          <p style={{ lineHeight: 1.7, color: '#475569', margin: 0 }}>
            Traditional lost-and-found management relies heavily on disconnected physical noticeboards, manual logbooks, or informal social media groups. This lack of centralized record-keeping leads to painful delays, loss of valuable assets, poor verification of ownership claims, and high administrative overhead for campuses, transit hubs, and commercial centers.
          </p>
        </div>

        {/* Objectives */}
        <div className="card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1e293b' }}>Project Objectives</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Centralized Platform</strong>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Single portal for registering both lost belongings and recovered found items.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Mapbox Spatial Geocoding</strong>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Interactive map pin placement for exact latitude & longitude tracking.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Real-Time Coordination</strong>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Instant Socket.IO messaging directly between owners and finders.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Verified Ownership Claims</strong>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Cryptographic evidence, serial keys, and photo proof review before recovery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: '#1e293b' }}>Architecture &amp; Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>Frontend</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>React.js (JavaScript / JSX), Vite, React Router, Standard CSS</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>Backend</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Node.js, Express.js REST API, JWT Authentication, BCrypt</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>Database</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>MongoDB, Mongoose ORM, Embedded Resilient Storage</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '4px' }}>Maps &amp; Real-Time</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Mapbox GL JS, Socket.IO WebSocket Engine, Cloudinary, Nodemailer</div>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="card" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e40af', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} /> Recommended Safe Handover Protocol
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6 }}>
            <li>Always arrange handovers in well-lit, public locations (e.g. campus library desk or department lobby).</li>
            <li>Inspect the claimant's ID and match unique serial numbers or receipt photos before handing over high-value electronics.</li>
            <li>Never pay upfront recovery fees to unverified claimants.</li>
            <li>Report suspicious posts immediately using the "Report Abuse" feature.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
