import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Play, Server, Activity, Users, Package, BrainCircuit } from 'lucide-react';

export default function Hero({ onOpenLogin, onOpenRegister, stats }) {
  return (
    <section className="hero-section">
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: '700', marginBottom: '20px' }}>
          <Sparkles size={14} />
          <span>Production-Grade Enterprise System • Hospital Deployment</span>
        </div>

        <h1 className="gradient-heading" style={{ fontSize: '3.2rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1px' }}>
          Next-Gen AI & FEFO Medicine Stocking for Modern Hospitals
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
          Prevent pharmaceutical expiry waste with automated FEFO multi-batch tracking, AI consumption demand forecasting, and intelligent clinical symptom triage.
        </p>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px' }}>
          <button onClick={onOpenLogin} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            <span>Role-Based Portal Access</span>
            <ArrowRight size={18} />
          </button>
          <a href="#ai-demo" className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem', textDecoration: 'none' }}>
            <Play size={16} />
            <span>Try AI Simulator</span>
          </a>
        </div>

        {/* Live Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ENTERPRISE SCALE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>Healthcare API</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FEFO ACCURACY</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '2px' }}>99.9% Zero-Waste</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI CONFIDENCE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '2px' }}>96.4% Precision</div>
          </div>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="glass-panel glass-panel-hover" style={{ padding: '28px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--primary)" />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Live Intelligence Stream</span>
          </div>
          <span className="badge badge-success">● Active Engine</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '14px', borderRadius: '12px', borderLeft: '4px solid var(--danger)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
              ⚠️ High Risk Expiry Warning
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>Amoxil 500mg (Batch AMX-2025-EXP14D)</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              240 units expiring in 14 days • AI recommends transfer to OPD clinic.
            </div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '14px', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
              🤖 AI Clinical Triage Suggestion
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>Walk-in Patient • Triage Level: Emergency</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Symptoms: Chest tightness & dyspnea → Routed to Cardiology Unit.
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '12px', borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
              ✓ E-Prescribing & Dispensing Sync
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>Prescription #RX-2026-9901 • Lipitor 20mg</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Issued by Dr. Aris Thorne for Patient Eleanor Vance.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
