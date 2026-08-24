import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import RbacMatrix from './components/RbacMatrix';
import InteractiveDemo from './components/InteractiveDemo';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import PatientPortalModal from './components/PatientPortalModal';
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
            onOpenPatientPortal={() => navigate('/patient-portal')}
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
              onOpenLogin={() => {}} onOpenRegister={() => navigate('/register')} onOpenPatientPortal={() => navigate('/patient-portal')}
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
              onOpenLogin={() => navigate('/login')} onOpenRegister={() => {}} onOpenPatientPortal={() => navigate('/patient-portal')}
            />
            <RegisterModal 
              isOpen={true} 
              onClose={() => navigate('/')} 
            />
          </>
        )
      } />

      <Route path="/patient-portal" element={
        <>
          <LandingView 
            theme={theme} setTheme={setTheme} backendStatus={backendStatus} aiRiskData={aiRiskData}
            onOpenLogin={() => navigate('/login')} onOpenRegister={() => navigate('/register')} onOpenPatientPortal={() => {}}
          />
          <PatientPortalModal 
            isOpen={true} 
            onClose={() => navigate('/')} 
          />
        </>
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

function LandingView({ theme, setTheme, backendStatus, aiRiskData, onOpenLogin, onOpenRegister, onOpenPatientPortal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        onOpenPatientPortal={onOpenPatientPortal}
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

      {/* Enterprise System Architecture Section */}
      <section id="architecture" style={{ padding: '80px 32px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: '700', marginBottom: '16px' }}>
            <Database size={14} />
            <span>Full-Stack Enterprise Architecture</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
            Built on Enterprise Technical Foundations
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Engineered with modern full-stack web standards, relational database integrity, and high-performance REST APIs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderTop: '3px solid var(--primary)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>BACKEND API FRAMEWORK</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Laravel 11.x REST API</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Robust RESTful backend with Sanctum authentication, 2FA OTP verification, database seeders, and SSE live streams.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderTop: '3px solid var(--teal-accent)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--teal-accent)', textTransform: 'uppercase', marginBottom: '6px' }}>FRONTEND SINGLE PAGE APP</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>React 19 + Vite + Lucide</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Blazing-fast responsive single page application built with glassmorphism UI, light/dark themes, and micro-animations.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderTop: '3px solid var(--success)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '6px' }}>RELATIONAL DATABASE</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>MySQL 8.x (18 Relational Tables)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Structured relational schema tracking multi-batch FEFO inventory, clinical prescriptions, staff rosters, and audit logs.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderTop: '3px solid var(--warning)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '6px' }}>PREDICTIVE AI ENGINE</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Groq Llama 3 AI Assistant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Predictive machine learning algorithms for 30-day demand forecasting, batch expiry decay scoring, and symptom triage.
            </p>
          </div>
        </div>
      </section>

      {/* Sleek Theme-Adaptive Glass Footer */}
      <footer id="schema" className="landing-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal-accent))', padding: '7px 8px', borderRadius: '10px', color: '#fff' }}>
                <BrainCircuit size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>MediSync Enterprise</h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '340px', marginBottom: '14px' }}>
              Next-generation hospital pharmacy medicine stocking and expiry tracking platform with AI predictive intelligence.
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-success" style={{ fontSize: '0.64rem' }}>SLMC Compliant</span>
              <span className="badge badge-primary" style={{ fontSize: '0.64rem' }}>HIPAA Ready</span>
              <span className="badge badge-warning" style={{ fontSize: '0.64rem' }}>WHO ICD-10/11</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '12px', color: 'var(--primary)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>CLINICAL MODULES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#productivity" className="footer-link">FEFO Multi-Batch Engine</a>
              <a href="#productivity" className="footer-link">Drug Interaction Matrix</a>
              <a href="#productivity" className="footer-link">Cold-Chain Thermal Logging</a>
              <a href="#productivity" className="footer-link">WHO ICD Diagnostic Search</a>
              <a href="#productivity" className="footer-link">Digital e-Prescription (Rx)</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '12px', color: 'var(--primary)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>STAFF PORTALS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="footer-link" onClick={() => onOpenLogin('super_admin')}>👑 Super Admin Portal</span>
              <span className="footer-link" onClick={() => onOpenLogin('doctor')}>🩺 Doctor EHR Portal</span>
              <span className="footer-link" onClick={() => onOpenLogin('pharmacist')}>💊 Chief Pharmacist Hub</span>
              <span className="footer-link" onClick={() => onOpenLogin('nurse')}>🩺 Staff Nurse Roster</span>
              <span className="footer-link" onClick={onOpenPatientPortal}>🏥 Patient Self-Service</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '12px', color: 'var(--primary)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>SYSTEM ARCHITECTURE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#architecture" className="footer-link">Laravel 11 REST API</a>
              <a href="#architecture" className="footer-link">React 19 Single Page App</a>
              <a href="#architecture" className="footer-link">MySQL 8.x DB Schema</a>
              <a href="#architecture" className="footer-link">Groq Llama 3 AI Engine</a>
              <a href="#architecture" className="footer-link">SHA-256 Digital Certificates</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>© 2026 MediSync Healthcare Platform v2.4.0</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>All rights reserved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>SLMC Standards</span>
            <span>HIPAA Compliant</span>
            <span>HL7 / FHIR Ready</span>
            <button 
              onClick={scrollToTop}
              className="btn btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '16px' }}
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
