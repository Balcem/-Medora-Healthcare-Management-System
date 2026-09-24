import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { MedoraLogo } from '../../assets/MedoraLogo';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', dateOfBirth: '', gender: '', bloodType: '', address: '',
  });
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
      await register(form);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.email || err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <MedoraLogo size={56} showText darkBg />
          </div>
          <p className="auth-brand-tagline">Your health, our priority.</p>
          <div className="auth-brand-features">
            {['Free patient registration','Book with top doctors','Secure digital records','24/7 access to your history'].map(f => (
              <div className="auth-brand-feature" key={f}><span className="dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box" style={{maxWidth:480}}>
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-subtitle">Join Medora as a patient</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name <span className="required">*</span></label>
                <input className="form-input" name="firstName" value={form.firstName} onChange={onChange} required placeholder="Jane" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name <span className="required">*</span></label>
                <input className="form-input" name="lastName" value={form.lastName} onChange={onChange} required placeholder="Doe" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={onChange} required placeholder="jane@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input className="form-input" type="password" name="password" value={form.password} onChange={onChange} required minLength={6} placeholder="Min 6 characters" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" value={form.phone} onChange={onChange} placeholder="+1-555-0100" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" name="gender" value={form.gender} onChange={onChange}>
                  <option value="">Select</option>
                  <option>MALE</option><option>FEMALE</option><option>OTHER</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type</label>
                <select className="form-input" name="bloodType" value={form.bloodType} onChange={onChange}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" name="address" value={form.address} onChange={onChange} placeholder="123 Main St, City, State" />
            </div>

            <button className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading}>
              {loading ? <span className="spinner" style={{width:18,height:18}} /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
