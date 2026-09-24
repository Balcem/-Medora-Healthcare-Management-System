import React, { useEffect, useState } from 'react';
import { recordAPI, appointmentAPI } from '../../services/api';

function AddRecordModal({ appointments, onClose, onSuccess }) {
  const [form, setForm] = useState({ patientId: '', appointmentId: '', diagnosis: '', prescription: '', notes: '', visitDate: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }

  // When appointment changes, auto-fill patient
  function onApptChange(e) {
    const apptId = e.target.value;
    const appt = appointments.find(a => String(a.id) === apptId);
    setForm(p => ({ ...p, appointmentId: apptId, patientId: appt ? String(appt.patientId) : p.patientId }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.patientId) { setError('Please select an appointment or enter a patient.'); return; }
    setLoading(true);
    try {
      await recordAPI.create({
        patientId: Number(form.patientId),
        appointmentId: form.appointmentId ? Number(form.appointmentId) : null,
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        notes: form.notes,
        visitDate: form.visitDate,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record');
    } finally { setLoading(false); }
  }

  const completedAppts = appointments.filter(a => ['CONFIRMED', 'COMPLETED'].includes(a.status));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add Medical Record</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form id="record-form" onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Link to Appointment</label>
              <select className="form-input" name="appointmentId" value={form.appointmentId} onChange={onApptChange}>
                <option value="">— Select appointment —</option>
                {completedAppts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.patientName} · {a.appointmentDate} {a.startTime?.slice(0, 5)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Visit Date <span className="required">*</span></label>
                <input className="form-input" type="date" name="visitDate" value={form.visitDate} onChange={onChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Diagnosis <span className="required">*</span></label>
              <textarea className="form-input" name="diagnosis" value={form.diagnosis} onChange={onChange} required rows={3} placeholder="Primary diagnosis…" style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Prescription</label>
              <textarea className="form-input" name="prescription" value={form.prescription} onChange={onChange} rows={2} placeholder="Medications, dosage…" style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Doctor's Notes</label>
              <textarea className="form-input" name="notes" value={form.notes} onChange={onChange} rows={2} placeholder="Additional observations…" style={{ resize: 'vertical' }} />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" form="record-form" type="submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorRecords() {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([recordAPI.doctorRecords(), appointmentAPI.doctorSchedule()])
      .then(([rRes, aRes]) => { setRecords(rRes.data); setAppointments(aRes.data); })
      .finally(() => setLoading(false));
  }, []);

  function handleSuccess() {
    setShowModal(false);
    setSuccess('Medical record saved successfully!');
    setTimeout(() => setSuccess(''), 4000);
    recordAPI.doctorRecords().then(r => setRecords(r.data));
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Medical Records</h1>
          <p className="page-subtitle">Records you have created — {records.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Record</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {records.length === 0 ? (
        <div className="card"><div className="empty-state" style={{ padding: '3rem' }}><div className="empty-state-icon">📋</div><div className="empty-state-text">No records created yet</div></div></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Date</th><th>Patient</th><th>Diagnosis</th><th>Prescription</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(r.visitDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.patientName}</td>
                    <td style={{ maxWidth: 220 }}>{r.diagnosis}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', maxWidth: 160 }}>{r.prescription || '—'}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', maxWidth: 140 }}>{r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <AddRecordModal appointments={appointments} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </div>
  );
}
