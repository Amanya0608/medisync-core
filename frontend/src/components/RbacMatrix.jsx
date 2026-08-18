import React from 'react';
import { Shield, Key, Check, Lock, UserCheck } from 'lucide-react';

export default function RbacMatrix({ onOpenLogin }) {
  const roles = [
    {
      title: 'Super Administrator',
      email: 'admin@medisync.health',
      roleKey: 'super_admin',
      color: 'var(--primary)',
      badge: 'Full System Control',
      permissions: [
        'Access All 18 MySQL Relational Tables',
        'Manage User Accounts & Assign RBAC Roles',
        'Inspect System Security Audit Logs',
        'Configure Department Wards & Suppliers'
      ]
    },
    {
      title: 'Chief Pharmacist',
      email: 'pharmacist@medisync.health',
      roleKey: 'pharmacist',
      color: 'var(--teal-accent)',
      badge: 'Inventory & FEFO',
      permissions: [
        'Monitor FEFO Batch Expiry Timelines',
        'Receive AI Expiry Risk Alerts & Transfer Recs',
        'Process Prescription Drug Dispensing',
        'Perform Inventory Stock Adjustments & Restocks'
      ]
    },
    {
      title: 'Medical Officer / Doctor',
      email: 'doctor@medisync.health',
      roleKey: 'doctor',
      color: 'var(--success)',
      badge: 'Clinical EHR & AI Triage',
      permissions: [
        'Run AI Clinical Symptom Triage Assistant',
        'Issue Electronic Prescriptions (E-Rx)',
        'View Patient EHR Profiles & Allergy Alerts',
        'Schedule Patient Consultations'
      ]
    },
    {
      title: 'Inventory Manager',
      email: 'inventory@medisync.health',
      roleKey: 'inventory_manager',
      color: 'var(--warning)',
      badge: 'Procurement & Analytics',
      permissions: [
        'Manage Pharmaceutical Supplier Catalog',
        'Review AI 30-Day Reorder Forecasts',
        'Log Received Shipments & Stock Receipts',
        'Generate Consumption Analytics Reports'
      ]
    }
  ];

  return (
    <section id="rbac" style={{ padding: '80px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: '700', marginBottom: '16px' }}>
          <Shield size={14} />
          <span>Role-Based Access Control (RBAC) Architecture</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
          Granular Role Access & Security
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          MediSync enforces role-based security ensuring doctors, pharmacists, administrators, and inventory managers access only their authorized clinical and pharmacy modules.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {roles.map((r, idx) => (
          <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{r.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.email}</span>
                </div>
                <span className="badge badge-primary" style={{ borderColor: r.color, color: r.color }}>
                  {r.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {r.permissions.map((p, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                    <Check size={16} color={r.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => onOpenLogin(r.roleKey)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <UserCheck size={16} />
              <span>Login as {r.title.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
