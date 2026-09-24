import React, { useEffect, useState } from 'react';
import { appointmentAPI } from '../../services/api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    appointmentAPI.adminGetAll()
      .then(r => setAppointments(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter(a => {
    const matchStatus = filter === 'ALL' || a.status === filter;
    const matchSearch = !search || a.patientName?.toLowerCase().includes(search.toLowerCase()) || a.doctorName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {};
  ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].forEach(s => {
    counts[s] = s === 'ALL' ? appointments.length : appointments.filter(a => a.status === s).length;
  });

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All Appointments</h1>
        <p className="page-subtitle">{appointments.length} total appointments across the system</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-input" style={{ maxWidth: 280 }} placeholder="Search patient or doctor…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(s)}>
              {s} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Specialty</th><th>Date</th><th>Time</th><th>Status</th><th>Reason</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.patientName}</td>
                  <td>Dr. {a.doctorName}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{a.specialtyName}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(a.appointmentDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}
                  </td>
                  <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', maxWidth: 180 }}>
                    {a.reason ? a.reason.slice(0, 50) + (a.reason.length > 50 ? '…' : '') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '2.5rem' }}>
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-text">No appointments found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
