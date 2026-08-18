import React from 'react';
import { Package, Sparkles, Bot, Users, FileText, ShieldCheck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Package,
      title: 'FEFO Multi-Batch Tracking',
      desc: 'First-Expired-First-Out expiration tracking per batch number, storage location, and manufacturer lot.',
      color: 'var(--primary)'
    },
    {
      icon: Sparkles,
      title: 'AI Expiry & Demand Forecasting',
      desc: 'Predictive machine learning engine scoring batch expiration risks and calculating 30-day reorder quantities.',
      color: 'var(--warning)'
    },
    {
      icon: Bot,
      title: 'AI Clinical Symptom Triage',
      desc: 'Smart patient intake tool analyzing symptom severity, routing to hospital wards, and recommending emergency drugs.',
      color: 'var(--teal-accent)'
    },
    {
      icon: Users,
      title: 'Electronic Health Records (EHR)',
      desc: 'Comprehensive patient history, allergy warnings, NIC/Passport records, and emergency contact management.',
      color: 'var(--success)'
    },
    {
      icon: FileText,
      title: 'E-Prescribing & Dispensing',
      desc: 'Doctor prescription issuance with line-item dosages, frequency instructions, and pharmacy dispensing sync.',
      color: '#a855f7'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Audit & Security',
      desc: 'Role-Based Access Control (RBAC) across 18 MySQL relational tables with immutable security audit logs.',
      color: '#ec4899'
    }
  ];

  return (
    <section id="features" style={{ padding: '80px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
          Production-Level Hospital Capabilities
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Engineered for rural & municipal healthcare centers to eliminate medicine shortages, prevent waste, and digitize clinical workflows.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '28px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', width: 'fit-content', color: f.color, marginBottom: '20px' }}>
                <Icon size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
