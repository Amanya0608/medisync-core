import React, { useState } from 'react';
import { Key, LogIn, X, AlertCircle, ShieldCheck, Lock, Mail, CheckCircle2, ArrowLeft, RefreshCw, HelpCircle, CheckSquare, Square } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  // View Modes: 'login' | 'otp_verify' | 'forgot_password_email' | 'forgot_password_reset'
  const [viewMode, setViewMode] = useState('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpCode, setOtpCode] = useState('');

  // Forgot Password State
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSwitchView = (mode) => {
    setViewMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Step 1: Submit Login Credentials -> Trigger 6-Digit Email OTP
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        if (data.requires_otp) {
          setSuccessMsg('A 6-digit verification code has been sent to your email inbox.');
          setViewMode('otp_verify');
        }
      } else {
        setErrorMsg(data.message || 'Invalid email or password. Please verify staff credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      setErrorMsg('Network error. Unable to reach authentication server.');
    }
  };

  // Step 2: Verify 6-Digit Email OTP
  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp_code: otpCode.trim() })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        onLoginSuccess({
          ...data.user,
          rememberMe
        });
      } else {
        setErrorMsg(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      console.error('OTP error:', err);
      setLoading(false);
      setErrorMsg('Failed to verify security code.');
    }
  };

  // Step 3A: Request Forgot Password OTP
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccessMsg('Password reset verification code sent to your email.');
        setViewMode('forgot_password_reset');
      } else {
        setErrorMsg(data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      console.error('Reset request error:', err);
      setLoading(false);
      setErrorMsg('Network error requesting password reset.');
    }
  };

  // Step 3B: Reset Password using OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match!');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), reset_otp: resetOtp.trim(), new_password: newPassword })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccessMsg('Password reset successfully! Log in with your new password.');
        setPassword(newPassword);
        setViewMode('login');
      } else {
        setErrorMsg(data.message || 'Invalid Reset OTP code.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setLoading(false);
      setErrorMsg('Failed to reset password.');
    }
  };

  const fillSampleEmail = (sampleEmail) => {
    setEmail(sampleEmail);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* VIEW 1: INITIAL LOGIN CREDENTIALS */}
        {viewMode === 'login' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Key size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Staff Login Portal</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>2-Factor Email Security Verification Enabled</p>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--success)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Hospital Staff Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    required 
                    placeholder="e.g. doctor@medisync.health" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Password</label>
                  <button 
                    type="button" 
                    onClick={() => handleSwitchView('forgot_password_email')} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    className="input-field" 
                    required 
                    placeholder="••••••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div 
                onClick={() => setRememberMe(!rememberMe)} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', marginTop: '2px' }}
              >
                {rememberMe ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} color="var(--text-muted)" />}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  Remember Me on this browser
                </span>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '8px' }}>
                <LogIn size={18} />
                <span>{loading ? 'Validating Credentials...' : 'Log In & Send Security Code'}</span>
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                STAFF ACCOUNT HELPER (Click to autofill):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { email: 'admin@medisync.health', label: 'Super Admin' },
                  { email: 'pharmacist@medisync.health', label: 'Pharmacist' },
                  { email: 'doctor@medisync.health', label: 'Doctor' },
                  { email: 'inventory@medisync.health', label: 'Inventory Mgr' },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => fillSampleEmail(sample.email)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: 6-DIGIT EMAIL OTP 2FA VERIFICATION */}
        {viewMode === 'otp_verify' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => handleSwitchView('login')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Email Security Verification</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter 6-digit code sent to your email</p>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '18px', borderLeft: '4px solid var(--primary)' }}>
              ✉️ A 6-digit verification security code was sent to <strong>{email}</strong>.
            </div>

            <form onSubmit={handleOtpVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  6-Digit Verification Code
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  maxLength={6} 
                  required 
                  placeholder="e.g. 482910" 
                  value={otpCode} 
                  onChange={e => setOtpCode(e.target.value)} 
                  style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '6px', fontWeight: '700' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                <ShieldCheck size={18} />
                <span>{loading ? 'Verifying Code...' : 'Verify Code & Launch Dashboard'}</span>
              </button>
            </form>
          </>
        )}

        {/* VIEW 3A: FORGOT PASSWORD REQUEST EMAIL */}
        {viewMode === 'forgot_password_email' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => handleSwitchView('login')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Reset Account Password</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter your email to receive a Password Reset Code</p>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSendResetOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Registered Staff Email Address
                </label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  placeholder="e.g. doctor@medisync.health" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                <Mail size={18} />
                <span>{loading ? 'Sending Code...' : 'Send Password Reset Code'}</span>
              </button>
            </form>
          </>
        )}

        {/* VIEW 3B: FORGOT PASSWORD ENTER RESET OTP & NEW PASSWORD */}
        {viewMode === 'forgot_password_reset' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => handleSwitchView('forgot_password_email')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Set New Password</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter security code sent to {email}</p>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>6-Digit Reset Code</label>
                <input type="text" className="input-field" maxLength={6} required value={resetOtp} onChange={e => setResetOtp(e.target.value)} placeholder="e.g. 918234" style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: '700' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>New Password</label>
                <input type="password" className="input-field" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••••••" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Confirm New Password</label>
                <input type="password" className="input-field" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••••••" />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '6px' }}>
                <Key size={18} />
                <span>{loading ? 'Updating Password...' : 'Save New Password & Login'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
