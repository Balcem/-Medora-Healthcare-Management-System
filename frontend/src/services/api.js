import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('medora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear auth and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medora_token');
      localStorage.removeItem('medora_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ─────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

// ── DOCTORS ──────────────────────────────────────────────────────────
export const doctorAPI = {
  getAll:      () => API.get('/doctors/public'),
  getById:     (id) => API.get(`/doctors/public/${id}`),
  getProfile:  () => API.get('/doctor/profile'),
  create:      (data) => API.post('/admin/doctors', data),
  adminGetAll: () => API.get('/admin/doctors'),
};

// ── PATIENTS ─────────────────────────────────────────────────────────
export const patientAPI = {
  getProfile: () => API.get('/patient/profile'),
};

// ── APPOINTMENTS ──────────────────────────────────────────────────────
export const appointmentAPI = {
  book:          (data) => API.post('/patient/appointments', data),
  myAppointments: ()   => API.get('/patient/appointments'),
  cancel:        (id)  => API.patch(`/patient/appointments/${id}/cancel`),
  doctorSchedule: ()   => API.get('/doctor/appointments'),
  updateStatus:  (id, data) => API.patch(`/doctor/appointments/${id}/status`, data),
  adminGetAll:   () => API.get('/admin/appointments'),
};

// ── MEDICAL RECORDS ───────────────────────────────────────────────────
export const recordAPI = {
  create:         (data) => API.post('/doctor/records', data),
  doctorRecords:  () => API.get('/doctor/records'),
  patientRecords: () => API.get('/patient/records'),
  patientById:    (patientId) => API.get(`/doctor/patients/${patientId}/records`),
};

// ── ADMIN ─────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers:     () => API.get('/admin/users'),
  toggleUser:   (id) => API.patch(`/admin/users/${id}/toggle`),
  deleteUser:   (id) => API.delete(`/admin/users/${id}`),
  getAnalytics: () => API.get('/admin/analytics'),
};

// ── SPECIALTIES ───────────────────────────────────────────────────────
export const specialtyAPI = {
  getAll: () => API.get('/specialties'),
};

export default API;
