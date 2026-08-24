import React, { useState } from 'react';
import { X, Search, HeartPulse, FileText, Calendar, AlertTriangle, ShieldCheck, UserCheck, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PatientPortalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [patientCode, setPatientCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Loaded Patient Portal Data
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('prescriptions'); // 'prescriptions' | 'appointments' | 'request_booking'

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    consultation_type: 'General Follow-Up',
    clinical_reason: '',
    appointment_date: ''
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const handleLookupPatient = async (e) => {
    if (e) e.preventDefault();
    if (!patientCode.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/v1/patient-portal/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_code: patientCode.trim() })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setPatientData(data.patient);
        setPrescriptions(data.prescriptions || []);
        setAppointments(data.appointments || []);
      } else {
        setErrorMsg(data.message || 'No patient EHR record found matching that code or NIC.');
      }
    } catch (err) {
      console.error('Patient lookup error:', err);
      setLoading(false);
      setErrorMsg('Network error connecting to patient portal.');
    }
  };

  const handleFillSampleCode = (code) => {
    setPatientCode(code);
    setErrorMsg('');
  };

  const handleRequestBookingSubmit = async (e) => {
    e.preventDefault();
    if (!patientData) return;

    setIsSubmittingBooking(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/v1/patient-portal/request-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientData.id,
          consultation_type: bookingForm.consultation_type,
          clinical_reason: bookingForm.clinical_reason,
          appointment_date: bookingForm.appointment_date || new Date(Date.now() + 86400000).toISOString().slice(0, 16)
        })
      });

      const data = await res.json();
      setIsSubmittingBooking(false);

      if (res.ok && data.success) {
        setSuccessMsg('Follow-up appointment requested successfully! Our clinical desk will confirm your slot.');
        setBookingForm({ consultation_type: 'General Follow-Up', clinical_reason: '', appointment_date: '' });
        // Refresh lookup
        handleLookupPatient(null);
      } else {
        setErrorMsg(data.message || 'Failed to submit appointment request.');
      }
    } catch (err) {
      console.error(err);
      setIsSubmittingBooking(false);
      setErrorMsg('Network error submitting appointment request.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative', borderRadius: '20px' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '24px', top: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={22} />
        </button>

        {/* HEADER TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '12px', borderRadius: '14px', color: 'var(--primary)' }}>
            <HeartPulse size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Patient Self-Service Web Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Access active prescriptions, EHR allergy records, consultation history, and request follow-up bookings.
            </p>
          </div>
        </div>

        {/* STEP 1: PATIENT CODE / NIC LOOKUP SEARCH FORM */}
        {!patientData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLookupPatient} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  placeholder="Enter Patient Code (e.g. PAT-2026-001) or NIC / Passport..." 
                  value={patientCode} 
                  onChange={e => setPatientCode(e.target.value)} 
                  style={{ paddingLeft: '42px', fontSize: '0.95rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px 24px', flexShrink: 0 }}>
                {loading ? 'Searching EHR...' : 'Access My Medical Hub'}
              </button>
            </form>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '8px' }}>
                SAMPLE PATIENT EHR CODES FOR DEMO TESTING:
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { code: 'PAT-2026-001', name: 'Eleanor Vance (O+ / Allergies)' },
                  { code: 'PAT-2026-002', name: 'Marcus Holloway (A+)' },
                  { code: '199264501988', name: 'Search by NIC Number' }
                ].map((sample, idx) => (
                  <button 
                    key={idx}
                    type="button" 
                    onClick={() => { handleFillSampleCode(sample.code); }}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--primary)' }}
                  >
                    <code>{sample.code}</code> ({sample.name})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PATIENT MEDICAL HUB DASHBOARD */}
        {patientData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Patient EHR Summary Card */}
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{patientData.first_name} {patientData.last_name}</h3>
                  <span style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700', fontFamily: 'monospace' }}>
                    {patientData.patient_code}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>DOB: <strong>{patientData.dob}</strong></span>
                  <span>Gender: <strong>{patientData.gender}</strong></span>
                  <span>Blood Group: <strong style={{ color: 'var(--teal-accent)' }}>{patientData.blood_group || 'O+'}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setPatientData(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                  Switch Patient Code
                </button>
              </div>
            </div>

            {/* Allergy Risk Banner */}
            {patientData.allergies && patientData.allergies.toLowerCase() !== 'none' && patientData.allergies.toLowerCase() !== 'none reported' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Recorded EHR Allergy Alerts:</strong> {patientData.allergies}
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <button 
                onClick={() => setActiveSubTab('prescriptions')} 
                className="btn" 
                style={{ background: activeSubTab === 'prescriptions' ? 'var(--primary)' : 'transparent', color: activeSubTab === 'prescriptions' ? '#fff' : 'var(--text-muted)', padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}
              >
                <FileText size={16} />
                <span>My Active Prescriptions (Rx) ({prescriptions.length})</span>
              </button>

              <button 
                onClick={() => setActiveSubTab('appointments')} 
                className="btn" 
                style={{ background: activeSubTab === 'appointments' ? 'var(--primary)' : 'transparent', color: activeSubTab === 'appointments' ? '#fff' : 'var(--text-muted)', padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}
              >
                <Calendar size={16} />
                <span>Consultations & Bookings ({appointments.length})</span>
              </button>

              <button 
                onClick={() => setActiveSubTab('request_booking')} 
                className="btn" 
                style={{ background: activeSubTab === 'request_booking' ? 'var(--primary)' : 'transparent', color: activeSubTab === 'request_booking' ? '#fff' : 'var(--text-muted)', padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}
              >
                <Plus size={16} />
                <span>Request Follow-Up Slot</span>
              </button>
            </div>

            {/* SUB-VIEW 1: ACTIVE PRESCRIPTIONS */}
            {activeSubTab === 'prescriptions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {prescriptions.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No active prescriptions currently on record.
                  </div>
                ) : (
                  prescriptions.map((rx) => (
                    <div key={rx.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                            {rx.prescription_code}
                          </span>
                          <span className={`badge ${rx.status === 'DISPENSED' ? 'badge-success' : 'badge-warning'}`}>
                            {rx.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Prescribed by: <strong>Dr. {rx.doctor_first} {rx.doctor_last}</strong> ({rx.specialization})
                        </div>
                        {rx.clinical_notes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px', fontStyle: 'italic' }}>
                            "{rx.clinical_notes}"
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        <div>Issued: {new Date(rx.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-VIEW 2: CONSULTATION APPOINTMENT HISTORY */}
            {activeSubTab === 'appointments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No past or upcoming appointments on record.
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '2px' }}>
                          {apt.consultation_type} • <span style={{ color: 'var(--primary)' }}>Dr. {apt.doctor_first} {apt.doctor_last}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Reason: {apt.clinical_reason || 'General checkup'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${apt.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                          {apt.status}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {apt.appointment_date}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-VIEW 3: REQUEST FOLLOW-UP BOOKING FORM */}
            {activeSubTab === 'request_booking' && (
              <form onSubmit={handleRequestBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {successMsg && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--success)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    Consultation Type
                  </label>
                  <select 
                    className="input-field" 
                    value={bookingForm.consultation_type} 
                    onChange={e => setBookingForm({...bookingForm, consultation_type: e.target.value})}
                  >
                    <option value="General Follow-Up">General Follow-Up Consultation</option>
                    <option value="Prescription Refill Request">Prescription Refill Request</option>
                    <option value="Cardiology Checkup">Cardiology Checkup</option>
                    <option value="OPD Specialist Review">OPD Specialist Review</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    Preferred Date & Time
                  </label>
                  <input 
                    type="datetime-local" 
                    className="input-field" 
                    required 
                    value={bookingForm.appointment_date} 
                    onChange={e => setBookingForm({...bookingForm, appointment_date: e.target.value})} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    Clinical Symptoms / Reason for Request
                  </label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    required 
                    placeholder="Briefly describe symptoms or reasons for follow-up appointment request..." 
                    value={bookingForm.clinical_reason} 
                    onChange={e => setBookingForm({...bookingForm, clinical_reason: e.target.value})} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button type="submit" className="btn btn-primary" disabled={isSubmittingBooking} style={{ padding: '12px 24px' }}>
                    <Plus size={18} />
                    <span>{isSubmittingBooking ? 'Submitting Request...' : 'Submit Appointment Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
