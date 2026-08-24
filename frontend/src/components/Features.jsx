import React from 'react';
import { Sparkles, AlertTriangle, QrCode, Thermometer, Trash2, Truck, Stethoscope, Bell, HeartPulse, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const productivityUpgrades = [
    {
      icon: AlertTriangle,
      title: 'Drug Interaction & Allergy Check',
      desc: 'Automated clinical safety matrix warning doctors during prescription creation if prescribed drugs interact dangerously or conflict with EHR allergies.',
      tag: 'Clinical Safety',
      color: 'var(--danger)'
    },
    {
      icon: QrCode,
      title: 'Digital e-Rx & QR Generator',
      desc: 'Generates downloadable, digitally signed e-Prescription PDFs with 2D QR codes and SHA-256 cryptographic hashes for instant pharmacy verification.',
      tag: 'E-Prescribing',
      color: 'var(--primary)'
    },
    {
      icon: Thermometer,
      title: 'Cold-Chain Storage Temp Log',
      desc: 'Tracks thermal storage conditions for sensitive biologics (vaccines, insulin) with automated threshold breach alerts and audit logging.',
      tag: 'Cold Storage',
      color: 'var(--teal-accent)'
    },
    {
      icon: Trash2,
      title: 'Stock Condemnation Ledger',
      desc: 'Structured compliance workflow for decommissioning expired or damaged stock batches with formal SHA-256 destruction certificates.',
      tag: 'Compliance Audit',
      color: 'var(--warning)'
    },
    {
      icon: Truck,
      title: 'Auto Purchase Order Engine',
      desc: 'Scans FEFO stock levels against minimum reorder thresholds and auto-generates purchase order drafts sent directly to preferred supplier emails.',
      tag: 'Procurement',
      color: 'var(--success)'
    },
    {
      icon: Stethoscope,
      title: 'WHO ICD-10 & ICD-11 Codes',
      desc: 'Integrated international clinical diagnostic database with real-time auto-complete search by code key or title during patient intake.',
      tag: 'WHO Standard',
      color: '#a855f7'
    },
    {
      icon: Bell,
      title: 'Live SSE Notification Stream',
      desc: 'Real-time pop-up alerts and badge notifications for critical AI emergency triage cases, stock-outs, and new prescription orders without reloading.',
      tag: 'Real-Time Stream',
      color: '#ec4899'
    },
    {
      icon: HeartPulse,
      title: 'Patient Self-Service Web Portal',
      desc: 'Secure portal for patients to inspect active prescriptions, appointment schedules, recorded allergy histories, and request follow-up bookings.',
      tag: 'Patient Portal',
      color: '#06b6d4'
    }
  ];

  return (
    <section id="productivity" style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '16px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.76rem', fontWeight: '700', marginBottom: '10px' }}>
          <Sparkles size={12} />
          <span>Productivity & Clinical Intelligence Features</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          8 Advanced System Capabilities
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
          Engineered for healthcare centers to streamline pharmacy workflows, protect patient safety, and eliminate medicine expiration waste.
        </p>
      </div>

      {/* Grid of 8 Productivity Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {productivityUpgrades.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div 
              key={idx} 
              className="glass-panel glass-panel-hover" 
              style={{ 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column', 
                justify: 'space-between',
                borderTop: `3px solid ${f.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', color: f.color }}>
                    <Icon size={18} />
                  </div>
                  <span className="badge badge-primary" style={{ borderColor: f.color, color: f.color, background: 'rgba(255,255,255,0.03)', fontSize: '0.66rem' }}>
                    {f.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: f.color, fontWeight: '700' }}>
                <CheckCircle2 size={13} />
                <span>Active & Integrated</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
