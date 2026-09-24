import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { MedoraLogo } from '../../assets/MedoraLogo';

const icons = {
  dashboard: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  calendar: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  users: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  record: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  ),
  doctors: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/>
      <path d="M12 14c-5 0-9 2.5-9 4v1h18v-1c0-1.5-4-4-9-4z"/>
      <line x1="12" y1="17" x2="12" y2="21"/><line x1="10" y1="19" x2="14" y2="19"/>
    </svg>
  ),
  chart: (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  logout: (
    <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const navConfig = {
  PATIENT: [
    { to: '/patient/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { to: '/patient/doctors',   label: 'Find Doctors', icon: icons.doctors },
    { to: '/patient/appointments', label: 'Appointments', icon: icons.calendar },
    { to: '/patient/records',   label: 'Medical History', icon: icons.record },
  ],
  DOCTOR: [
    { to: '/doctor/dashboard',  label: 'Dashboard', icon: icons.dashboard },
    { to: '/doctor/schedule',   label: 'My Schedule', icon: icons.calendar },
    { to: '/doctor/patients',   label: 'Patients', icon: icons.users },
    { to: '/doctor/records',    label: 'Medical Records', icon: icons.record },
  ],
  ADMIN: [
    { to: '/admin/dashboard',   label: 'Dashboard', icon: icons.dashboard },
    { to: '/admin/users',       label: 'Users', icon: icons.users },
    { to: '/admin/doctors',     label: 'Doctors', icon: icons.doctors },
    { to: '/admin/appointments', label: 'Appointments', icon: icons.calendar },
    { to: '/admin/analytics',   label: 'Analytics', icon: icons.chart },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = navConfig[user?.role] || [];

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <MedoraLogo size={32} darkBg />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.fullName}</div>
            <div className="sidebar-user-role">{user?.role?.toLowerCase()}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          {icons.logout} Sign out
        </button>
      </div>
    </aside>
  );
}
