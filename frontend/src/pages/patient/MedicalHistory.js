import React, { useEffect, useState } from 'react';
import { recordAPI } from '../../services/api';

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    recordAPI.patientRecords()
      .then(r => setRecords(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Medical History</h1>
        <p className="page-subtitle">Your complete health record — {records.length} entries</p>
      </div>

      {records.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No medical records on file yet</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {records.map(r => (
            <div key={r.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Header row */}
              <div
                style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 'var(--radius)', background: 'var(--brand-teal-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                    🩺
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{r.diagnosis}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.125rem' }}>
                      Dr. {r.doctorName} &bull;{' '}
                      {new Date(r.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"
                  style={{ transform: expanded === r.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Expanded detail */}
              {expanded === r.id && (
                <div style={{ borderTop: '1px solid var(--gray-100)', padding: '1.25rem 1.5rem', background: 'var(--gray-50)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)', marginBottom: '0.5rem' }}>
                        Diagnosis
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>{r.diagnosis}</p>
                    </div>
                    {r.prescription && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)', marginBottom: '0.5rem' }}>
                          Prescription
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>💊 {r.prescription}</p>
                      </div>
                    )}
                    {r.notes && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)', marginBottom: '0.5rem' }}>
                          Doctor's Notes
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.6, fontStyle: 'italic' }}>{r.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
