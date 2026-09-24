import React, { useEffect, useState } from 'react';
import { appointmentAPI } from '../../services/api';

const STATUS_OPTIONS = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function DoctorSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchSchedule(); }, []);

  async function fetchSchedule() {
    try {
      const { data } = await appointmentAPI.doctorSchedule();
      setAppointments(data);
    } finally { setLoading(false); }
  }

  async function updateStatus(id, status) {
    setUpdating(id);
    try {
      const { data } = await appointmentAPI.updateStatus(id, { status });
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed');
    } finally { setUpdating(null); }
  }

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  // Group by date
  const grouped = filtered.reduce((acc, a) => {
    const key = a.appointmentDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Schedule</h1>
        <p className="page-subtitle">{appointments.length} total appointments</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {sortedDates.length === 0 ? (
        <div className="card"><div className="empty-state" style={{ padding: '3rem' }}><div className="empty-state-icon">🗓️</div><div className="empty-state-text">No appointments found</div></div></div>
      ) : (
        sortedDates.map(date => (
          <div key={date} style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              {date === new Date().toISOString().split('T')[0] && (
                <span className="badge" style={{ background: 'var(--brand-teal-lt)', color: 'var(--brand-teal)', marginLeft: '0.5rem' }}>Today</span>
              )}
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Time</th><th>Patient</th><th>Reason</th><th>Status</th><th>Notes</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {grouped[date].map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                          {a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{a.patientName}</div>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', maxWidth: 180 }}>
                          {a.reason || '—'}
                        </td>
                        <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', maxWidth: 160 }}>
                          {a.notes || '—'}
                        </td>
                        <td>
                          {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                              {STATUS_OPTIONS.filter(s => s !== a.status).map(s => (
                                <button key={s} className="btn btn-sm btn-outline"
                                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                  disabled={updating === a.id}
                                  onClick={() => updateStatus(a.id, s)}>
                                  {s === 'CONFIRMED' ? '✓' : s === 'COMPLETED' ? '✅' : '✕'} {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
