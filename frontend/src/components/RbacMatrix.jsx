import React from 'react';
import { Shield, Check, UserCheck, ArrowRight } from 'lucide-react';

export default function RbacMatrix({ onOpenLogin }) {
  const roles = [
    {
      title: 'Super Administrator',
      email: 'admin@medisync.health',
      roleKey: 'super_admin',
      color: 'var(--primary)',
      badge: 'Super Control',
      permissions: [
        'Access All 18 Relational Tables',
        'Manage Users & Assign System Roles',
        'Inspect Security Audit Logs',
        'Manage Departments, Wards & Suppliers'
      ]
    },
    {
      title: 'Chief Pharmacist',
      email: 'pharmacist@medisync.health',
      roleKey: 'pharmacist',
      color: 'var(--teal-accent)',
      badge: 'FEFO Engine',
      permissions: [
        'Monitor FEFO Batch Expiry Timelines',
        'Receive AI Expiry Risk Alerts & Recs',
        'Process Prescription Dispensing',
        'Auto-Generate Low Stock Reorders'
      ]
    },
    {
      title: 'Medical Officer / Doctor',
      email: 'doctor@medisync.health',
      roleKey: 'doctor',
      color: 'var(--success)',
      badge: 'Clinical EHR & Triage',
      permissions: [
        'Run AI Clinical Symptom Triage',
        'Issue Digitally Signed E-Rx PDFs',
        'Real-Time Drug Interaction Checks',
        'WHO ICD-10 / ICD-11 Code Search'
      ]
    },
    {
      title: 'Staff Nurse / Ward Care',
      email: 'nurse@medisync.health',
      roleKey: 'nurse',
      color: 'var(--warning)',
      badge: 'Intake & Wards',
      permissions: [
        'Register & Edit Patient EHR Records',
        'Manage Hospital Wards & Consultations',
        'Access AI Symptom Triage Tool',
        'Export Executive Clinical Reports'
      ]
    }
  ];

  return (
    <section id="rbac" style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '16px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.76rem', fontWeight: '700', marginBottom: '10px' }}>
          <Shield size={12} />
          <span>Role-Based Access Control (RBAC) Architecture</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          Granular Role Security Matrix
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
          Enforces role-based security ensuring doctors, pharmacists, administrators, and nurses access authorized modules only.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {roles.map((r, idx) => (
          <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `3px solid ${r.color}` }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: '800' }}>{r.title}</h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.email}</span>
                </div>
                <span className="badge badge-primary" style={{ borderColor: r.color, color: r.color, background: 'rgba(255,255,255,0.03)', fontSize: '0.64rem' }}>
                  {r.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                {r.permissions.map((p, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem' }}>
                    <Check size={14} color={r.color} style={{ marginTop: '1px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => onOpenLogin(r.roleKey)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: r.color, color: r.color, padding: '6px 12px', fontSize: '0.78rem' }}>
              <UserCheck size={14} />
              <span>Launch {r.title}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
