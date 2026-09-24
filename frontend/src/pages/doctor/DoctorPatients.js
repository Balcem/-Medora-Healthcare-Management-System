import React, { useEffect, useState } from 'react';
import { appointmentAPI } from '../../services/api';

export default function DoctorPatients() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.doctorSchedule()
      .then(r => setAppointments(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Deduplicate patients
  const patientsMap = {};
  appointments.forEach(a => {
    if (!patientsMap[a.patientId]) {
      patientsMap[a.patientId] = {
        id: a.patientId,
        name: a.patientName,
        visits: 0,
        lastVisit: a.appointmentDate,
        statuses: [],
      };
    }
    patientsMap[a.patientId].visits++;
    patientsMap[a.patientId].statuses.push(a.status);
    if (a.appointmentDate > patientsMap[a.patientId].lastVisit) {
      patientsMap[a.patientId].lastVisit = a.appointmentDate;
    }
  });
  const patients = Object.values(patientsMap);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Patients</h1>
        <p className="page-subtitle">{patients.length} unique patients</p>
      </div>

      {patients.length === 0 ? (
        <div className="card"><div className="empty-state" style={{ padding: '3rem' }}><div className="empty-state-icon">👥</div><div className="empty-state-text">No patients yet</div></div></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Patient</th><th>Total Visits</th><th>Last Visit</th><th>Appointment Status</th></tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-teal-lt)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                          {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.visits}</td>
                    <td>{new Date(p.lastVisit + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {[...new Set(p.statuses)].map(s => (
                          <span key={s} className={`badge badge-${s.toLowerCase()}`}>{s}</span>
                        ))}
                      </div>
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
