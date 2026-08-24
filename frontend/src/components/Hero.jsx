import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Play, Activity, QrCode } from 'lucide-react';

export default function Hero({ onOpenLogin, onOpenRegister, stats }) {
  return (
    <section className="hero-section" style={{ position: 'relative' }}>
      {/* Left Column Content */}
      <div>
        {/* Enterprise Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '16px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.76rem', fontWeight: '700' }}>
            <Sparkles size={12} />
            <span>Enterprise Hospital AI System</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '16px', background: 'rgba(20, 184, 166, 0.12)', border: '1px solid rgba(20, 184, 166, 0.25)', color: 'var(--teal-accent)', fontSize: '0.76rem', fontWeight: '700' }}>
            <ShieldCheck size={12} />
            <span>SLMC & WHO ICD-10/11</span>
          </div>
        </div>

        {/* Headline - Proportional & Crisp (2.4rem) */}
        <h1 className="gradient-heading" style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '14px', letterSpacing: '-0.5px' }}>
          AI-Powered Hospital & FEFO Pharmacy System
        </h1>

        <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '580px' }}>
          Prevent drug expiration waste with automated FEFO batch tracking, real-time drug interaction safety checks, automated PO reorders, and live AI symptom triage.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          <button onClick={() => onOpenLogin('super_admin')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <span>Launch System Demo</span>
            <ArrowRight size={15} />
          </button>
          <a href="#productivity" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem', textDecoration: 'none' }}>
            <Play size={14} />
            <span>Productivity Features</span>
          </a>
        </div>

        {/* Fast 1-Click Role Login Pills */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
            ⚡ Fast 1-Click Role Sign-In
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <button 
              onClick={() => onOpenLogin('super_admin')}
              className="glass-panel"
              style={{ padding: '8px 10px', textAlign: 'left', borderLeft: '3px solid var(--primary)', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--primary)' }}>👑 Admin</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Super Control</div>
            </button>
            <button 
              onClick={() => onOpenLogin('doctor')}
              className="glass-panel"
              style={{ padding: '8px 10px', textAlign: 'left', borderLeft: '3px solid var(--success)', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--success)' }}>🩺 Doctor</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>EHR & Triage</div>
            </button>
            <button 
              onClick={() => onOpenLogin('pharmacist')}
              className="glass-panel"
              style={{ padding: '8px 10px', textAlign: 'left', borderLeft: '3px solid var(--teal-accent)', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--teal-accent)' }}>💊 Pharmacist</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>FEFO Stock</div>
            </button>
            <button 
              onClick={() => onOpenLogin('nurse')}
              className="glass-panel"
              style={{ padding: '8px 10px', textAlign: 'left', borderLeft: '3px solid var(--warning)', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--warning)' }}>🩺 Ward Nurse</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Intake Wards</div>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div className="glass-panel" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>FORMULARIES</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>200 Drugs</div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>20 Categories</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>FEFO ACCURACY</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '2px' }}>99.9% Zero-Waste</div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Decay Shield</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>VENDORS & EHR</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--success)', marginTop: '2px' }}>10 PO Vendors</div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>10 Patients</div>
          </div>
        </div>
      </div>

      {/* Right Column Visual Panel */}
      <div>
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary)" />
              <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>MediSync Live Engine</span>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.66rem' }}>● SSE Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Live SSE Triage Alert */}
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: '800' }}>🚨 LIVE EMERGENCY TRIAGE</span>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Just Now</span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>Patient Eleanor Vance • Emergency</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Chest tightness & Dyspnea $\rightarrow$ Cardiology Unit</div>
            </div>

            {/* Drug Interaction Safety Banner */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--warning)', fontWeight: '800' }}>⚠️ DRUG INTERACTION ALERT</span>
                <span style={{ fontSize: '0.64rem', color: 'var(--warning)', fontWeight: '700' }}>MODERATE</span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>Atorvastatin + Clarithromycin Conflict</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Increases rhabdomyolysis risk. Penicillin allergy recorded.</div>
            </div>

            {/* Cold-Chain Log */}
            <div style={{ background: 'rgba(20, 184, 166, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--teal-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--teal-accent)', fontWeight: '800' }}>🧊 COLD-CHAIN STORAGE</span>
                <span style={{ fontSize: '0.64rem', color: 'var(--teal-accent)', fontWeight: '700' }}>4.5°C Optimal</span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>Insulin Glargine • Cold Unit 1</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Stable within required range [2.0°C - 8.0°C]</div>
            </div>

            {/* E-Rx Badge */}
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: '800' }}>📜 CRYPTOGRAPHIC E-RX</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', marginTop: '2px' }}>Rx #RX-2026-9901 • Signed</div>
              </div>
              <div style={{ background: '#fff', padding: '4px', borderRadius: '4px' }}>
                <QrCode size={26} color="#0f172a" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
