import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(id) {
    try {
      const { data } = await adminAPI.toggleUser(id);
      setUsers(prev => prev.map(u => u.id === id ? data : u));
    } catch (e) { alert('Failed to update user status'); }
  }

  async function deleteUser(id, name) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) { alert('Failed to delete user'); }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">{users.length} registered users</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 320 }} placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
        {['ALL', 'PATIENT', 'DOCTOR', 'ADMIN'].map(r => (
          <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setRoleFilter(r)}>{r}</button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand-teal-lt)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{u.phone || '—'}</td>
                  <td>
                    <span className={`badge`} style={{ background: u.active ? '#ecfdf5' : '#fef2f2', color: u.active ? '#065f46' : '#991b1b' }}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button className="btn btn-sm btn-outline" onClick={() => toggle(u.id)}>
                        {u.active ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id, `${u.firstName} ${u.lastName}`)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '2.5rem' }}>
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-text">No users match your search</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
