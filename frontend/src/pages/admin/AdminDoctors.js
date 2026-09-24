import React, { useEffect, useState } from 'react';
import { doctorAPI, specialtyAPI } from '../../services/api';

function AddDoctorModal({ specialties, onClose, onSuccess }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', specialtyId: '', licenseNumber: '', bio: '', experienceYears: '', consultationFee: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await doctorAPI.create({
        ...form,
        specialtyId: Number(form.specialtyId),
        experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
        consultationFee: form.consultationFee ? Number(form.consultationFee) : 0,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.email || err.response?.data?.message || 'Failed to create doctor');
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <span className="modal-title">Onboard New Doctor</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form id="doctor-form" onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name <span className="required">*</span></label>
                <input className="form-input" name="firstName" value={form.firstName} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name <span className="required">*</span></label>
                <input className="form-input" name="lastName" value={form.lastName} onChange={onChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input className="form-input" type="password" name="password" value={form.password} onChange={onChange} required minLength={6} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Specialty <span className="required">*</span></label>
                <select className="form-input" name="specialtyId" value={form.specialtyId} onChange={onChange} required>
                  <option value="">Select specialty</option>
                  {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">License Number <span className="required">*</span></label>
                <input className="form-input" name="licenseNumber" value={form.licenseNumber} onChange={onChange} required placeholder="MD-XXX-001" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input className="form-input" type="number" name="experienceYears" value={form.experienceYears} onChange={onChange} min={0} max={60} />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee ($)</label>
                <input className="form-input" type="number" name="consultationFee" value={form.consultationFee} onChange={onChange} min={0} step="0.01" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={onChange} placeholder="+1-555-0100" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" name="bio" value={form.bio} onChange={onChange} rows={3} placeholder="Brief professional biography…" style={{ resize: 'vertical' }} />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="doctor-form" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Create Doctor'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([doctorAPI.adminGetAll(), specialtyAPI.getAll()])
      .then(([dRes, sRes]) => { setDoctors(dRes.data); setSpecialties(sRes.data); })
      .finally(() => setLoading(false));
  }, []);

  function handleSuccess() {
    setShowModal(false);
    setSuccess('Doctor account created successfully!');
    setTimeout(() => setSuccess(''), 4000);
    doctorAPI.adminGetAll().then(r => setDoctors(r.data));
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">{doctors.length} registered doctors</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Doctor</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="doctor-grid">
        {doctors.map(doc => (
          <div className="doctor-card" key={doc.id}>
            <div className="doctor-avatar">{doc.firstName?.[0]}{doc.lastName?.[0]}</div>
            <div className="doctor-name">Dr. {doc.firstName} {doc.lastName}</div>
            <div className="doctor-specialty">{doc.specialtyName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>{doc.email}</div>
            <div className="doctor-meta">
              {doc.experienceYears > 0 && <span>🏥 {doc.experienceYears} yrs</span>}
              {doc.consultationFee && <span>💲{doc.consultationFee}</span>}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
              License: {doc.licenseNumber}
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <div className="card" style={{ gridColumn: '1/-1', padding: '3rem' }}>
            <div className="empty-state"><div className="empty-state-icon">🏥</div><div className="empty-state-text">No doctors yet — add one!</div></div>
          </div>
        )}
      </div>

      {showModal && <AddDoctorModal specialties={specialties} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </div>
  );
}
