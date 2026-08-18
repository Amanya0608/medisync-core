import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import RbacMatrix from './components/RbacMatrix';
import InteractiveDemo from './components/InteractiveDemo';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RolePortal from './components/RolePortal';
import { Database, ShieldCheck, HeartPulse, BrainCircuit } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState('light');

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('medisync_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [backendStatus, setBackendStatus] = useState({ online: false, data: null });
  const [aiRiskData, setAiRiskData] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus({ online: true, data });
        }

        const aiRes = await fetch('/api/v1/ai/inventory-risk');
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          setAiRiskData(aiData);
        }
      } catch (err) {
        console.error('API check error:', err);
      }
    };
    checkBackend();
  }, []);

  const handleLoginSuccess = (userProfile) => {
    setCurrentUser(userProfile);
    localStorage.setItem('medisync_user', JSON.stringify(userProfile));
    
    if (userProfile.roleKey === 'super_admin') {
      navigate('/dashboard/users');
    } else if (userProfile.roleKey === 'doctor') {
      navigate('/dashboard/ai-triage');
    } else if (userProfile.roleKey === 'pharmacist') {
      navigate('/dashboard/ai-risk');
    } else {
      navigate('/dashboard/overview');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('medisync_user');
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={
        currentUser ? (
          <Navigate to={currentUser.roleKey === 'super_admin' ? '/dashboard/users' : '/dashboard/overview'} replace />
        ) : (
          <LandingView 
            theme={theme} 
            setTheme={setTheme} 
            backendStatus={backendStatus} 
            aiRiskData={aiRiskData} 
            onOpenLogin={() => navigate('/login')}
            onOpenRegister={() => navigate('/register')}
          />
        )
      } />

      <Route path="/login" element={
        currentUser ? (
          <Navigate to={currentUser.roleKey === 'super_admin' ? '/dashboard/users' : '/dashboard/overview'} replace />
        ) : (
          <>
            <LandingView 
              theme={theme} setTheme={setTheme} backendStatus={backendStatus} aiRiskData={aiRiskData}
              onOpenLogin={() => {}} onOpenRegister={() => navigate('/register')}
            />
            <LoginModal 
              isOpen={true} 
              onClose={() => navigate('/')} 
              onLoginSuccess={handleLoginSuccess}
            />
          </>
        )
      } />

      <Route path="/register" element={
        currentUser ? (
          <Navigate to={currentUser.roleKey === 'super_admin' ? '/dashboard/users' : '/dashboard/overview'} replace />
        ) : (
          <>
            <LandingView 
              theme={theme} setTheme={setTheme} backendStatus={backendStatus} aiRiskData={aiRiskData}
              onOpenLogin={() => navigate('/login')} onOpenRegister={() => {}}
            />
            <RegisterModal 
              isOpen={true} 
              onClose={() => navigate('/')} 
            />
          </>
        )
      } />

      <Route path="/dashboard/*" element={
        currentUser ? (
          <RolePortal 
            user={currentUser} 
            onLogout={handleLogout} 
            theme={theme} 
            setTheme={setTheme} 
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LandingView({ theme, setTheme, backendStatus, aiRiskData, onOpenLogin, onOpenRegister }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        backendOnline={backendStatus.online}
      />

      <Hero 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        stats={backendStatus.data}
      />

      <Features />

      <InteractiveDemo aiRiskData={aiRiskData} />

      <RbacMatrix onOpenLogin={onOpenLogin} />

      <footer id="schema" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', padding: '60px 32px 30px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal-accent))', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                <BrainCircuit size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>MediSync Enterprise</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '360px' }}>
              Next-generation hospital pharmacy medicine stocking and expiry tracking platform with AI predictive intelligence.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '14px', color: 'var(--primary)' }}>SYSTEM MODULES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>FEFO Multi-Batch Engine</span>
              <span>AI Expiry Risk Predictor</span>
              <span>AI Symptom Triage</span>
              <span>Electronic Health Records</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '14px', color: 'var(--primary)' }}>SYSTEM PORTALS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>User Management</span>
              <span>Inventory Analytics</span>
              <span>Clinical Operations</span>
              <span>Pharmacy Dispensing</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '14px', color: 'var(--primary)' }}>SECURITY & COMPLIANCE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Role-Based Access Control</span>
              <span>2-Factor Email OTP</span>
              <span>Security Audit Logging</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>© 2026 MediSync Healthcare Platform</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>SLMC Compliant</span>
            <span>HIPAA Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
