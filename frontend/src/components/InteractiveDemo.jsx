import React, { useState } from 'react';
import { Bot, Sparkles, AlertTriangle, Play, Package, CheckCircle2 } from 'lucide-react';

export default function InteractiveDemo({ aiRiskData }) {
  const [symptoms, setSymptoms] = useState('Patient experiencing high fever, chest congestion, and oxygen saturation 93%');
  const [demoResult, setDemoResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunDemo = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setDemoResult({
        triage_level: 'Urgent',
        department: 'Emergency OPD & Pulmonary Unit',
        confidence: 94.8,
        recommended_meds: ['Amoxicillin 500mg (Check FEFO)', 'Paracetamol 500mg'],
        notes: 'High fever and 93% SpO2 requires immediate doctor review & antibiotic sensitivity check.'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <section id="ai-demo" style={{ padding: '80px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
          Interactive AI Engine & FEFO Simulator
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Experience MediSync's clinical triage intelligence and live batch expiry analytics directly in your browser.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Simulator 1: AI Clinical Triage */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={22} color="var(--teal-accent)" />
            AI Symptom Triage Assistant
          </h3>
          
          <form onSubmit={handleRunDemo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Test Clinical Symptoms Input
              </label>
              <textarea 
                className="input-field" 
                rows={3} 
                value={symptoms} 
                onChange={e => setSymptoms(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Sparkles size={16} />
              <span>{loading ? 'AI Engine Processing...' : 'Test AI Symptom Analysis'}</span>
            </button>
          </form>

          {demoResult && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700' }}>Triage Level: <span style={{ color: 'var(--warning)' }}>{demoResult.triage_level}</span></span>
                <span className="badge badge-primary">{demoResult.confidence}% Confidence</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Department: <strong style={{ color: 'var(--primary)' }}>{demoResult.department}</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{demoResult.notes}</p>
            </div>
          )}
        </div>

        {/* Simulator 2: Live FEFO Batch Alerts */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={22} color="var(--primary)" />
            Live FEFO Batch Expiry Stream
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {aiRiskData.length > 0 ? (
              aiRiskData.map(item => (
                <div key={item.id} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: '4px solid var(--warning)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.brand_name} ({item.generic_name})</span>
                    <span className="badge badge-warning">Risk: {item.expiry_risk_score}%</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Batch: <strong>{item.batch_number}</strong> • Exp: <strong style={{ color: 'var(--danger)' }}>{item.exp_date}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <strong>AI Recommendation:</strong> {item.ai_recommendation}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                FEFO Expiry Engine active — No urgent batch decays detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
