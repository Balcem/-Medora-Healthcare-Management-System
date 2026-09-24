import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { MedoraLogo } from '../../assets/MedoraLogo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      switch (data.role) {
        case 'PATIENT': navigate('/patient/dashboard'); break;
        case 'DOCTOR':  navigate('/doctor/dashboard');  break;
        case 'ADMIN':   navigate('/admin/dashboard');   break;
        default:        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(role) {
    const creds = {
      admin:   { email: 'admin@medora.health',         password: 'Admin@123' },
      doctor:  { email: 'sarah.johnson@medora.health', password: 'Doctor@123' },
      patient: { email: 'emily.davis@medora.health',   password: 'Patient@123' },
    };
    setForm(creds[role]);
    setError('');
  }

  return (
    <div className="auth-page">
      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <MedoraLogo size={56} showText darkBg />
          </div>
          <p className="auth-brand-tagline">Healthcare, simplified.</p>

          <div className="auth-brand-features">
            {['Role-based access for Patients, Doctors & Admin',
              'Appointment booking with conflict prevention',
              'Digital medical records & prescriptions',
              'Real-time dashboard analytics'].map(f => (
              <div className="auth-brand-feature" key={f}>
                <span className="dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your Medora account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input
                className="form-input"
                type="email" name="email"
                value={form.email} onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input
                className="form-input"
                type="password" name="password"
                value={form.password} onChange={onChange}
                placeholder="••••••••"
                required
              />
            </div>
            <button className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading}>
              {loading ? <span className="spinner" style={{width:18,height:18}} /> : 'Sign In'}
            </button>
          </form>

          {/* Quick-fill demo buttons */}
          <div style={{marginTop:'1.5rem'}}>
            <p style={{fontSize:'0.8rem',color:'var(--gray-400)',textAlign:'center',marginBottom:'0.75rem'}}>
              — Demo accounts —
            </p>
            <div style={{display:'flex',gap:'0.5rem'}}>
              {['admin','doctor','patient'].map(r => (
                <button key={r} className="btn btn-outline btn-sm" style={{flex:1,textTransform:'capitalize'}}
                  onClick={() => fillDemo(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="auth-form-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
