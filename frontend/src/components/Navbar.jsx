import React from 'react';
import { BrainCircuit, Sun, Moon, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export default function Navbar({ theme, setTheme, onOpenLogin, onOpenRegister, backendOnline }) {
  return (
    <header className="landing-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal-accent))', padding: '10px', borderRadius: '12px', color: '#fff', display: 'flex' }}>
          <BrainCircuit size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px' }}>MediSync</h2>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: '700', border: '1px solid var(--primary)' }}>
              Enterprise AI
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospital & Pharmacy System</span>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Features</a>
        <a href="#ai-demo" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>AI Simulator</a>
        <a href="#rbac" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>RBAC Roles</a>
        <a href="#schema" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Architecture</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div className="pulse-dot" style={{ backgroundColor: backendOnline ? 'var(--success)' : 'var(--danger)' }}></div>
          <span>System Status: <strong>{backendOnline ? 'Online' : 'Standby'}</strong></span>
        </div>

        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-secondary"
          style={{ padding: '8px 12px' }}
          title="Toggle Dark / Light Mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button onClick={onOpenLogin} className="btn btn-secondary">
          <LogIn size={16} />
          <span>Log In</span>
        </button>

        <button onClick={onOpenRegister} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Register Staff</span>
        </button>
      </div>
    </header>
  );
}
