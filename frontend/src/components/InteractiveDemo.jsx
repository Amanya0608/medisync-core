import React, { useState } from 'react';
import { Bot, Sparkles, Package, CheckCircle2 } from 'lucide-react';

export default function InteractiveDemo({ aiRiskData }) {
  const [symptoms, setSymptoms] = useState('Patient presenting with severe chest tightness, acute shortness of breath, and blood pressure 150/95');
  const [demoResult, setDemoResult] = useState({
    triage_level: 'Emergency',
    department: 'Cardiology Unit',
    confidence: 94.2,
    recommended_meds: ['Atorvastatin 20mg (Check FEFO)', 'Aspirin 75mg'],
    notes: 'High cardiovascular risk presentation. Immediate ECG & cardiologist intake required.'
  });
  const [loading, setLoading] = useState(false);

  const handleRunDemo = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (symptoms.toLowerCase().includes('fever') || symptoms.toLowerCase().includes('cough')) {
        setDemoResult({
          triage_level: 'Urgent',
          department: 'Pulmonary & OPD Ward',
          confidence: 91.5,
          recommended_meds: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
          notes: 'Acute respiratory presentation. Prescribe broad-spectrum antibiotic after FEFO expiry check.'
        });
      } else {
        setDemoResult({
          triage_level: 'Emergency',
          department: 'Cardiology Unit',
          confidence: 95.8,
          recommended_meds: ['Atorvastatin 20mg', 'Lisinopril 10mg'],
          notes: 'Elevated cardiac risk presentation. Immediate telemetry monitoring and emergency physician intake.'
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <section id="ai-demo" style={{ padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '16px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.76rem', fontWeight: '700', marginBottom: '10px' }}>
          <Bot size={12} />
          <span>Interactive AI Engine & FEFO Simulator</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          Test AI Symptom Triage & FEFO Analytics Live
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
          Experience MediSync's AI symptom triage assistant and real-time batch decay forecasting directly in your browser.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Simulator 1: AI Clinical Triage */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--teal-accent)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} color="var(--teal-accent)" />
            <span>AI Symptom Triage Simulator</span>
          </h3>
          
          <form onSubmit={handleRunDemo} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                INPUT TEST CLINICAL SYMPTOMS:
              </label>
              <textarea 
                className="input-field" 
                rows={2} 
                value={symptoms} 
                onChange={e => setSymptoms(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '8px 14px', fontSize: '0.8rem' }}>
              <Sparkles size={14} />
              <span>{loading ? 'Processing...' : 'Evaluate Symptoms with AI'}</span>
            </button>
          </form>

          {demoResult && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '800', fontSize: '0.84rem' }}>
                  Triage Status: <span style={{ color: demoResult.triage_level === 'Emergency' ? 'var(--danger)' : 'var(--warning)' }}>{demoResult.triage_level}</span>
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.64rem' }}>{demoResult.confidence}% Confidence</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Recommended Dept: <strong style={{ color: 'var(--primary)' }}>{demoResult.department}</strong>
              </p>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px', marginBottom: '6px' }}>
                {demoResult.notes}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--teal-accent)', fontWeight: '700' }}>
                Recommended Formulary: {demoResult.recommended_meds.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Simulator 2: Live FEFO Batch Alerts */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="var(--primary)" />
            <span>Live FEFO Expiry Stream</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: '800', fontSize: '0.84rem' }}>Amoxil 500mg (Amoxicillin)</span>
                <span className="badge badge-warning" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', fontSize: '0.64rem' }}>Risk Score: 92.5%</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Batch: <strong style={{ color: 'var(--text-main)' }}>AMX-2025-EXP14D</strong> • Exp: <strong style={{ color: 'var(--danger)' }}>14 Days Left</strong>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                <strong>AI Recommendation:</strong> 240 units expiring soon. Transfer 150 units to OPD clinic.
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--teal-accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: '800', fontSize: '0.84rem' }}>Lantus SoloStar (Insulin)</span>
                <span className="badge badge-success" style={{ fontSize: '0.64rem' }}>Cold-Chain Optimal</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Batch: <strong style={{ color: 'var(--text-main)' }}>INS-2026-B941</strong> • Storage: <strong style={{ color: 'var(--teal-accent)' }}>Cold Unit 1 (4.5°C)</strong>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '4px' }}>
                <strong>Thermal Log:</strong> Temperature stable within [2.0°C - 8.0°C] window. 1,850 units active.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
