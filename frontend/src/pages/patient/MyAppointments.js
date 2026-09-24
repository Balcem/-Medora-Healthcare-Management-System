import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchAppointments(); }, []);

  async function fetchAppointments() {
    try {
      const { data } = await appointmentAPI.myAppointments();
      setAppointments(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function cancel(id) {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      await appointmentAPI.cancel(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch (e) {
      alert(e.response?.data?.message || 'Could not cancel appointment');
    } finally { setCancelling(null); }
  }

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  const counts = {};
  statuses.forEach(s => {
    counts[s] = s === 'ALL' ? appointments.length : appointments.filter(a => a.status === s).length;
  });

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">Manage all your scheduled visits</p>
        </div>
        <Link to="/patient/doctors" className="btn btn-primary">+ Book New</Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}>
            {s} {counts[s] > 0 && <span style={{ opacity: 0.75 }}>({counts[s]})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No {filter !== 'ALL' ? filter.toLowerCase() : ''} appointments</div>
            <Link to="/patient/doctors" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Find a Doctor</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>Dr. {a.doctorName}</div>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{a.specialtyName}</td>
                    <td>
                      {new Date(a.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                      {a.startTime?.slice(0, 5)} – {a.endTime?.slice(0, 5)}
                    </td>
                    <td>
                      <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                      {a.reason ? a.reason.slice(0, 40) + (a.reason.length > 40 ? '…' : '') : '—'}
                    </td>
                    <td>
                      {['PENDING', 'CONFIRMED'].includes(a.status) && (
                        <button className="btn btn-sm btn-danger"
                          disabled={cancelling === a.id}
                          onClick={() => cancel(a.id)}>
                          {cancelling === a.id ? '…' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
