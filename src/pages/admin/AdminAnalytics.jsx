import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import api from '../../services/api.js';

export const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLost: 0,
    totalFound: 0,
    totalResolved: 0,
    activeClaims: 0,
    pendingReports: 0
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          api.getAdminStats(),
          api.getItems({ limit: 100 })
        ]);
        if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
        if (itemsRes.success && itemsRes.items) setItems(itemsRes.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalReports = (stats.totalLost || 0) + (stats.totalFound || 0);
  const recoveryRate = totalReports > 0 ? Math.round(((stats.totalResolved || 0) / totalReports) * 100) : 0;

  // Category counts
  const categoryCounts = {};
  items.forEach((it) => {
    categoryCounts[it.category] = (categoryCounts[it.category] || 0) + 1;
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={24} color="#2563eb" /> System Analytics &amp; Recovery Intelligence
        </h2>
        <p className="lead" style={{ fontSize: '0.9rem', margin: 0 }}>
          Live metrics analyzing return efficiency, lost-to-found balance, and category volume
        </p>
      </div>

      {/* KPI Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Recovery Resolution Rate</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
            {recoveryRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#166534' }}>
            {stats.totalResolved} items recovered out of {totalReports} total reports
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>Active Claims in Pipeline</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>
            {stats.activeClaims}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>
            Claims submitted across all active listings
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fef3c7', borderColor: '#fde68a' }}>
          <div style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>Total Community Members</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
            {stats.totalUsers}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
            Registered active students &amp; staff
          </div>
        </div>
      </div>

      {/* Volume by Category Visualizer */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Volume by Category</h3>

        {Object.keys(categoryCounts).length === 0 ? (
          <p className="text-muted">No items recorded.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {Object.entries(categoryCounts).map(([catName, count]) => {
              const pct = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
              return (
                <div key={catName}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{catName}</span>
                    <span style={{ color: '#64748b' }}>{count} items ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: '#2563eb',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
