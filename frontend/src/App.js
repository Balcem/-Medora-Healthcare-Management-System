import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PatientDashboard  from './pages/patient/PatientDashboard';
import FindDoctors       from './pages/patient/FindDoctors';
import MyAppointments    from './pages/patient/MyAppointments';
import MedicalHistory    from './pages/patient/MedicalHistory';

import DoctorDashboard   from './pages/doctor/DoctorDashboard';
import DoctorSchedule    from './pages/doctor/DoctorSchedule';
import DoctorPatients    from './pages/doctor/DoctorPatients';
import DoctorRecords     from './pages/doctor/DoctorRecords';

import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminUsers        from './pages/admin/AdminUsers';
import AdminDoctors      from './pages/admin/AdminDoctors';
import AdminAppointments from './pages/admin/AdminAppointments';

// ── Protected route wrapper ────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function getDefaultRoute(role) {
  switch (role) {
    case 'PATIENT': return '/patient/dashboard';
    case 'DOCTOR':  return '/doctor/dashboard';
    case 'ADMIN':   return '/admin/dashboard';
    default:        return '/login';
  }
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getDefaultRoute(user.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<RootRedirect />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient */}
          <Route path="/patient/dashboard"    element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/doctors"      element={<ProtectedRoute allowedRoles={['PATIENT']}><FindDoctors /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['PATIENT']}><MyAppointments /></ProtectedRoute>} />
          <Route path="/patient/records"      element={<ProtectedRoute allowedRoles={['PATIENT']}><MedicalHistory /></ProtectedRoute>} />

          {/* Doctor */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/schedule"  element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorSchedule /></ProtectedRoute>} />
          <Route path="/doctor/patients"  element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorPatients /></ProtectedRoute>} />
          <Route path="/doctor/records"   element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorRecords /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard"    element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"        element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/doctors"      element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDoctors /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAppointments /></ProtectedRoute>} />
          <Route path="/admin/analytics"    element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
