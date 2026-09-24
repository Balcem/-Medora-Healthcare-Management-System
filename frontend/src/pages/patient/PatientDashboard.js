import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { appointmentAPI, recordAPI } from '../../services/api';

function StatCard({ icon, label, value, colorClass, to }) {
  const content = (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([appointmentAPI.myAppointments(), recordAPI.patientRecords()])
      .then(([apRes, recRes]) => {
        setAppointments(apRes.data);
        setRecords(recRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a =>
    ['PENDING', 'CONFIRMED'].includes(a.status) &&
    new Date(a.appointmentDate) >= new Date().setHours(0,0,0,0)
  );

  const statusBadge = (s) => <span className={`badge badge-${s.toLowerCase()}`}>{s}</span>;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's your health summary for today</p>
      </div>

      <div className="stats-grid">
        <StatCard
          colorClass="teal"
          value={upcoming.length}
          label="Upcoming Appointments"
          to="/patient/appointments"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          colorClass="blue"
          value={appointments.filter(a => a.status === 'COMPLETED').length}
          label="Completed Visits"
          to="/patient/appointments"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatCard
          colorClass="green"
          value={records.length}
          label="Medical Records"
          to="/patient/records"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard
          colorClass="amber"
          value={appointments.filter(a => a.status === 'CANCELLED').length}
          label="Cancelled"
          to="/patient/appointments"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Appointments</span>
            <Link to="/patient/appointments" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="card-body" style={{ padding: '0 1.5rem' }}>
            {upcoming.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-text">No upcoming appointments</div>
                <Link to="/patient/doctors" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Book Now</Link>
              </div>
            ) : (
              upcoming.slice(0, 4).map(a => (
                <div className="appointment-item" key={a.id}>
                  <div className="appointment-time">
                    <div className="appointment-time-start">{a.startTime?.slice(0,5)}</div>
                    <div className="appointment-time-end">{a.endTime?.slice(0,5)}</div>
                  </div>
                  <div className="appointment-info">
                    <div className="appointment-doctor">Dr. {a.doctorName}</div>
                    <div className="appointment-specialty">{a.specialtyName}</div>
                    <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {statusBadge(a.status)}
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        {new Date(a.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Medical Records */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Medical Records</span>
            <Link to="/patient/records" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="card-body" style={{ padding: '0 1.5rem' }}>
            {records.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">No medical records yet</div>
              </div>
            ) : (
              records.slice(0, 4).map(r => (
                <div key={r.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--gray-900)', fontSize: '0.9rem' }}>{r.diagnosis}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                      {new Date(r.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Dr. {r.doctorName}</div>
                  {r.prescription && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--brand-teal)', marginTop: '0.25rem' }}>
                      💊 {r.prescription.slice(0, 60)}{r.prescription.length > 60 ? '…' : ''}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
