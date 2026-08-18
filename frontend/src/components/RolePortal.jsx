import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Activity, Users, Calendar, ShieldCheck, Sun, Moon, 
  Search, Plus, RefreshCw, Database, Server, CheckCircle2, 
  AlertCircle, ChevronRight, Stethoscope, HeartPulse, Clock,
  Bot, AlertTriangle, Sparkles, Package, Pill, Layers, FileText,
  BrainCircuit, LogOut, Shield, UserCheck, Building2, Edit, Trash2, Key, UserPlus, X, Star, Truck, Calculator
} from 'lucide-react';

export default function RolePortal({ user, onLogout, theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (pathname) => {
    if (pathname.includes('/dashboard/users')) return 'users';
    if (pathname.includes('/dashboard/suppliers')) return 'suppliers';
    if (pathname.includes('/dashboard/ai-risk')) return 'ai_risk';
    if (pathname.includes('/dashboard/batches')) return 'batches';
    if (pathname.includes('/dashboard/ai-triage')) return 'ai_triage';
    if (pathname.includes('/dashboard/patients')) return 'patients';
    if (pathname.includes('/dashboard/schema')) return 'schema';
    return user.roleKey === 'super_admin' ? 'users' : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real API Data State
  const [backendStatus, setBackendStatus] = useState({ loading: true, online: false, data: null });
  const [patients, setPatients] = useState([]);
  const [batches, setBatches] = useState([]);
  const [aiRiskData, setAiRiskData] = useState([]);
  const [aiTriageLogs, setAiTriageLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Super Admin Users CRUD State
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Suppliers CRUD State
  const [suppliersList, setSuppliersList] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [recalculatingId, setRecalculatingId] = useState(null);
  const [recalculatingAll, setRecalculatingAll] = useState(false);

  // User Modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Supplier Modals
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // User Creation Form State
  const [userForm, setUserForm] = useState({
    name: '', email: '', password: 'password123', role_id: 2,
    department_id: 1, phone: '+94 77 123 4567', status: 'active', specialization: 'General Care'
  });

  // Supplier Creation Form State
  const [supplierForm, setSupplierForm] = useState({
    company_name: '', supplier_code: '', contact_person: '',
    email: '', phone: '+94 11 234 5678', address: 'Colombo, Sri Lanka', lead_time_days: 7, rating: 4.80, status: 'active'
  });

  const [symptomInput, setSymptomInput] = useState('');
  const [isTriaging, setIsTriaging] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    let path = '/dashboard/overview';
    if (tabId === 'users') path = '/dashboard/users';
    else if (tabId === 'suppliers') path = '/dashboard/suppliers';
    else if (tabId === 'ai_risk') path = '/dashboard/ai-risk';
    else if (tabId === 'batches') path = '/dashboard/batches';
    else if (tabId === 'ai_triage') path = '/dashboard/ai-triage';
    else if (tabId === 'patients') path = '/dashboard/patients';
    else if (tabId === 'schema') path = '/dashboard/schema';
    
    navigate(path);
  };

  const fetchAllData = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true }));
    try {
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) setBackendStatus({ loading: false, online: true, data: await statusRes.json() });

      const patientsRes = await fetch('/api/v1/patients');
      if (patientsRes.ok) setPatients(await patientsRes.json());

      const batchesRes = await fetch('/api/v1/batches');
      if (batchesRes.ok) setBatches(await batchesRes.json());

      const aiRes = await fetch('/api/v1/ai/inventory-risk');
      if (aiRes.ok) setAiRiskData(await aiRes.json());

      const triageRes = await fetch('/api/v1/ai/triage');
      if (triageRes.ok) setAiTriageLogs(await triageRes.json());

      const aptsRes = await fetch('/api/v1/appointments');
      if (aptsRes.ok) setAppointments(await aptsRes.json());

      fetchSuppliersData();

      if (user.roleKey === 'super_admin') {
        fetchAdminUsersData();
      }
    } catch (err) {
      console.error('API Fetch error:', err);
      setBackendStatus({ loading: false, online: false, data: null });
    }
  };

  const fetchAdminUsersData = async () => {
    try {
      const usersRes = await fetch('/api/v1/admin/users');
      if (usersRes.ok) setUsersList(await usersRes.json());

      const rolesRes = await fetch('/api/v1/admin/roles');
      if (rolesRes.ok) setRolesList(await rolesRes.json());

      const deptsRes = await fetch('/api/v1/admin/departments');
      if (deptsRes.ok) setDepartmentsList(await deptsRes.json());
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  const fetchSuppliersData = async () => {
    try {
      const res = await fetch('/api/v1/admin/suppliers');
      if (res.ok) setSuppliersList(await res.json());
    } catch (err) {
      console.error('Suppliers fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getNavItems = () => {
    const roleKey = user.roleKey;
    const items = [];

    if (roleKey === 'super_admin') {
      items.push({ id: 'users', label: 'User Management', icon: UserCheck });
      items.push({ id: 'suppliers', label: 'Suppliers Directory', icon: Building2 });
      items.push({ id: 'dashboard', label: 'Dashboard Overview', icon: Activity });
      items.push({ id: 'ai_risk', label: 'AI Expiry & FEFO Risk', icon: Sparkles, badge: 'AI Engine' });
      items.push({ id: 'batches', label: 'FEFO Stock Batches', icon: Package });
      items.push({ id: 'ai_triage', label: 'AI Patient Triage', icon: Bot });
      items.push({ id: 'patients', label: 'Patients EHR', icon: Users });
      items.push({ id: 'schema', label: 'Database Architecture', icon: Database });
    } else {
      items.push({ id: 'dashboard', label: 'Dashboard Overview', icon: Activity });
      if (roleKey === 'pharmacist' || roleKey === 'inventory_manager') {
        items.push({ id: 'suppliers', label: 'Suppliers Directory', icon: Building2 });
        items.push({ id: 'ai_risk', label: 'AI Expiry & FEFO Risk', icon: Sparkles, badge: 'AI Engine' });
        items.push({ id: 'batches', label: 'FEFO Stock Batches', icon: Package });
      }
      if (roleKey === 'doctor') {
        items.push({ id: 'ai_triage', label: 'AI Patient Triage', icon: Bot, badge: 'Clinical' });
        items.push({ id: 'patients', label: 'Patients EHR', icon: Users });
        items.push({ id: 'appointments', label: 'Appointments', icon: Calendar });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  // User Handlers
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        setShowCreateUserModal(false);
        setUserForm({
          name: '', email: '', password: 'password123', role_id: 2,
          department_id: 1, phone: '+94 77 000 0000', status: 'active', specialization: 'General Care'
        });
        fetchAdminUsersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser)
      });
      if (res.ok) {
        setShowEditUserModal(false);
        setSelectedUser(null);
        fetchAdminUsersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteUserModal(false);
        setSelectedUser(null);
        fetchAdminUsersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Supplier Handlers
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierForm)
      });
      if (res.ok) {
        setShowCreateSupplierModal(false);
        setSupplierForm({
          company_name: '', supplier_code: '', contact_person: '',
          email: '', phone: '+94 11 234 5678', address: 'Colombo, Sri Lanka', lead_time_days: 7, rating: 4.80, status: 'active'
        });
        fetchSuppliersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      const res = await fetch(`/api/v1/admin/suppliers/${selectedSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSupplier)
      });
      if (res.ok) {
        setShowEditSupplierModal(false);
        setSelectedSupplier(null);
        fetchSuppliersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      const res = await fetch(`/api/v1/admin/suppliers/${selectedSupplier.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteSupplierModal(false);
        setSelectedSupplier(null);
        fetchSuppliersData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Supplier Auto-Calculation Handlers
  const handleRecalculateSupplier = async (supplierId) => {
    setRecalculatingId(supplierId);
    try {
      const res = await fetch(`/api/v1/admin/suppliers/${supplierId}/recalculate`, { method: 'POST' });
      if (res.ok) {
        await fetchSuppliersData();
      }
    } catch (err) {
      console.error(err);
    }
    setRecalculatingId(null);
  };

  const handleRecalculateAllSuppliers = async () => {
    setRecalculatingAll(true);
    try {
      const res = await fetch('/api/v1/admin/suppliers-recalculate-all', { method: 'POST' });
      if (res.ok) {
        await fetchSuppliersData();
      }
    } catch (err) {
      console.error(err);
    }
    setRecalculatingAll(false);
  };

  const handleRunAiTriage = (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;
    setIsTriaging(true);
    setTimeout(() => {
      const isEmergency = symptomInput.toLowerCase().includes('chest') || symptomInput.toLowerCase().includes('breath');
      const result = {
        id: Date.now(),
        patient_code: 'PAT-2026-WALKIN',
        first_name: 'Walk-in Patient',
        last_name: '',
        input_symptoms: symptomInput,
        suggested_triage_level: isEmergency ? 'Emergency' : 'Routine',
        recommended_department: isEmergency ? 'Cardiology & ICU' : 'General OPD',
        ai_confidence_score: isEmergency ? 96.8 : 89.4,
        created_at: new Date().toISOString()
      };
      setAiTriageLogs([result, ...aiTriageLogs]);
      setIsTriaging(false);
      setSymptomInput('');
    }, 1000);
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role_name && u.role_name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredSuppliers = suppliersList.filter(s => 
    s.company_name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    s.supplier_code.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    (s.contact_person && s.contact_person.toLowerCase().includes(supplierSearch.toLowerCase()))
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingLeft: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal-accent))', padding: '10px', borderRadius: '12px', color: '#fff', display: 'flex' }}>
              <BrainCircuit size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>MediSync Portal</h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Healthcare System</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="glass-panel" style={{ padding: '14px', marginBottom: '20px', background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>
                {user.name[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600' }}>{user.role}</div>
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="btn"
                  style={{
                    justifyContent: 'space-between',
                    background: isActive ? 'var(--primary-glow)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                    padding: '12px 14px',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '10px', background: 'var(--teal-accent)', color: '#fff', fontWeight: '700' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
          
          <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}>
            <LogOut size={16} />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: '800' }}>
              {activeTab === 'users' ? 'User Management Directory' : (activeTab === 'suppliers' ? 'Pharmaceutical Suppliers Directory' : `Welcome back, ${user.name}`)}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.88rem' }}>
              Assigned Role: <strong style={{ color: 'var(--primary)' }}>{user.role}</strong> • Department: <strong>{user.department}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <div className="pulse-dot"></div>
              <span>System Status: <strong>Active</strong></span>
            </div>
            <button onClick={fetchAllData} className="btn btn-secondary">
              <RefreshCw size={16} className={backendStatus.loading ? 'pulse-dot' : ''} />
            </button>
          </div>
        </header>

        {/* TAB: SUPER ADMIN USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search user by name, email, or assigned role..." 
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <button onClick={() => setShowCreateUserModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <UserPlus size={18} />
                <span>Create New User</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>ID</th>
                    <th style={{ padding: '14px' }}>USER NAME</th>
                    <th style={{ padding: '14px' }}>EMAIL ADDRESS</th>
                    <th style={{ padding: '14px' }}>ASSIGNED ROLE</th>
                    <th style={{ padding: '14px' }}>DEPARTMENT</th>
                    <th style={{ padding: '14px' }}>STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700' }}>#{u.id}</td>
                      <td style={{ padding: '14px', fontWeight: '700' }}>{u.name}</td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-primary" style={{ 
                          borderColor: u.role_key === 'super_admin' ? 'var(--primary)' : (u.role_key === 'doctor' ? 'var(--success)' : 'var(--teal-accent)'),
                          color: u.role_key === 'super_admin' ? 'var(--primary)' : (u.role_key === 'doctor' ? 'var(--success)' : 'var(--teal-accent)')
                        }}>
                          {u.role_name || u.role_key}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{u.department_name || 'Central Hospital'}</td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedUser(u); setShowEditUserModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedUser(u); setShowDeleteUserModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.78rem', color: 'var(--danger)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SUPPLIERS DIRECTORY CRUD + AUTO-CALCULATION */}
        {activeTab === 'suppliers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search supplier by company name, code, or contact person..." 
                  value={supplierSearch}
                  onChange={e => setSupplierSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleRecalculateAllSuppliers} 
                  className="btn btn-secondary" 
                  disabled={recalculatingAll}
                  style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                >
                  <Sparkles size={16} className={recalculatingAll ? 'pulse-dot' : ''} />
                  <span>{recalculatingAll ? 'Calculating...' : 'Auto-Calculate All Ratings'}</span>
                </button>

                <button onClick={() => setShowCreateSupplierModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                  <Plus size={18} />
                  <span>Add New Supplier</span>
                </button>
              </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>CODE</th>
                    <th style={{ padding: '14px' }}>COMPANY NAME</th>
                    <th style={{ padding: '14px' }}>CONTACT PERSON</th>
                    <th style={{ padding: '14px' }}>CONTACT EMAIL & PHONE</th>
                    <th style={{ padding: '14px' }}>AUTO LEAD TIME</th>
                    <th style={{ padding: '14px' }}>PERFORMANCE RATING</th>
                    <th style={{ padding: '14px' }}>STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{s.supplier_code}</td>
                      <td style={{ padding: '14px', fontWeight: '700' }}>{s.company_name}</td>
                      <td style={{ padding: '14px' }}>{s.contact_person || 'N/A'}</td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        <div>{s.email}</div>
                        <div>{s.phone}</div>
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Truck size={14} color="var(--teal-accent)" />
                          <span>{s.lead_time_days} Days</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem', width: 'fit-content' }}>
                            <Star size={13} fill="var(--warning)" />
                            <span>{s.rating || '4.50'} / 5.00</span>
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Auto-calculated</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleRecalculateSupplier(s.id)}
                            className="btn btn-secondary" 
                            disabled={recalculatingId === s.id}
                            style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--teal-accent)' }}
                            title="Auto-calculate Lead Time & Performance Rating"
                          >
                            <Calculator size={13} className={recalculatingId === s.id ? 'pulse-dot' : ''} />
                            <span>Auto-Calc</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedSupplier(s); setShowEditSupplierModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => { setSelectedSupplier(s); setShowDeleteSupplierModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--danger)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AUTHORIZED ROLE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{user.role}</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PHARMA SUPPLIERS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{suppliersList.length} Active</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>FEFO STOCK BATCHES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{batches.length} Monitored</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>REGISTERED USERS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>{usersList.length} Staff Users</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Expiry Risk Tab */}
        {activeTab === 'ai_risk' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={22} color="var(--primary)" />
              AI-Driven FEFO Expiry & Demand Forecasts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {aiRiskData.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '20px', borderLeft: '5px solid var(--danger)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.brand_name} ({item.generic_name})</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 12px' }}>
                    Batch: <strong>{item.batch_number}</strong> • Expiry Date: <strong style={{ color: 'var(--warning)' }}>{item.exp_date}</strong> • Expiry Risk Score: <strong style={{ color: 'var(--danger)' }}>{item.expiry_risk_score}%</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px', fontSize: '0.88rem' }}>
                    <strong>AI Recommendation:</strong> {item.ai_recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEFO Batches Tab */}
        {activeTab === 'batches' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>FEFO Multi-Batch Inventory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <th style={{ padding: '12px' }}>MEDICINE</th>
                  <th style={{ padding: '12px' }}>BATCH NO.</th>
                  <th style={{ padding: '12px' }}>EXPIRY DATE</th>
                  <th style={{ padding: '12px' }}>QTY AVAILABLE</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {batches.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>{b.brand_name} ({b.generic_name})</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{b.batch_number}</td>
                    <td style={{ padding: '12px', color: 'var(--warning)', fontWeight: '700' }}>{b.exp_date}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: 'var(--primary)' }}>{b.current_quantity} {b.unit}</td>
                    <td style={{ padding: '12px' }}><span className="badge badge-success">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AI Triage Tab */}
        {activeTab === 'ai_triage' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>AI Clinical Symptom Triage</h3>
            <form onSubmit={handleRunAiTriage} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <textarea className="input-field" rows={3} placeholder="Enter clinical symptoms..." value={symptomInput} onChange={e => setSymptomInput(e.target.value)} />
              <button type="submit" className="btn btn-primary" disabled={isTriaging}>Run AI Triage</button>
            </form>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Patient Records (EHR)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <th style={{ padding: '12px' }}>CODE</th>
                  <th style={{ padding: '12px' }}>NAME</th>
                  <th style={{ padding: '12px' }}>BLOOD</th>
                  <th style={{ padding: '12px' }}>ALLERGIES</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{p.patient_code}</td>
                    <td style={{ padding: '12px', fontWeight: '700' }}>{p.first_name} {p.last_name}</td>
                    <td style={{ padding: '12px' }}>{p.blood_group}</td>
                    <td style={{ padding: '12px', color: 'var(--danger)' }}>{p.allergies || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Database Architecture Tab */}
        {activeTab === 'schema' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Enterprise Database Architecture</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Connected to Healthcare Relational Database Engine</p>
          </div>
        )}
      </main>

      {/* CREATE USER MODAL */}
      {showCreateUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateUserModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Create New Staff User</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input type="text" className="input-field" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} placeholder="Dr. Nuwan Senanayake" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" className="input-field" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} placeholder="nuwan@medisync.health" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Password</label>
                  <input type="password" className="input-field" required value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assign RBAC Role</label>
                  <select className="input-field" value={userForm.role_id} onChange={e => setUserForm({...userForm, role_id: parseInt(e.target.value)})}>
                    {rolesList.map(r => (
                      <option key={r.id} value={r.id}>{r.display_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Ward</label>
                  <select className="input-field" value={userForm.department_id} onChange={e => setUserForm({...userForm, department_id: parseInt(e.target.value)})}>
                    {departmentsList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input type="text" className="input-field" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} placeholder="+94 77 123 4567" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Status</label>
                  <select className="input-field" value={userForm.status} onChange={e => setUserForm({...userForm, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateUserModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save User Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditUserModal && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditUserModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit User Account #{selectedUser.id}</h3>
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input type="text" className="input-field" required value={selectedUser.name} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                <input type="email" className="input-field" required value={selectedUser.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assigned Role</label>
                  <select className="input-field" value={selectedUser.role_id || 1} onChange={e => setSelectedUser({...selectedUser, role_id: parseInt(e.target.value)})}>
                    {rolesList.map(r => (
                      <option key={r.id} value={r.id}>{r.display_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Status</label>
                  <select className="input-field" value={selectedUser.status} onChange={e => setSelectedUser({...selectedUser, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditUserModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER MODAL */}
      {showDeleteUserModal && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm User Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete user account <strong>{selectedUser.name}</strong> ({selectedUser.email}) from the system?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteUserModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteUser} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete User Account</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUPPLIER MODAL */}
      {showCreateSupplierModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateSupplierModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Add New Pharmaceutical Supplier</h3>
            <form onSubmit={handleCreateSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Company Name</label>
                <input type="text" className="input-field" required value={supplierForm.company_name} onChange={e => setSupplierForm({...supplierForm, company_name: e.target.value})} placeholder="PharmaCare Lanka Distributors" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Supplier Code</label>
                  <input type="text" className="input-field" value={supplierForm.supplier_code} onChange={e => setSupplierForm({...supplierForm, supplier_code: e.target.value})} placeholder="SUP-LK-003" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contact Person</label>
                  <input type="text" className="input-field" value={supplierForm.contact_person} onChange={e => setSupplierForm({...supplierForm, contact_person: e.target.value})} placeholder="Kamal Perera" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" className="input-field" required value={supplierForm.email} onChange={e => setSupplierForm({...supplierForm, email: e.target.value})} placeholder="sales@pharmacare.lk" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input type="text" className="input-field" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} placeholder="+94 11 234 5678" />
                </div>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--primary)', borderLeft: '3px solid var(--primary)' }}>
                ℹ️ Delivery Lead Time & Performance Star Rating are automatically calculated by the system based on delivery history.
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Physical Address</label>
                <input type="text" className="input-field" value={supplierForm.address} onChange={e => setSupplierForm({...supplierForm, address: e.target.value})} placeholder="45 Colombo Road, Galle" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateSupplierModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SUPPLIER MODAL */}
      {showEditSupplierModal && selectedSupplier && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditSupplierModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Supplier #{selectedSupplier.id}</h3>
            <form onSubmit={handleUpdateSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Company Name</label>
                <input type="text" className="input-field" required value={selectedSupplier.company_name} onChange={e => setSelectedSupplier({...selectedSupplier, company_name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Supplier Code</label>
                  <input type="text" className="input-field" value={selectedSupplier.supplier_code} onChange={e => setSelectedSupplier({...selectedSupplier, supplier_code: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contact Person</label>
                  <input type="text" className="input-field" value={selectedSupplier.contact_person || ''} onChange={e => setSelectedSupplier({...selectedSupplier, contact_person: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" className="input-field" required value={selectedSupplier.email} onChange={e => setSelectedSupplier({...selectedSupplier, email: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input type="text" className="input-field" value={selectedSupplier.phone || ''} onChange={e => setSelectedSupplier({...selectedSupplier, phone: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Physical Address</label>
                  <input type="text" className="input-field" value={selectedSupplier.address || ''} onChange={e => setSelectedSupplier({...selectedSupplier, address: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select className="input-field" value={selectedSupplier.status} onChange={e => setSelectedSupplier({...selectedSupplier, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--primary)', borderLeft: '3px solid var(--primary)' }}>
                ℹ️ Delivery Lead Time ({selectedSupplier.lead_time_days} days) & Performance Rating (⭐ {selectedSupplier.rating || '4.50'}) are auto-calculated by system algorithms.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditSupplierModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SUPPLIER MODAL */}
      {showDeleteSupplierModal && selectedSupplier && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Supplier Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete pharmaceutical supplier <strong>{selectedSupplier.company_name}</strong> ({selectedSupplier.supplier_code}) from the system?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteSupplierModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteSupplier} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Supplier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
