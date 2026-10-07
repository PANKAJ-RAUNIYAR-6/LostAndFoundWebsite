import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, RotateCcw, CheckCircle2 } from 'lucide-react';
import ItemGrid from '../../components/items/ItemGrid.jsx';
import api from '../../services/api.js';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const FoundItems = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [date, setDate] = useState(searchParams.get('date') || '');

  useEffect(() => {
    api.getCategories().then(res => {
      if (res.categories) setCategories(res.categories);
    }).catch(() => {});
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {
        type: 'FOUND',
        page: 1,
        limit: 24
      };
      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (status && status !== 'All') params.status = status;
      if (date) params.date = date;

      const res = await api.getItems(params);
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Fetch found items error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, status, date]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setDate('');
    setSearchParams({});
    api.getItems({ type: 'FOUND', limit: 24 }).then(res => {
      if (res.items) setItems(res.items);
    });
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#047857', margin: 0 }}>
            {t('navFoundItems')}
          </h1>
          <p className="lead" style={{ fontSize: '0.95rem', margin: '0.25rem 0 0' }}>
            Browse recovered belongings handed over by good samaritans awaiting rightful owners.
          </p>
        </div>

        <Link to="/report-found" className="btn btn-success">
          <CheckCircle2 size={17} /> {t('reportFoundBtn')}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Keyword</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title, description, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('category')}</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">{t('allCategories')}</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('status')}</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">{t('allStatuses')}</option>
              <option value="OPEN">Available / Unclaimed</option>
              <option value="CLAIM_PENDING">Claim Under Review</option>
              <option value="RESOLVED">Returned to Owner</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date Found</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Search size={16} /> Filter
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset} title="Reset filters">
              <RotateCcw size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Grid */}
      <ItemGrid items={items} loading={loading} />
    </div>
  );
};

export default FoundItems;
