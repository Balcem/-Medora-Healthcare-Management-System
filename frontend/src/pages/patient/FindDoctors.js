import React, { useEffect, useState } from 'react';
import { doctorAPI, specialtyAPI, appointmentAPI } from '../../services/api';

function BookingModal({ doctor, onClose, onSuccess }) {
  const [form, setForm] = useState({ appointmentDate: '', startTime: '09:00', endTime: '09:30', reason: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentAPI.book({
        doctorId: doctor.id,
        appointmentDate: form.appointmentDate,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00',
        reason: form.reason,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Slot may already be taken.');
    } finally { setLoading(false); }
  }

  const timeSlots = [];
  for (let h = 8; h < 18; h++) {
    for (let m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      timeSlots.push(`${hh}:${mm}`);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Book Appointment</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Doctor summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', background: 'var(--brand-teal-lt)', borderRadius: 'var(--radius)', marginBottom: '1.25rem' }}>
            <div className="doctor-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>
              {doctor.firstName[0]}{doctor.lastName[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Dr. {doctor.firstName} {doctor.lastName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--brand-teal)' }}>{doctor.specialtyName}</div>
              {doctor.consultationFee && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Fee: ${doctor.consultationFee}</div>
              )}
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form id="book-form" onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Date <span className="required">*</span></label>
              <input className="form-input" type="date" name="appointmentDate" min={today}
                value={form.appointmentDate} onChange={onChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time <span className="required">*</span></label>
                <select className="form-input" name="startTime" value={form.startTime} onChange={onChange} required>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">End Time <span className="required">*</span></label>
                <select className="form-input" name="endTime" value={form.endTime} onChange={onChange} required>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Visit</label>
              <textarea className="form-input" name="reason" value={form.reason} onChange={onChange}
                rows={3} placeholder="Describe your symptoms or reason…" style={{ resize: 'vertical' }} />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="book-form" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filter, setFilter] = useState({ search: '', specialtyId: '' });
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([doctorAPI.getAll(), specialtyAPI.getAll()])
      .then(([dRes, sRes]) => { setDoctors(dRes.data); setSpecialties(sRes.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d => {
    const name = `${d.firstName} ${d.lastName}`.toLowerCase();
    const matchSearch = !filter.search || name.includes(filter.search.toLowerCase()) || d.specialtyName?.toLowerCase().includes(filter.search.toLowerCase());
    const matchSpec = !filter.specialtyId || String(d.specialtyId) === String(filter.specialtyId);
    return matchSearch && matchSpec;
  });

  function handleBookingSuccess() {
    setSelected(null);
    setSuccess('Appointment booked successfully! Check your appointments page.');
    setTimeout(() => setSuccess(''), 5000);
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Find a Doctor</h1>
        <p className="page-subtitle">Browse our specialists and book your appointment</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          className="form-input" style={{ maxWidth: 320 }}
          placeholder="Search by name or specialty…"
          value={filter.search}
          onChange={e => setFilter(p => ({ ...p, search: e.target.value }))}
        />
        <select className="form-input" style={{ maxWidth: 220 }}
          value={filter.specialtyId}
          onChange={e => setFilter(p => ({ ...p, specialtyId: e.target.value }))}>
          <option value="">All Specialties</option>
          {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card" style={{ padding: '3rem' }}>
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No doctors found for your search</div>
        </div>
      ) : (
        <div className="doctor-grid">
          {filtered.map(doc => (
            <div className="doctor-card" key={doc.id}>
              <div className="doctor-avatar">{doc.firstName?.[0]}{doc.lastName?.[0]}</div>
              <div className="doctor-name">Dr. {doc.firstName} {doc.lastName}</div>
              <div className="doctor-specialty">{doc.specialtyName}</div>
              {doc.bio && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                  {doc.bio.slice(0, 100)}{doc.bio.length > 100 ? '…' : ''}
                </p>
              )}
              <div className="doctor-meta">
                {doc.experienceYears > 0 && <span>🏥 {doc.experienceYears} yrs exp.</span>}
                {doc.consultationFee && <span>💲{doc.consultationFee}</span>}
              </div>
              <div className="doctor-card-actions">
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}
                  onClick={() => setSelected(doc)}>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal doctor={selected} onClose={() => setSelected(null)} onSuccess={handleBookingSuccess} />
      )}
    </div>
  );
}
