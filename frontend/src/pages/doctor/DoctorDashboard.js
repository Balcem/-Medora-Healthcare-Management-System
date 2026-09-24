import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, recordAPI } from '../../services/api';
import { useAuth } from '../../utils/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([appointmentAPI.doctorSchedule(), recordAPI.doctorRecords()])
      .then(([aRes, rRes]) => { setAppointments(aRes.data); setRecords(rRes.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointmentDate === today);
  const pending = appointments.filter(a => a.status === 'PENDING');
  const uniquePatients = [...new Set(appointments.map(a => a.patientId))];

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Good {getGreeting()}, Dr. {user?.fullName?.split(' ').slice(-1)[0]} 👨‍⚕️</h1>
        <p className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="stats-grid">
        {[
          { label: "Today's Appointments", value: todayAppts.length, color: 'teal', icon: '📅' },
          { label: 'Pending Review', value: pending.length, color: 'amber', icon: '⏳' },
          { label: 'Total Patients', value: uniquePatients.length, color: 'blue', icon: '👥' },
          { label: 'Records Written', value: records.length, color: 'green', icon: '📋' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`} style={{ fontSize: '1.375rem' }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem' }}>
        {/* Today's schedule */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Today's Schedule</span>
            <Link to="/doctor/schedule" className="btn btn-ghost btn-sm">Full schedule</Link>
          </div>
          <div className="card-body" style={{ padding: '0 1.5rem' }}>
            {todayAppts.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">🗓️</div><div className="empty-state-text">No appointments today</div></div>
            ) : (
              todayAppts.map(a => (
                <div className="appointment-item" key={a.id}>
                  <div className="appointment-time">
                    <div className="appointment-time-start">{a.startTime?.slice(0, 5)}</div>
                    <div className="appointment-time-end">{a.endTime?.slice(0, 5)}</div>
                  </div>
                  <div className="appointment-info">
                    <div className="appointment-doctor">{a.patientName}</div>
                    {a.reason && <div className="appointment-reason">"{a.reason}"</div>}
                    <span className={`badge badge-${a.status.toLowerCase()}`} style={{ marginTop: '0.25rem' }}>{a.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending appointments */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Needs Action</span>
          </div>
          <div className="card-body" style={{ padding: '0 1.5rem' }}>
            {pending.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-text">All caught up!</div></div>
            ) : (
              pending.slice(0, 5).map(a => (
                <div key={a.id} style={{ padding: '0.875rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{a.patientName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.125rem' }}>
                    {new Date(a.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {a.startTime?.slice(0, 5)}
                  </div>
                </div>
              ))
            )}
            {pending.length > 0 && (
              <Link to="/doctor/schedule" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                Manage All
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
