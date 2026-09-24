import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(r => setAnalytics(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const stats = [
    { label: 'Total Users', value: analytics?.totalUsers ?? 0, color: 'teal', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { label: 'Doctors', value: analytics?.totalDoctors ?? 0, color: 'green', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M12 14c-5 0-9 2.5-9 4v1h18v-1c0-1.5-4-4-9-4z"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="10" y1="19" x2="14" y2="19"/></svg>
    )},
    { label: 'Patients', value: analytics?.totalPatients ?? 0, color: 'blue', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    )},
    { label: 'Total Appointments', value: analytics?.totalAppointments ?? 0, color: 'amber', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    )},
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System overview and management centre</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Today highlight */}
      <div className="card" style={{ marginTop: '0.5rem' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              📊
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>TODAY'S APPOINTMENTS</div>
              <div style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.1 }}>
                {analytics?.todayAppointments ?? 0}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: '1px solid var(--gray-200)', paddingLeft: '2rem' }}>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Medora is running smoothly. Use the sidebar to manage <strong>users</strong>, onboard new <strong>doctors</strong>, and review <strong>appointments</strong> across the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
        {[
          { label: 'Manage Users', desc: 'View and control all user accounts', href: '/admin/users', emoji: '👤' },
          { label: 'Onboard Doctor', desc: 'Add a new doctor to the system', href: '/admin/doctors', emoji: '🏥' },
          { label: 'All Appointments', desc: 'Review system-wide scheduling', href: '/admin/appointments', emoji: '📅' },
        ].map(link => (
          <a key={link.label} href={link.href} className="card" style={{ padding: '1.25rem', display: 'block', transition: 'box-shadow 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.625rem' }}>{link.emoji}</div>
            <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>{link.label}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{link.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
