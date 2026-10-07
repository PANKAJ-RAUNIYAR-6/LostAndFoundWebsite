import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  MapPin,
  MessageSquare,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Package,
  Sparkles,
  Star
} from 'lucide-react';
import ItemGrid from '../../components/items/ItemGrid.jsx';
import api from '../../services/api.js';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 3, totalLost: 2, totalFound: 2, totalResolved: 1 });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catsRes, lostRes, foundRes, statsRes, fbRes] = await Promise.all([
          api.getCategories().catch(() => ({ categories: [] })),
          api.getItems({ type: 'LOST', limit: 4 }).catch(() => ({ items: [] })),
          api.getItems({ type: 'FOUND', limit: 4 }).catch(() => ({ items: [] })),
          api.getAdminStats().catch(() => ({ stats: {} })),
          api.getFeedbacks().catch(() => ({ feedbacks: [] }))
        ]);

        if (catsRes.categories) setCategories(catsRes.categories);
        if (lostRes.items) setRecentLost(lostRes.items);
        if (foundRes.items) setRecentFound(foundRes.items);
        if (statsRes.stats) setStats(prev => ({ ...prev, ...statsRes.stats }));
        if (fbRes.feedbacks) setFeedbacks(fbRes.feedbacks.slice(0, 3));
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    navigate(`/lost?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '4rem 0 3.5rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={15} /> Real-Time MERN & Mapbox Lost & Found Network
          </div>

          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {t('heroTitle')}
          </h1>

          <p className="lead" style={{ maxWidth: '720px', margin: '0 auto 2.25rem', fontSize: '1.15rem' }}>
            {t('heroSubtitle')}
          </p>

          {/* Quick Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <Link to="/report-lost" className="btn btn-danger btn-lg">
              <PlusCircle size={20} /> {t('reportLostBtn')}
            </Link>
            <Link to="/report-found" className="btn btn-success btn-lg">
              <CheckCircle2 size={20} /> {t('reportFoundBtn')}
            </Link>
          </div>

          {/* Unified Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              backgroundColor: '#f8fafc',
              padding: '0.625rem',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', paddingLeft: '0.5rem' }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'none', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#334155'
              }}
            >
              <option value="All">{t('allCategories')}</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
              {t('searchBtn')}
            </button>
          </form>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '2rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{stats.totalLost}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Lost Items Reported</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats.totalFound}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Found Items Registered</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{stats.totalResolved}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Returned to Rightful Owners</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>{stats.totalUsers}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Active Community Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Lost Items */}
      <section className="container" style={{ padding: '3.5rem 1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#b91c1c' }}>Recently Reported Lost Items</h2>
            <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>Can you recognize any of these lost belongings?</p>
          </div>
          <Link to="/lost" className="btn btn-outline-primary btn-sm">
            View All Lost Items <ArrowRight size={14} />
          </Link>
        </div>
        <ItemGrid items={recentLost} loading={loading} />
      </section>

      {/* Recent Found Items */}
      <section className="container" style={{ padding: '2rem 1.25rem 3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#047857' }}>Recently Recovered Found Items</h2>
            <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>Items safely handed over or waiting to be claimed.</p>
          </div>
          <Link to="/found" className="btn btn-outline-primary btn-sm">
            View All Found Items <ArrowRight size={14} />
          </Link>
        </div>
        <ItemGrid items={recentFound} loading={loading} />
      </section>

      {/* How It Works Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '3.5rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>How FindIt Solves Lost Belongings</h2>
            <p className="lead" style={{ fontSize: '1rem' }}>
              A verifiable 4-step recovery pipeline designed specifically to replace paper logs with digital trust.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <PlusCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1. Report Item</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Upload photos, specify description, and select the exact campus location using the Mapbox interactive map picker.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>2. Search & Match</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Filter listings by category, keywords, date, and geolocation to quickly discover potential matches.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3. Verified Claim Proof</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Submit ownership proof (serial keys, lockscreen photos, unique marks). The finder or administrator reviews the evidence.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>4. Safe Return & Rewards</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Chat safely via Socket.IO to coordinate handover. Earn real reward points on every verified recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      {feedbacks.length > 0 && (
        <section className="container" style={{ padding: '3.5rem 1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Community Experiences & Ratings</h2>
            <p className="lead" style={{ fontSize: '0.95rem' }}>What students and staff say about our platform.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {feedbacks.map((fb) => (
              <div key={fb._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      color={star <= fb.rating ? '#f59e0b' : '#cbd5e1'}
                      fill={star <= fb.rating ? '#f59e0b' : 'none'}
                    />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', margin: 0 }}>
                  "{fb.comment}"
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={fb.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={fb.user?.name || 'User'}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                    {fb.user?.name || 'Anonymous User'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/feedback" className="btn btn-outline-primary btn-sm">
              Read All Feedback or Submit Your Experience
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
