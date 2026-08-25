import React, { useState } from 'react';
import { BrainCircuit, Sun, Moon, LogIn, UserPlus, HeartPulse, ChevronDown, ShieldCheck, Stethoscope, Pill, User } from 'lucide-react';

export default function Navbar({ theme, setTheme, onOpenLogin, onOpenRegister, onOpenPatientPortal, backendOnline }) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="landing-nav">
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal-accent) 100%)', 
          padding: '7px 8px', 
          borderRadius: '10px', 
          color: '#fff', 
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 10px var(--primary-glow)'
        }}>
          <BrainCircuit size={18} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.4px', color: 'var(--text-main)' }}>
            MediSync
          </h2>
          <span style={{ 
            fontSize: '0.65rem', 
            padding: '1px 6px', 
            borderRadius: '8px', 
            background: 'var(--primary-glow)', 
            color: 'var(--primary)', 
            fontWeight: '700', 
            border: '1px solid var(--primary)'
          }}>
            Enterprise AI
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>Features</a>
        <a href="#productivity" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>Productivity</a>
        <a href="#ai-demo" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>AI Simulator</a>
        <a href="#rbac" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>RBAC Matrix</a>
        <a href="#architecture" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>Architecture</a>
      </nav>

      {/* Right Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Live Status Indicator Pill */}
        <div className="glass-panel" style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', borderRadius: '16px' }}>
          <div className="pulse-dot" style={{ backgroundColor: backendOnline ? 'var(--success)' : 'var(--danger)', width: '7px', height: '7px' }}></div>
          <span style={{ color: 'var(--text-muted)' }}>
            Status: <strong style={{ color: backendOnline ? 'var(--success)' : 'var(--danger)' }}>{backendOnline ? 'Online' : 'Offline'}</strong>
          </span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-secondary"
          style={{ padding: '6px 10px', borderRadius: '8px' }}
          title="Toggle Dark / Light Mode"
        >
          {theme === 'dark' ? <Sun size={14} color="var(--warning)" /> : <Moon size={14} color="var(--primary)" />}
        </button>

        {/* Patient Web Portal */}
        <button 
          onClick={onOpenPatientPortal} 
          className="btn btn-secondary" 
          style={{ color: 'var(--teal-accent)', borderColor: 'rgba(20, 184, 166, 0.35)', background: 'rgba(20, 184, 166, 0.08)', padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <HeartPulse size={14} />
          <span>Patient Portal</span>
        </button>

        {/* Primary CTA */}
        <button onClick={() => onOpenLogin()} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          <UserPlus size={14} />
          <span>Launch System</span>
        </button>
      </div>
    </header>
  );
}
