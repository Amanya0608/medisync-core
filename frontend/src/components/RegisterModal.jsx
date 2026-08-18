import React, { useState } from 'react';
import { UserPlus, X, Shield, CheckCircle2 } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', role: 'doctor', license: '', department: 'Cardiology Unit'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
            <UserPlus size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Hospital Staff Registration</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Request access for doctor, pharmacist, or staff role</p>
          </div>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Registration Submitted</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Your account application has been logged to the MySQL audit database for administrator approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Dr. Nuwan Senanayake" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Official Email</label>
                <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="nuwan@medisync.health" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Desired Role</label>
                <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="doctor">Medical Officer / Doctor</option>
                  <option value="pharmacist">Chief Pharmacist</option>
                  <option value="inventory_manager">Inventory Manager</option>
                  <option value="nurse">Nursing Staff</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>SLMC / Professional License</label>
                <input type="text" className="input-field" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} placeholder="SLMC-77182" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Ward</label>
                <input type="text" className="input-field" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="Cardiology Unit" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}>
              <UserPlus size={18} />
              <span>Submit Staff Registration</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
