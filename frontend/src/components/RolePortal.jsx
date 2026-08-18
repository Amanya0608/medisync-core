import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Activity, Users, Calendar, ShieldCheck, Sun, Moon, 
  Search, Plus, RefreshCw, Database, Server, CheckCircle2, 
  AlertCircle, ChevronRight, Stethoscope, HeartPulse, Clock,
  Bot, AlertTriangle, Sparkles, Package, Pill, Layers, FileText,
  BrainCircuit, LogOut, Shield, UserCheck, Building2, Edit, Trash2, Key, UserPlus, X, Star, Truck, Calculator, Send, MessageSquare, Check, Printer
} from 'lucide-react';

export default function RolePortal({ user, onLogout, theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (pathname) => {
    if (pathname.includes('/dashboard/users')) return 'users';
    if (pathname.includes('/dashboard/departments')) return 'departments';
    if (pathname.includes('/dashboard/staff')) return 'staff';
    if (pathname.includes('/dashboard/medicines')) return 'medicines';
    if (pathname.includes('/dashboard/categories')) return 'categories';
    if (pathname.includes('/dashboard/suppliers')) return 'suppliers';
    if (pathname.includes('/dashboard/ai-risk')) return 'ai_risk';
    if (pathname.includes('/dashboard/batches')) return 'batches';
    if (pathname.includes('/dashboard/ai-triage')) return 'ai_triage';
    if (pathname.includes('/dashboard/patients')) return 'patients';
    if (pathname.includes('/dashboard/appointments')) return 'appointments';
    if (pathname.includes('/dashboard/prescriptions')) return 'prescriptions';
    if (pathname.includes('/dashboard/permissions')) return 'permissions';
    if (pathname.includes('/dashboard/schema')) return 'schema';
    return user.roleKey === 'super_admin' ? 'users' : 'dashboard';
  };


  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  
  // Real API Data State
  const [backendStatus, setBackendStatus] = useState({ loading: true, online: false, data: null });
  const [patients, setPatients] = useState([]);
  const [batches, setBatches] = useState([]);
  const [aiRiskData, setAiRiskData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [auditLogsList, setAuditLogsList] = useState([]);


  // FEFO Medicine Batches & Inventory Transactions State
  const [batchesList, setBatchesList] = useState([]);
  const [batchSearch, setBatchSearch] = useState('');
  const [batchStatusFilter, setBatchStatusFilter] = useState('all');
  const [batchSubTab, setBatchSubTab] = useState('inventory'); // 'inventory' or 'transactions'
  const [transactionsList, setTransactionsList] = useState([]);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [showDeleteBatchModal, setShowDeleteBatchModal] = useState(false);
  const [showRecordTransactionModal, setShowRecordTransactionModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // AI Expiry Risk & Inventory Intelligence State
  const [aiRiskSearch, setAiRiskSearch] = useState('');
  const [aiRiskFilter, setAiRiskFilter] = useState('all');
  const [isGeneratingAiRisk, setIsGeneratingAiRisk] = useState(false);

  // Permissions & Access Control State
  const [permissionsList, setPermissionsList] = useState([]);
  const [rolePermissionsMatrix, setRolePermissionsMatrix] = useState({ roles: [], permissions: [], matrix: {} });
  const [permissionSubTab, setPermissionSubTab] = useState('matrix'); // 'matrix' or 'directory'
  const [permissionSearch, setPermissionSearch] = useState('');
  const [permissionModuleFilter, setPermissionModuleFilter] = useState('all');
  const [showCreatePermissionModal, setShowCreatePermissionModal] = useState(false);
  const [showEditPermissionModal, setShowEditPermissionModal] = useState(false);
  const [showDeletePermissionModal, setShowDeletePermissionModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [permissionForm, setPermissionForm] = useState({ name: '', display_name: '', module: 'general' });




  // Appointments CRUD State
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [showDeleteAppointmentModal, setShowDeleteAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Prescriptions CRUD State
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [prescriptionSearch, setPrescriptionSearch] = useState('');
  const [prescriptionStatusFilter, setPrescriptionStatusFilter] = useState('all');
  const [showCreatePrescriptionModal, setShowCreatePrescriptionModal] = useState(false);
  const [showEditPrescriptionModal, setShowEditPrescriptionModal] = useState(false);
  const [showDeletePrescriptionModal, setShowDeletePrescriptionModal] = useState(false);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Super Admin Users State
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Department CRUD State
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [showDeleteDepartmentModal, setShowDeleteDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Staff Roster CRUD State
  const [staffList, setStaffList] = useState([]);
  const [staffSearch, setStaffSearch] = useState('');
  const [dutyFilter, setDutyFilter] = useState('all');

  // Patients CRUD State
  const [patientSearch, setPatientSearch] = useState('');
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showDeletePatientModal, setShowDeletePatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Medicine Categories State
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Medicines Formulary CRUD State
  const [medicinesList, setMedicinesList] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [showCreateMedicineModal, setShowCreateMedicineModal] = useState(false);
  const [showEditMedicineModal, setShowEditMedicineModal] = useState(false);
  const [showDeleteMedicineModal, setShowDeleteMedicineModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Suppliers CRUD State
  const [suppliersList, setSuppliersList] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [recalculatingId, setRecalculatingId] = useState(null);
  const [recalculatingAll, setRecalculatingAll] = useState(false);

  // AI Triage & Chat State
  const [triageLogsList, setTriageLogsList] = useState([]);
  const [triageSearch, setTriageSearch] = useState('');
  const [triageSubView, setTriageSubView] = useState('chat');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am MediSync AI Clinical Triage Assistant. Please describe your symptoms or patient presentation for instant triage evaluation, department routing, and medication recommendations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedPatientForTriage, setSelectedPatientForTriage] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Doctor Triage Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedTriageLog, setSelectedTriageLog] = useState(null);

  // User Modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Staff Modals
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showDeleteStaffModal, setShowDeleteStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Supplier Modals
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Form States
  const [prescriptionForm, setPrescriptionForm] = useState({
    patient_id: 1, doctor_id: 1, appointment_id: '', status: 'ISSUED',
    clinical_notes: 'Take prescribed medication after meals as directed.',
    items: [
      { medicine_id: 1, dosage: '500mg', frequency: 'BD - Twice daily', duration_days: 7, quantity_prescribed: 14, instructions: 'Take with plenty of water after food' }
    ]
  });

  const [batchForm, setBatchForm] = useState({
    medicine_id: 1, supplier_id: 1, batch_number: 'AMX-2026-N1',
    mfd_date: '2025-06-01', exp_date: '2027-06-01', initial_quantity: 500,
    unit_cost: 25.00, storage_location: 'Main Pharmacy Shelf - Rack A-01', status: 'available'
  });

  const [transactionForm, setTransactionForm] = useState({
    batch_id: 1, transaction_type: 'RESTOCK', quantity: 100, notes: 'Routine stock intake'
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patient_id: 1, doctor_id: 1, appointment_date: new Date().toISOString().slice(0, 16),
    type: 'Consultation', priority: 'Normal', status: 'Scheduled', reason: 'Routine clinical consultation'
  });


  const [userForm, setUserForm] = useState({
    name: '', email: '', password: 'password123', role_id: 2,
    department_id: 1, phone: '+94 77 123 4567', status: 'active', specialization: 'General Care'
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '', code: '', description: '', location_floor: 'Ground Floor - Wing A', status: 'active'
  });

  const [staffForm, setStaffForm] = useState({
    first_name: '', last_name: '', email: '', password: 'password123',
    role_id: 3, department_id: 1, specialization: 'General Medicine',
    license_number: 'SLMC-MED-' + Math.floor(1000 + Math.random() * 9000),
    phone: '+94 77 123 4567', duty_status: 'on_duty', employee_code: ''
  });

  const [patientForm, setPatientForm] = useState({
    first_name: '', last_name: '', dob: '1995-04-12', gender: 'Female',
    nic_passport: '199564501988', phone: '+94 77 555 1234', email: '',
    blood_group: 'O+', emergency_contact_name: 'Saman Jayasinghe',
    emergency_contact_phone: '+94 71 888 9999', allergies: 'Penicillin',
    medical_history: 'Hypertension (Controlled)'
  });

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const [medicineForm, setMedicineForm] = useState({
    brand_name: '', generic_name: '', category_id: 1, dosage_form: 'Tablet',
    unit: 'pcs', min_reorder_level: 100, max_stock_capacity: 5000,
    unit_price: 35.00, prescription_required: true, status: 'active', barcode: ''
  });

  const [supplierForm, setSupplierForm] = useState({
    company_name: '', supplier_code: '', contact_person: '',
    email: '', phone: '+94 11 234 5678', address: 'Colombo, Sri Lanka', lead_time_days: 7, rating: 4.80, status: 'active'
  });

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tabId) => {

    setActiveTab(tabId);
    let path = '/dashboard/overview';
    if (tabId === 'users') path = '/dashboard/users';
    else if (tabId === 'departments') path = '/dashboard/departments';
    else if (tabId === 'staff') path = '/dashboard/staff';
    else if (tabId === 'medicines') path = '/dashboard/medicines';
    else if (tabId === 'categories') path = '/dashboard/categories';
    else if (tabId === 'suppliers') path = '/dashboard/suppliers';
    else if (tabId === 'ai_risk') path = '/dashboard/ai-risk';
    else if (tabId === 'batches') path = '/dashboard/batches';
    else if (tabId === 'ai_triage') path = '/dashboard/ai-triage';
    else if (tabId === 'patients') path = '/dashboard/patients';
    else if (tabId === 'appointments') path = '/dashboard/appointments';
    else if (tabId === 'prescriptions') path = '/dashboard/prescriptions';
    else if (tabId === 'permissions') path = '/dashboard/permissions';
    else if (tabId === 'schema') path = '/dashboard/schema';
    
    navigate(path);
  };

  const fetchAllData = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true }));
    try {
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) setBackendStatus({ loading: false, online: true, data: await statusRes.json() });

      fetchPatientsData();
      fetchCategoriesData();
      fetchMedicinesData();
      fetchDepartmentsData();
      fetchTriageLogsData();
      fetchAppointmentsData();
      fetchPrescriptionsData();
      fetchBatchesData();
      fetchTransactionsData();
      fetchAiRiskData();
      fetchPermissionsData();
      fetchRolePermissionsMatrix();
      fetchAuditLogsData();

      fetchStaffData();
      fetchSuppliersData();



      if (user.roleKey === 'super_admin') {
        fetchAdminUsersData();
      }
    } catch (err) {
      console.error('API Fetch error:', err);
      setBackendStatus({ loading: false, online: false, data: null });
    }
  };

  const fetchBatchesData = async () => {
    try {
      const res = await fetch('/api/v1/batches');
      if (res.ok) {
        const data = await res.json();
        setBatchesList(data);
        setBatches(data);
      }
    } catch (err) {
      console.error('Batches fetch error:', err);
    }
  };

  const fetchTransactionsData = async () => {
    try {
      const res = await fetch('/api/v1/inventory-transactions');
      if (res.ok) setTransactionsList(await res.json());
    } catch (err) {
      console.error('Transactions fetch error:', err);
    }
  };

  const fetchAuditLogsData = async () => {
    try {
      const res = await fetch('/api/v1/admin/audit-logs');
      if (res.ok) setAuditLogsList(await res.json());
    } catch (err) {
      console.error('Audit logs fetch error:', err);
    }
  };


  const fetchAiRiskData = async () => {
    try {
      const res = await fetch('/api/v1/ai/inventory-risk');
      if (res.ok) setAiRiskData(await res.json());
    } catch (err) {
      console.error('AI Risk fetch error:', err);
    }
  };

  const handleTriggerAiInventoryAnalysis = async () => {
    setIsGeneratingAiRisk(true);
    try {
      const res = await fetch('/api/v1/ai/generate-inventory-insights', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAiRiskData(data.insights || []);
      }
    } catch (err) {
      console.error(err);
    }
    setIsGeneratingAiRisk(false);
  };

  const handleDeleteAiRiskInsight = async (id) => {
    try {
      const res = await fetch(`/api/v1/ai/inventory-risk/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAiRiskData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Permissions & Access Control Handlers
  const fetchPermissionsData = async () => {
    try {
      const res = await fetch('/api/v1/admin/permissions');
      if (res.ok) setPermissionsList(await res.json());
    } catch (err) {
      console.error('Permissions fetch error:', err);
    }
  };

  const fetchRolePermissionsMatrix = async () => {
    try {
      const res = await fetch('/api/v1/admin/role-permissions-matrix');
      if (res.ok) setRolePermissionsMatrix(await res.json());
    } catch (err) {
      console.error('Permissions matrix fetch error:', err);
    }
  };

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissionForm)
      });
      if (res.ok) {
        setShowCreatePermissionModal(false);
        setPermissionForm({ name: '', display_name: '', module: 'general' });
        fetchPermissionsData();
        fetchRolePermissionsMatrix();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    if (!selectedPermission) return;
    try {
      const res = await fetch(`/api/v1/admin/permissions/${selectedPermission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPermission)
      });
      if (res.ok) {
        setShowEditPermissionModal(false);
        setSelectedPermission(null);
        fetchPermissionsData();
        fetchRolePermissionsMatrix();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePermission = async () => {
    if (!selectedPermission) return;
    try {
      const res = await fetch(`/api/v1/admin/permissions/${selectedPermission.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeletePermissionModal(false);
        setSelectedPermission(null);
        fetchPermissionsData();
        fetchRolePermissionsMatrix();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRolePermission = async (roleId, permissionId) => {
    try {
      const res = await fetch('/api/v1/admin/role-permissions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: roleId, permission_id: permissionId })
      });
      if (res.ok) {
        fetchRolePermissionsMatrix();
        fetchPermissionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };




  const fetchPrescriptionsData = async () => {
    try {
      const res = await fetch('/api/v1/prescriptions');
      if (res.ok) setPrescriptionsList(await res.json());
    } catch (err) {
      console.error('Prescriptions fetch error:', err);
    }
  };

  const fetchAppointmentsData = async () => {
    try {
      const res = await fetch('/api/v1/appointments');
      if (res.ok) setAppointments(await res.json());
    } catch (err) {
      console.error('Appointments fetch error:', err);
    }
  };

  const fetchTriageLogsData = async () => {
    try {
      const res = await fetch('/api/v1/ai/triage');
      if (res.ok) setTriageLogsList(await res.json());
    } catch (err) {
      console.error('Triage logs fetch error:', err);
    }
  };

  const fetchDepartmentsData = async () => {
    try {
      const res = await fetch('/api/v1/admin/departments');
      if (res.ok) setDepartmentsList(await res.json());
    } catch (err) {
      console.error('Departments fetch error:', err);
    }
  };

  const fetchPatientsData = async () => {
    try {
      const patientsRes = await fetch('/api/v1/patients');
      if (patientsRes.ok) setPatients(await patientsRes.json());
    } catch (err) {
      console.error('Patients fetch error:', err);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch('/api/v1/medicine-categories');
      if (res.ok) setCategoriesList(await res.json());
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const fetchMedicinesData = async () => {
    try {
      const res = await fetch('/api/v1/medicines');
      if (res.ok) setMedicinesList(await res.json());
    } catch (err) {
      console.error('Medicines fetch error:', err);
    }
  };

  const fetchAdminUsersData = async () => {
    try {
      const usersRes = await fetch('/api/v1/admin/users');
      if (usersRes.ok) setUsersList(await usersRes.json());

      const rolesRes = await fetch('/api/v1/admin/roles');
      if (rolesRes.ok) setRolesList(await rolesRes.json());
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  const fetchStaffData = async () => {
    try {
      const res = await fetch('/api/v1/admin/staff');
      if (res.ok) setStaffList(await res.json());
    } catch (err) {
      console.error('Staff fetch error:', err);
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
      items.push({ id: 'appointments', label: 'Appointments & Consultations', icon: Calendar });
      items.push({ id: 'prescriptions', label: 'Prescriptions (Rx)', icon: FileText });
      items.push({ id: 'ai_triage', label: 'AI Symptom Triage', icon: Bot, badge: 'AI Engine' });
      items.push({ id: 'departments', label: 'Departments & Wards', icon: Building2 });
      items.push({ id: 'staff', label: 'Hospital Staff Roster', icon: Stethoscope });
      items.push({ id: 'medicines', label: 'Medicine Formulary', icon: Pill });
      items.push({ id: 'categories', label: 'Medicine Categories', icon: Layers });
      items.push({ id: 'patients', label: 'Patient Records (EHR)', icon: Users });
      items.push({ id: 'suppliers', label: 'Suppliers Directory', icon: Building2 });
      items.push({ id: 'dashboard', label: 'Dashboard Overview', icon: Activity });
      items.push({ id: 'ai_risk', label: 'AI Expiry & FEFO Risk', icon: Sparkles, badge: 'AI Engine' });
      items.push({ id: 'batches', label: 'FEFO Stock Batches', icon: Package });
      items.push({ id: 'permissions', label: 'Permissions & Access Matrix', icon: Key });
      items.push({ id: 'schema', label: 'Database Architecture', icon: Database });

    } else {
      items.push({ id: 'dashboard', label: 'Dashboard Overview', icon: Activity });
      items.push({ id: 'appointments', label: 'Appointments & Consultations', icon: Calendar });
      items.push({ id: 'prescriptions', label: 'Prescriptions (Rx)', icon: FileText });
      items.push({ id: 'ai_triage', label: 'AI Symptom Triage', icon: Bot, badge: 'AI Engine' });
      items.push({ id: 'departments', label: 'Departments & Wards', icon: Building2 });
      items.push({ id: 'medicines', label: 'Medicine Formulary', icon: Pill });
      items.push({ id: 'categories', label: 'Medicine Categories', icon: Layers });
      items.push({ id: 'staff', label: 'Hospital Staff Roster', icon: Stethoscope });
      items.push({ id: 'patients', label: 'Patient Records (EHR)', icon: Users });
      if (roleKey === 'pharmacist' || roleKey === 'inventory_manager') {
        items.push({ id: 'suppliers', label: 'Suppliers Directory', icon: Building2 });
        items.push({ id: 'ai_risk', label: 'AI Expiry & FEFO Risk', icon: Sparkles, badge: 'AI Engine' });
        items.push({ id: 'batches', label: 'FEFO Stock Batches', icon: Package });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  // FEFO Stock Batches & Inventory Transactions Handlers
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm)
      });
      if (res.ok) {
        setShowCreateBatchModal(false);
        setBatchForm({
          medicine_id: medicinesList[0]?.id || 1, supplier_id: suppliersList[0]?.id || 1,
          batch_number: 'BATCH-' + Math.floor(1000 + Math.random() * 9000),
          mfd_date: new Date().toISOString().slice(0, 10),
          exp_date: new Date(Date.now() + 365*24*60*60*1000).toISOString().slice(0, 10),
          initial_quantity: 500, unit_cost: 25.00, storage_location: 'Main Pharmacy Shelf - Rack A-01', status: 'available'
        });
        fetchBatchesData();
        fetchTransactionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    try {
      const res = await fetch(`/api/v1/batches/${selectedBatch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBatch)
      });
      if (res.ok) {
        setShowEditBatchModal(false);
        setSelectedBatch(null);
        fetchBatchesData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBatch = async () => {
    if (!selectedBatch) return;
    try {
      const res = await fetch(`/api/v1/batches/${selectedBatch.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteBatchModal(false);
        setSelectedBatch(null);
        fetchBatchesData();
        fetchTransactionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/inventory-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionForm)
      });
      if (res.ok) {
        setShowRecordTransactionModal(false);
        setTransactionForm({
          batch_id: batchesList[0]?.id || 1, transaction_type: 'RESTOCK', quantity: 100, notes: 'Routine stock movement intake'
        });
        fetchBatchesData();
        fetchTransactionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prescription Handlers

  const handleAddPrescriptionItem = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { medicine_id: medicinesList[0]?.id || 1, dosage: '500mg', frequency: 'BD - Twice daily', duration_days: 7, quantity_prescribed: 14, instructions: 'Take with water after meals' }
      ]
    }));
  };

  const handleRemovePrescriptionItem = (index) => {
    setPrescriptionForm(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const handleUpdatePrescriptionItem = (index, field, value) => {
    setPrescriptionForm(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionForm)
      });
      if (res.ok) {
        setShowCreatePrescriptionModal(false);
        setPrescriptionForm({
          patient_id: patients[0]?.id || 1, doctor_id: staffList[0]?.id || 1, appointment_id: '', status: 'ISSUED',
          clinical_notes: 'Take prescribed medication after meals as directed.',
          items: [
            { medicine_id: medicinesList[0]?.id || 1, dosage: '500mg', frequency: 'BD - Twice daily', duration_days: 7, quantity_prescribed: 14, instructions: 'Take with plenty of water after food' }
          ]
        });
        fetchPrescriptionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePrescription = async (e) => {
    e.preventDefault();
    if (!selectedPrescription) return;
    try {
      const res = await fetch(`/api/v1/prescriptions/${selectedPrescription.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPrescription)
      });
      if (res.ok) {
        setShowEditPrescriptionModal(false);
        setSelectedPrescription(null);
        fetchPrescriptionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePrescription = async () => {
    if (!selectedPrescription) return;
    try {
      const res = await fetch(`/api/v1/prescriptions/${selectedPrescription.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeletePrescriptionModal(false);
        setSelectedPrescription(null);
        fetchPrescriptionsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenRxForAppointment = (apt) => {
    setPrescriptionForm({
      patient_id: apt.patient_id,
      doctor_id: apt.doctor_id,
      appointment_id: apt.id,
      status: 'ISSUED',
      clinical_notes: `Prescription issued following ${apt.type} appointment on ${apt.appointment_date}. Reason: ${apt.reason || 'Clinical Consultation'}.`,
      items: [
        { medicine_id: medicinesList[0]?.id || 1, dosage: '500mg', frequency: 'BD - Twice daily', duration_days: 7, quantity_prescribed: 14, instructions: 'Take after meals as prescribed' }
      ]
    });
    setShowCreatePrescriptionModal(true);
  };

  // Appointment Handlers
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentForm)
      });
      if (res.ok) {
        setShowCreateAppointmentModal(false);
        setAppointmentForm({
          patient_id: patients[0]?.id || 1, doctor_id: staffList[0]?.id || 1,
          appointment_date: new Date().toISOString().slice(0, 16),
          type: 'Consultation', priority: 'Normal', status: 'Scheduled', reason: 'Clinical evaluation'
        });
        fetchAppointmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    try {
      const res = await fetch(`/api/v1/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedAppointment)
      });
      if (res.ok) {
        setShowEditAppointmentModal(false);
        setSelectedAppointment(null);
        fetchAppointmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      const res = await fetch(`/api/v1/appointments/${selectedAppointment.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteAppointmentModal(false);
        setSelectedAppointment(null);
        fetchAppointmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Chat & Triage Handlers
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiProcessing) return;

    const userText = chatInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg = { id: Date.now(), sender: 'user', text: userText, timestamp: nowTime };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiProcessing(true);

    try {
      const res = await fetch('/api/v1/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_symptoms: userText,
          patient_id: selectedPatientForTriage ? parseInt(selectedPatientForTriage) : null
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.ai_response || data.clinical_summary,
          triage_level: data.suggested_triage_level,
          department: data.recommended_department,
          confidence: data.ai_confidence_score,
          medications: data.suggested_medications,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMsg]);
        fetchTriageLogsData();
      }
    } catch (err) {
      console.error('AI Clinical API error:', err);
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Error connecting to Clinical AI Engine. Please check system logs.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setIsAiProcessing(false);
  };

  const handleDoctorOverride = async (e) => {
    e.preventDefault();
    if (!selectedTriageLog) return;
    try {
      const res = await fetch(`/api/v1/ai/triage/${selectedTriageLog.id}/override`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTriageLog)
      });
      if (res.ok) {
        setShowOverrideModal(false);
        setSelectedTriageLog(null);
        fetchTriageLogsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Department Handlers
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentForm)
      });
      if (res.ok) {
        setShowCreateDepartmentModal(false);
        setDepartmentForm({ name: '', code: '', description: '', location_floor: 'Ground Floor - Wing A', status: 'active' });
        fetchDepartmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) return;
    try {
      const res = await fetch(`/api/v1/admin/departments/${selectedDepartment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedDepartment)
      });
      if (res.ok) {
        setShowEditDepartmentModal(false);
        setSelectedDepartment(null);
        fetchDepartmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    try {
      const res = await fetch(`/api/v1/admin/departments/${selectedDepartment.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteDepartmentModal(false);
        setSelectedDepartment(null);
        fetchDepartmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        fetchStaffData();
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
        fetchStaffData();
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
        fetchStaffData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Staff Handlers
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm)
      });
      if (res.ok) {
        setShowCreateStaffModal(false);
        setStaffForm({
          first_name: '', last_name: '', email: '', password: 'password123',
          role_id: 3, department_id: 1, specialization: 'General Medicine',
          license_number: 'SLMC-MED-' + Math.floor(1000 + Math.random() * 9000),
          phone: '+94 77 123 4567', duty_status: 'on_duty', employee_code: ''
        });
        fetchStaffData();
        fetchAdminUsersData();
        fetchDepartmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;
    try {
      const res = await fetch(`/api/v1/admin/staff/${selectedStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedStaff)
      });
      if (res.ok) {
        setShowEditStaffModal(false);
        setSelectedStaff(null);
        fetchStaffData();
        fetchAdminUsersData();
        fetchDepartmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
    try {
      const res = await fetch(`/api/v1/admin/staff/${selectedStaff.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteStaffModal(false);
        setSelectedStaff(null);
        fetchStaffData();
        fetchAdminUsersData();
        fetchDepartmentsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Medicine Handlers
  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineForm)
      });
      if (res.ok) {
        setShowCreateMedicineModal(false);
        setMedicineForm({
          brand_name: '', generic_name: '', category_id: 1, dosage_form: 'Tablet',
          unit: 'pcs', min_reorder_level: 100, max_stock_capacity: 5000,
          unit_price: 35.00, prescription_required: true, status: 'active', barcode: ''
        });
        fetchMedicinesData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    if (!selectedMedicine) return;
    try {
      const res = await fetch(`/api/v1/medicines/${selectedMedicine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedMedicine)
      });
      if (res.ok) {
        setShowEditMedicineModal(false);
        setSelectedMedicine(null);
        fetchMedicinesData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMedicine = async () => {
    if (!selectedMedicine) return;
    try {
      const res = await fetch(`/api/v1/medicines/${selectedMedicine.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteMedicineModal(false);
        setSelectedMedicine(null);
        fetchMedicinesData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Patient Handlers
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientForm)
      });
      if (res.ok) {
        setShowCreatePatientModal(false);
        setPatientForm({
          first_name: '', last_name: '', dob: '1995-04-12', gender: 'Female',
          nic_passport: '', phone: '+94 77 555 1234', email: '',
          blood_group: 'O+', emergency_contact_name: '',
          emergency_contact_phone: '', allergies: 'None',
          medical_history: 'Routine Clinical Care'
        });
        fetchPatientsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    try {
      const res = await fetch(`/api/v1/patients/${selectedPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPatient)
      });
      if (res.ok) {
        setShowEditPatientModal(false);
        setSelectedPatient(null);
        fetchPatientsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;
    try {
      const res = await fetch(`/api/v1/patients/${selectedPatient.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeletePatientModal(false);
        setSelectedPatient(null);
        fetchPatientsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Category Handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/medicine-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      if (res.ok) {
        setShowCreateCategoryModal(false);
        setCategoryForm({ name: '', description: '' });
        fetchCategoriesData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      const res = await fetch(`/api/v1/medicine-categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCategory)
      });
      if (res.ok) {
        setShowEditCategoryModal(false);
        setSelectedCategory(null);
        fetchCategoriesData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(`/api/v1/medicine-categories/${selectedCategory.id}`, { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteCategoryModal(false);
        setSelectedCategory(null);
        fetchCategoriesData();
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

  const filteredPrescriptions = prescriptionsList.filter(rx => {
    const matchesSearch = 
      (rx.prescription_code && rx.prescription_code.toLowerCase().includes(prescriptionSearch.toLowerCase())) ||
      (rx.patient_name && rx.patient_name.toLowerCase().includes(prescriptionSearch.toLowerCase())) ||
      (rx.patient_code && rx.patient_code.toLowerCase().includes(prescriptionSearch.toLowerCase())) ||
      (rx.doctor_name && rx.doctor_name.toLowerCase().includes(prescriptionSearch.toLowerCase())) ||
      (rx.clinical_notes && rx.clinical_notes.toLowerCase().includes(prescriptionSearch.toLowerCase())) ||
      (rx.items && rx.items.some(item => item.brand_name.toLowerCase().includes(prescriptionSearch.toLowerCase()) || item.generic_name.toLowerCase().includes(prescriptionSearch.toLowerCase())));

    if (prescriptionStatusFilter === 'all') return matchesSearch;
    return matchesSearch && rx.status === prescriptionStatusFilter;
  });

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      (a.patient_name && a.patient_name.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (a.patient_code && a.patient_code.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (a.doctor_name && a.doctor_name.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (a.specialization && a.specialization.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (a.reason && a.reason.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (a.type && a.type.toLowerCase().includes(appointmentSearch.toLowerCase()));

    if (appointmentStatusFilter === 'all') return matchesSearch;
    return matchesSearch && a.status === appointmentStatusFilter;
  });

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role_name && u.role_name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredTriageLogs = triageLogsList.filter(t => 
    t.input_symptoms.toLowerCase().includes(triageSearch.toLowerCase()) ||
    t.suggested_triage_level.toLowerCase().includes(triageSearch.toLowerCase()) ||
    t.recommended_department.toLowerCase().includes(triageSearch.toLowerCase()) ||
    (t.first_name && `${t.first_name} ${t.last_name}`.toLowerCase().includes(triageSearch.toLowerCase())) ||
    (t.patient_code && t.patient_code.toLowerCase().includes(triageSearch.toLowerCase()))
  );

  const filteredDepartments = departmentsList.filter(d => 
    d.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(departmentSearch.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(departmentSearch.toLowerCase())) ||
    (d.location_floor && d.location_floor.toLowerCase().includes(departmentSearch.toLowerCase()))
  );

  const filteredStaff = staffList.filter(s => {
    const matchesSearch = 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.employee_code.toLowerCase().includes(staffSearch.toLowerCase()) ||
      (s.specialization && s.specialization.toLowerCase().includes(staffSearch.toLowerCase())) ||
      (s.department_name && s.department_name.toLowerCase().includes(staffSearch.toLowerCase()));
    
    if (dutyFilter === 'all') return matchesSearch;
    return matchesSearch && s.duty_status === dutyFilter;
  });

  const filteredMedicines = medicinesList.filter(m => 
    m.brand_name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    m.generic_name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    (m.barcode && m.barcode.toLowerCase().includes(medicineSearch.toLowerCase())) ||
    (m.category_name && m.category_name.toLowerCase().includes(medicineSearch.toLowerCase())) ||
    (m.dosage_form && m.dosage_form.toLowerCase().includes(medicineSearch.toLowerCase()))
  );

  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.patient_code.toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.nic_passport && p.nic_passport.toLowerCase().includes(patientSearch.toLowerCase())) ||
    (p.phone && p.phone.toLowerCase().includes(patientSearch.toLowerCase())) ||
    (p.blood_group && p.blood_group.toLowerCase().includes(patientSearch.toLowerCase()))
  );

  const filteredCategories = categoriesList.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(categorySearch.toLowerCase()))
  );

  const filteredSuppliers = suppliersList.filter(s => 
    s.company_name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    s.supplier_code.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    (s.contact_person && s.contact_person.toLowerCase().includes(supplierSearch.toLowerCase()))
  );

  const filteredPermissions = permissionsList.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.display_name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.module.toLowerCase().includes(permissionSearch.toLowerCase());

    if (permissionModuleFilter === 'all') return matchesSearch;
    return matchesSearch && p.module === permissionModuleFilter;
  });

  const uniquePermissionModules = Array.from(new Set(permissionsList.map(p => p.module)));



  const filteredBatches = batchesList.filter(b => {
    const matchesSearch = 
      b.batch_number.toLowerCase().includes(batchSearch.toLowerCase()) ||
      b.brand_name.toLowerCase().includes(batchSearch.toLowerCase()) ||
      b.generic_name.toLowerCase().includes(batchSearch.toLowerCase()) ||
      (b.storage_location && b.storage_location.toLowerCase().includes(batchSearch.toLowerCase())) ||
      (b.supplier_name && b.supplier_name.toLowerCase().includes(batchSearch.toLowerCase()));

    if (batchStatusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === batchStatusFilter;
  });

  const filteredAiRiskData = aiRiskData.filter(item => {
    const matchesSearch = 
      (item.brand_name && item.brand_name.toLowerCase().includes(aiRiskSearch.toLowerCase())) ||
      (item.generic_name && item.generic_name.toLowerCase().includes(aiRiskSearch.toLowerCase())) ||
      (item.batch_number && item.batch_number.toLowerCase().includes(aiRiskSearch.toLowerCase())) ||
      (item.ai_recommendation && item.ai_recommendation.toLowerCase().includes(aiRiskSearch.toLowerCase()));

    const score = parseFloat(item.expiry_risk_score) || 0;
    if (aiRiskFilter === 'critical') return matchesSearch && score >= 80;
    if (aiRiskFilter === 'moderate') return matchesSearch && score >= 40 && score < 80;
    if (aiRiskFilter === 'low') return matchesSearch && score < 40;
    return matchesSearch;
  });

  const criticalRiskCount = aiRiskData.filter(i => (parseFloat(i.expiry_risk_score) || 0) >= 80).length;
  const totalPredictedDemand = aiRiskData.reduce((acc, curr) => acc + (parseInt(curr.predicted_demand_30d) || 0), 0);
  const avgAiConfidence = aiRiskData.length > 0
    ? (aiRiskData.reduce((acc, curr) => acc + (parseFloat(curr.confidence_score) || 0), 0) / aiRiskData.length).toFixed(1)
    : '95.0';


  const filteredTransactions = transactionsList.filter(t => {
    const matchesSearch = 
      (t.reference_no && t.reference_no.toLowerCase().includes(transactionSearch.toLowerCase())) ||
      (t.batch_number && t.batch_number.toLowerCase().includes(transactionSearch.toLowerCase())) ||
      (t.brand_name && t.brand_name.toLowerCase().includes(transactionSearch.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(transactionSearch.toLowerCase())) ||
      (t.user_name && t.user_name.toLowerCase().includes(transactionSearch.toLowerCase()));

    if (transactionTypeFilter === 'all') return matchesSearch;
    return matchesSearch && t.transaction_type === transactionTypeFilter;
  });

  // Batch Counters
  const totalStockUnits = batchesList.reduce((acc, curr) => acc + (parseInt(curr.current_quantity) || 0), 0);
  const availableBatchesCount = batchesList.filter(b => b.status === 'available').length;
  const lowBatchesCount = batchesList.filter(b => b.status === 'low').length;
  const expiredBatchesCount = batchesList.filter(b => b.status === 'expired' || b.exp_date < new Date().toISOString().slice(0, 10)).length;

  // Prescription Counters

  const issuedRxCount = prescriptionsList.filter(r => r.status === 'ISSUED').length;
  const dispensedRxCount = prescriptionsList.filter(r => r.status === 'DISPENSED').length;
  const draftRxCount = prescriptionsList.filter(r => r.status === 'DRAFT').length;

  // Appointment Counters
  const scheduledCount = appointments.filter(a => a.status === 'Scheduled').length;
  const inProgressCount = appointments.filter(a => a.status === 'In_Progress').length;
  const emergencyPriorityCount = appointments.filter(a => a.priority === 'Emergency' || a.priority === 'High').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  // Triage Counters
  const emergencyTriageCount = triageLogsList.filter(t => t.suggested_triage_level === 'Emergency').length;
  const urgentTriageCount = triageLogsList.filter(t => t.suggested_triage_level === 'Urgent').length;
  const avgConfidenceScore = triageLogsList.length > 0
    ? (triageLogsList.reduce((acc, curr) => acc + (parseFloat(curr.ai_confidence_score) || 0), 0) / triageLogsList.length).toFixed(1)
    : '94.5';

  // Duty Status Counters
  const onDutyCount = staffList.filter(s => s.duty_status === 'on_duty').length;
  const offDutyCount = staffList.filter(s => s.duty_status === 'off_duty').length;
  const onLeaveCount = staffList.filter(s => s.duty_status === 'on_leave').length;

  // Department Counters
  const activeDepartmentsCount = departmentsList.filter(d => d.status === 'active').length;
  const totalStaffAssignedCount = departmentsList.reduce((acc, curr) => acc + (parseInt(curr.staff_count) || 0), 0);

  // Medicine Counters
  const rxRequiredCount = medicinesList.filter(m => m.prescription_required).length;

  // Patient Counters
  const allergyAlertCount = patients.filter(p => p.allergies && p.allergies.toLowerCase() !== 'none' && p.allergies.toLowerCase() !== 'none reported').length;

  // Category Counters
  const totalMedicinesAssigned = categoriesList.reduce((acc, curr) => acc + (parseInt(curr.medicines_count) || 0), 0);

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
              {activeTab === 'users' ? 'User Management Directory' : (
                activeTab === 'appointments' ? 'Clinical Appointments & Patient Consultations' : (
                  activeTab === 'prescriptions' ? 'Clinical Prescriptions (Rx) Management' : (
                    activeTab === 'ai_triage' ? 'MediSync AI Clinical Symptom Triage & Chat' : (
                      activeTab === 'departments' ? 'Hospital Departments & Wards' : (
                        activeTab === 'staff' ? 'Hospital Staff Roster' : (
                          activeTab === 'medicines' ? 'Pharmaceutical Medicine Formulary' : (
                            activeTab === 'patients' ? 'Patient Electronic Health Records (EHR)' : (
                              activeTab === 'categories' ? 'Pharmaceutical Medicine Categories' : (
                                activeTab === 'suppliers' ? 'Pharmaceutical Suppliers Directory' : `Welcome back, ${user.name}`
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )}
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

        {/* TAB: CLINICAL PRESCRIPTIONS (RX) CRUD */}
        {activeTab === 'prescriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL RX PRESCRIPTIONS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{prescriptionsList.length} Prescriptions</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ISSUED / ACTIVE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{issuedRxCount} Active Rx</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>DISPENSED BY PHARMACY</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{dispensedRxCount} Dispensed</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>DRAFT / PENDING</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>{draftRxCount} Drafts</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search by Rx code, patient name, doctor, notes, or prescribed medicine..." 
                  value={prescriptionSearch}
                  onChange={e => setPrescriptionSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                {[
                  { id: 'all', label: 'All Statuses' },
                  { id: 'ISSUED', label: 'Issued' },
                  { id: 'DISPENSED', label: 'Dispensed' },
                  { id: 'DRAFT', label: 'Draft' },
                  { id: 'CANCELLED', label: 'Cancelled' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setPrescriptionStatusFilter(f.id)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      background: prescriptionStatusFilter === f.id ? 'var(--primary)' : 'transparent',
                      color: prescriptionStatusFilter === f.id ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowCreatePrescriptionModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <FileText size={18} />
                <span>Issue New Prescription</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>RX CODE / DATE</th>
                    <th style={{ padding: '14px' }}>PATIENT (EHR)</th>
                    <th style={{ padding: '14px' }}>PRESCRIBING DOCTOR</th>
                    <th style={{ padding: '14px' }}>LINKED APPOINTMENT</th>
                    <th style={{ padding: '14px' }}>PRESCRIBED MEDICATIONS</th>
                    <th style={{ padding: '14px' }}>STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrescriptions.map(rx => {
                    const hasAllergies = rx.allergies && rx.allergies.toLowerCase() !== 'none' && rx.allergies.toLowerCase() !== 'none reported';
                    return (
                      <tr key={rx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>{rx.prescription_code}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {rx.issued_at ? new Date(rx.issued_at).toLocaleDateString() : 'Draft'}
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700' }}>{rx.patient_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{rx.patient_code}</div>
                          {hasAllergies && (
                            <div style={{ marginTop: '4px' }}>
                              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                                ⚠️ Allergy: {rx.allergies}
                              </span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700' }}>Dr. {rx.doctor_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rx.specialization || 'General Care'} ({rx.department_name || 'OPD'})</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {rx.appointment_id ? (
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem' }}>
                              Appt #{rx.appointment_id} ({rx.appointment_type || 'Consultation'})
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct Clinical Rx</span>
                          )}
                        </td>
                        <td style={{ padding: '14px', maxWidth: '240px' }}>
                          {rx.items && rx.items.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {rx.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                                  • {item.brand_name} ({item.dosage}) - <em>{item.frequency}</em>
                                </div>
                              ))}
                              {rx.items.length > 2 && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--teal-accent)', fontWeight: '700' }}>
                                  +{rx.items.length - 2} additional items...
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No items listed</span>
                          )}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${
                            rx.status === 'DISPENSED' ? 'badge-success' : (rx.status === 'ISSUED' ? 'badge-primary' : (rx.status === 'DRAFT' ? 'badge-warning' : 'badge-danger'))
                          }`}>
                            {rx.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => { setSelectedPrescription(rx); setShowViewPrescriptionModal(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--teal-accent)' }}
                              title="View & Print Prescription Slip"
                            >
                              <Printer size={13} />
                              <span>View Slip</span>
                            </button>
                            <button 
                              onClick={() => { setSelectedPrescription(rx); setShowEditPrescriptionModal(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              onClick={() => { setSelectedPrescription(rx); setShowDeletePrescriptionModal(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--danger)' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CLINICAL APPOINTMENTS & CONSULTATIONS */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL APPOINTMENTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{appointments.length} Booked</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SCHEDULED / IN PROGRESS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="pulse-dot"></div>
                  <span>{scheduledCount + inProgressCount} Active</span>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>HIGH / EMERGENCY PRIORITY</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>{emergencyPriorityCount} Priority</span>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>COMPLETED CONSULTATIONS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{completedCount} Completed</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search appointments by patient, doctor, specialization, reason, or consultation type..." 
                  value={appointmentSearch}
                  onChange={e => setAppointmentSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                {[
                  { id: 'all', label: 'All Statuses' },
                  { id: 'Scheduled', label: 'Scheduled' },
                  { id: 'In_Progress', label: 'In Progress' },
                  { id: 'Completed', label: 'Completed' },
                  { id: 'Cancelled', label: 'Cancelled' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setAppointmentStatusFilter(f.id)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      background: appointmentStatusFilter === f.id ? 'var(--primary)' : 'transparent',
                      color: appointmentStatusFilter === f.id ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowCreateAppointmentModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Calendar size={18} />
                <span>Book New Appointment</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>APPOINTMENT DATE & TIME</th>
                    <th style={{ padding: '14px' }}>PATIENT (EHR)</th>
                    <th style={{ padding: '14px' }}>ATTENDING CLINICIAN</th>
                    <th style={{ padding: '14px' }}>CONSULTATION TYPE</th>
                    <th style={{ padding: '14px' }}>PRIORITY</th>
                    <th style={{ padding: '14px' }}>CLINICAL REASON</th>
                    <th style={{ padding: '14px' }}>STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} />
                          <span>{new Date(a.appointment_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Booking #{a.id}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700' }}>{a.patient_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{a.patient_code} • {a.blood_group || 'O+'}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700' }}>Dr. {a.doctor_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.specialization || 'General Care'} ({a.department_name || 'OPD'})</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem' }}>
                          {a.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.78rem',
                          background: a.priority === 'Emergency' || a.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                          color: a.priority === 'Emergency' || a.priority === 'High' ? 'var(--danger)' : 'var(--success)'
                        }}>
                          {a.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px', maxWidth: '220px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={a.reason}>
                          {a.reason || 'Routine consultation.'}
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${
                          a.status === 'Completed' ? 'badge-success' : (a.status === 'In_Progress' || a.status === 'Scheduled' ? 'badge-primary' : 'badge-warning')
                        }`} style={{ textTransform: 'capitalize' }}>
                          {a.status ? a.status.replace('_', ' ') : 'Scheduled'}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleOpenRxForAppointment(a)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--teal-accent)' }}
                            title="Issue Rx Prescription for this appointment"
                          >
                            <FileText size={13} />
                            <span>Issue Rx</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedAppointment(a); setShowEditAppointmentModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => { setSelectedAppointment(a); setShowDeleteAppointmentModal(true); }}
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

        {/* TAB: MEDISYNC AI CLINICAL TRIAGE & INTERACTIVE CHAT */}
        {activeTab === 'ai_triage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL TRIAGE ASSESSMENTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{triageLogsList.length} Evaluations</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>EMERGENCY CASES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>{emergencyTriageCount} Critical</span>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>URGENT CASES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>{urgentTriageCount} Priority</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CLINICAL AI CONFIDENCE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{avgConfidenceScore}% Avg</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                <button
                  onClick={() => setTriageSubView('chat')}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    background: triageSubView === 'chat' ? 'var(--primary)' : 'transparent',
                    color: triageSubView === 'chat' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Interactive AI Clinical Chat</span>
                </button>
                <button
                  onClick={() => setTriageSubView('inspection')}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    background: triageSubView === 'inspection' ? 'var(--primary)' : 'transparent',
                    color: triageSubView === 'inspection' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Clinician Log Inspection ({triageLogsList.length})</span>
                </button>
              </div>

              {triageSubView === 'chat' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Link Patient EHR:</span>
                  <select 
                    className="input-field" 
                    value={selectedPatientForTriage} 
                    onChange={e => setSelectedPatientForTriage(e.target.value)}
                    style={{ width: '220px', padding: '6px 12px', fontSize: '0.82rem' }}
                  >
                    <option value="">Walk-in / Unlinked Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.patient_code} - {p.first_name} {p.last_name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {triageSubView === 'chat' && (
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '540px', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', color: '#fff', display: 'flex' }}>
                      <Bot size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>MediSync AI Healthcare Assistant</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className="pulse-dot" style={{ width: '6px', height: '6px' }}></div>
                        <span>Model: MediSync Neural AI Engine 4.0 • Real-Time Engine Active</span>
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>MediSync AI Engine Connected</span>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '82%',
                        padding: '14px 18px',
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}>
                        {msg.triage_level && (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span style={{ 
                              padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.75rem',
                              background: msg.triage_level === 'Emergency' ? 'rgba(239,68,68,0.2)' : (msg.triage_level === 'Urgent' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'),
                              color: msg.triage_level === 'Emergency' ? 'var(--danger)' : (msg.triage_level === 'Urgent' ? 'var(--warning)' : 'var(--success)')
                            }}>
                              Triage Level: {msg.triage_level}
                            </span>
                            <span style={{ padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', background: 'rgba(99,102,241,0.2)', color: 'var(--primary)' }}>
                              Route to: {msg.department}
                            </span>
                            <span style={{ padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', background: 'rgba(56,189,248,0.2)', color: 'var(--teal-accent)' }}>
                              Confidence: {msg.confidence}%
                            </span>
                          </div>
                        )}

                        <p>{msg.text}</p>

                        {msg.medications && msg.medications.length > 0 && (
                          <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                            <strong style={{ color: 'var(--teal-accent)', display: 'block', marginBottom: '4px' }}>Suggested Medication Protocols:</strong>
                            <ul style={{ margin: 0, paddingLeft: '18px' }}>
                              {msg.medications.map((m, idx) => (
                                <li key={idx}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>{msg.timestamp}</span>
                    </div>
                  ))}

                  {isAiProcessing && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--primary)', fontSize: '0.85rem' }}>
                      <Bot size={18} className="pulse-dot" />
                      <span>MediSync Clinical AI evaluating clinical symptoms...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendChatMessage} style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.1)' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Describe clinical symptoms (e.g. 'Patient has 102F fever, severe headache, and stiff neck')..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    disabled={isAiProcessing}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={isAiProcessing || !chatInput.trim()}>
                    <Send size={18} />
                    <span>Assess Symptoms</span>
                  </button>
                </form>
              </div>
            )}

            {triageSubView === 'inspection' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Search triage logs by symptoms, triage level, patient name, or department..." 
                    value={triageSearch}
                    onChange={e => setTriageSearch(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>

                <div className="glass-panel" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <th style={{ padding: '14px' }}>LOG ID</th>
                        <th style={{ padding: '14px' }}>PATIENT LINK</th>
                        <th style={{ padding: '14px' }}>PRESENTED SYMPTOMS</th>
                        <th style={{ padding: '14px' }}>AI TRIAGE LEVEL</th>
                        <th style={{ padding: '14px' }}>RECOMMENDED DEPT</th>
                        <th style={{ padding: '14px' }}>AI CONFIDENCE</th>
                        <th style={{ padding: '14px' }}>SUGGESTED MEDICATIONS</th>
                        <th style={{ padding: '14px' }}>CLINICIAN OVERRIDE</th>
                        <th style={{ padding: '14px' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTriageLogs.map(t => {
                        const parsedMeds = typeof t.suggested_medications === 'string' 
                          ? (JSON.parse(t.suggested_medications || '[]'))
                          : (t.suggested_medications || []);
                        
                        return (
                          <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700' }}>#{t.id}</td>
                            <td style={{ padding: '14px' }}>
                              {t.first_name ? (
                                <div>
                                  <div style={{ fontWeight: '700' }}>{t.first_name} {t.last_name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{t.patient_code}</div>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Walk-in Patient</span>
                              )}
                            </td>
                            <td style={{ padding: '14px', maxWidth: '240px' }}>
                              <div style={{ fontSize: '0.82rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={t.input_symptoms}>
                                {t.input_symptoms}
                              </div>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ 
                                padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.82rem',
                                background: t.suggested_triage_level === 'Emergency' ? 'rgba(239,68,68,0.2)' : (t.suggested_triage_level === 'Urgent' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'),
                                color: t.suggested_triage_level === 'Emergency' ? 'var(--danger)' : (t.suggested_triage_level === 'Urgent' ? 'var(--warning)' : 'var(--success)')
                              }}>
                                {t.suggested_triage_level}
                              </span>
                            </td>
                            <td style={{ padding: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                              {t.recommended_department}
                            </td>
                            <td style={{ padding: '14px', fontWeight: '800', color: 'var(--teal-accent)' }}>
                              {t.ai_confidence_score}%
                            </td>
                            <td style={{ padding: '14px', fontSize: '0.78rem' }}>
                              {parsedMeds.length > 0 ? (
                                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px' }}>
                                  {parsedMeds[0]} {parsedMeds.length > 1 ? `+${parsedMeds.length - 1} more` : ''}
                                </span>
                              ) : 'None'}
                            </td>
                            <td style={{ padding: '14px' }}>
                              {t.doctor_override ? (
                                <span style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Check size={12} />
                                  <span>Clinician Overridden</span>
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Assessed</span>
                              )}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <button 
                                onClick={() => { setSelectedTriageLog(t); setShowOverrideModal(true); }}
                                className="btn btn-secondary" 
                                style={{ padding: '6px 10px', fontSize: '0.78rem', color: 'var(--primary)' }}
                              >
                                <Stethoscope size={14} />
                                <span>Clinician Review</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

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

        {/* TAB: HOSPITAL DEPARTMENTS & WARDS CRUD */}
        {activeTab === 'departments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL HOSPITAL WARDS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{departmentsList.length} Departments</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ACTIVE WARDS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{activeDepartmentsCount} Operational</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>STAFF ASSIGNED</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{totalStaffAssignedCount} Medical Staff</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search department by name, code, description, or floor location..." 
                  value={departmentSearch}
                  onChange={e => setDepartmentSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <button onClick={() => setShowCreateDepartmentModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Building2 size={18} />
                <span>Add New Department</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>CODE</th>
                    <th style={{ padding: '14px' }}>DEPARTMENT / WARD NAME</th>
                    <th style={{ padding: '14px' }}>FLOOR LOCATION</th>
                    <th style={{ padding: '14px' }}>DESCRIPTION</th>
                    <th style={{ padding: '14px' }}>STAFF ASSIGNED</th>
                    <th style={{ padding: '14px' }}>STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map(d => (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{d.code}</td>
                      <td style={{ padding: '14px', fontWeight: '700' }}>{d.name}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--teal-accent)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
                          {d.location_floor || 'Ground Floor'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{d.description || 'No detailed description.'}</td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-primary">
                          {d.staff_count || 0} Staff
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${d.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedDepartment(d); setShowEditDepartmentModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedDepartment(d); setShowDeleteDepartmentModal(true); }}
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

        {/* TAB: MEDICINE FORMULARY CRUD */}
        {activeTab === 'medicines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL FORMULARY MEDICINES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{medicinesList.length} Cataloged</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>PRESCRIPTION REQUIRED (Rx)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>{rxRequiredCount} Prescriptions</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORIES COVERED</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{categoriesList.length} Classifications</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search by brand name, generic formula, barcode, or category..." 
                  value={medicineSearch}
                  onChange={e => setMedicineSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <button onClick={() => setShowCreateMedicineModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Pill size={18} />
                <span>Add New Medicine</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>BARCODE</th>
                    <th style={{ padding: '14px' }}>BRAND & GENERIC NAME</th>
                    <th style={{ padding: '14px' }}>CATEGORY</th>
                    <th style={{ padding: '14px' }}>DOSAGE FORM</th>
                    <th style={{ padding: '14px' }}>REORDER THRESHOLD</th>
                    <th style={{ padding: '14px' }}>UNIT PRICE</th>
                    <th style={{ padding: '14px' }}>RX REQUIREMENT</th>
                    <th style={{ padding: '14px' }}>STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{m.barcode}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700' }}>{m.brand_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.generic_name}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
                          {m.category_name || 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                        {m.dosage_form} ({m.unit})
                      </td>
                      <td style={{ padding: '14px', fontWeight: '600' }}>
                        <div>Min: <strong style={{ color: 'var(--warning)' }}>{m.min_reorder_level}</strong></div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max: {m.max_stock_capacity}</div>
                      </td>
                      <td style={{ padding: '14px', fontWeight: '800', color: 'var(--success)' }}>
                        LKR {parseFloat(m.unit_price).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {m.prescription_required ? (
                          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem' }}>
                            Rx Required
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem' }}>
                            OTC Available
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${m.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedMedicine(m); setShowEditMedicineModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedMedicine(m); setShowDeleteMedicineModal(true); }}
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

        {/* TAB: HOSPITAL STAFF ROSTER CRUD */}
        {activeTab === 'staff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL HOSPITAL STAFF</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{staffList.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ON DUTY NOW</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="pulse-dot"></div>
                  <span>{onDutyCount}</span>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>OFF DUTY</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>{offDutyCount}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ON LEAVE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px' }}>{onLeaveCount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search staff by name, code, specialization, or ward..." 
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                {[
                  { id: 'all', label: 'All Staff' },
                  { id: 'on_duty', label: 'On Duty' },
                  { id: 'off_duty', label: 'Off Duty' },
                  { id: 'on_leave', label: 'On Leave' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setDutyFilter(f.id)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      background: dutyFilter === f.id ? 'var(--primary)' : 'transparent',
                      color: dutyFilter === f.id ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowCreateStaffModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Stethoscope size={18} />
                <span>Register New Staff</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>CODE</th>
                    <th style={{ padding: '14px' }}>STAFF MEMBER</th>
                    <th style={{ padding: '14px' }}>ROLE / POSITION</th>
                    <th style={{ padding: '14px' }}>DEPARTMENT WARD</th>
                    <th style={{ padding: '14px' }}>SPECIALIZATION & SLMC LICENSE</th>
                    <th style={{ padding: '14px' }}>PHONE</th>
                    <th style={{ padding: '14px' }}>DUTY STATUS</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(st => (
                    <tr key={st.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{st.employee_code}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '700' }}>{st.first_name} {st.last_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{st.email}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-primary" style={{ 
                          borderColor: st.role_key === 'doctor' ? 'var(--success)' : (st.role_key === 'pharmacist' ? 'var(--teal-accent)' : 'var(--primary)'),
                          color: st.role_key === 'doctor' ? 'var(--success)' : (st.role_key === 'pharmacist' ? 'var(--teal-accent)' : 'var(--primary)')
                        }}>
                          {st.role_name || 'Staff Member'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{st.department_name || 'General OPD'}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '600' }}>{st.specialization || 'General Practice'}</div>
                        {st.license_number && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{st.license_number}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{st.phone || '+94 77 123 4567'}</td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${
                          st.duty_status === 'on_duty' ? 'badge-success' : (st.duty_status === 'off_duty' ? 'badge-warning' : 'badge-danger')
                        }`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {st.duty_status === 'on_duty' && <div className="pulse-dot" style={{ width: '6px', height: '6px' }}></div>}
                          <span style={{ textTransform: 'capitalize' }}>{st.duty_status ? st.duty_status.replace('_', ' ') : 'On Duty'}</span>
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedStaff(st); setShowEditStaffModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedStaff(st); setShowDeleteStaffModal(true); }}
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

        {/* TAB: PATIENT RECORDS (EHR) CRUD */}
        {activeTab === 'patients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL REGISTERED PATIENTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{patients.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>BLOOD GROUPS LOGGED</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{patients.filter(p => p.blood_group).length} Patients</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ALLERGY RISK ALERTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>{allergyAlertCount} High Risk</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search patient by name, code, NIC/Passport, phone, or blood group..." 
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <button onClick={() => setShowCreatePatientModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Users size={18} />
                <span>Register New Patient</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>PATIENT CODE</th>
                    <th style={{ padding: '14px' }}>FULL NAME & EMAIL</th>
                    <th style={{ padding: '14px' }}>DOB & GENDER</th>
                    <th style={{ padding: '14px' }}>BLOOD GROUP</th>
                    <th style={{ padding: '14px' }}>NIC / PASSPORT & PHONE</th>
                    <th style={{ padding: '14px' }}>ALLERGIES (EHR)</th>
                    <th style={{ padding: '14px' }}>EMERGENCY CONTACT</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => {
                    const hasAllergies = p.allergies && p.allergies.toLowerCase() !== 'none' && p.allergies.toLowerCase() !== 'none reported';
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{p.patient_code}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700' }}>{p.first_name} {p.last_name}</div>
                          {p.email && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.email}</div>}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div>{p.dob}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.gender}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.82rem' }}>
                            {p.blood_group || 'O+'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontSize: '0.82rem' }}>
                          <div>{p.phone || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.nic_passport || 'NIC Not Set'}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {hasAllergies ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem' }}>
                              <AlertTriangle size={13} />
                              <span>{p.allergies}</span>
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>None reported</span>
                          )}
                        </td>
                        <td style={{ padding: '14px', fontSize: '0.82rem' }}>
                          <div>{p.emergency_contact_name || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.emergency_contact_phone}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => { setSelectedPatient(p); setShowEditPatientModal(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            >
                              <Edit size={14} />
                              <span>Edit EHR</span>
                            </button>
                            <button 
                              onClick={() => { setSelectedPatient(p); setShowDeletePatientModal(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem', color: 'var(--danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: MEDICINE CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL CATEGORIES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{categoriesList.length} Categories</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>LINKED MEDICINES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{totalMedicinesAssigned} Medicines</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SYSTEM STATUS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>Active Catalog</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search medicine categories by name or description..." 
                  value={categorySearch}
                  onChange={e => setCategorySearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <button onClick={() => setShowCreateCategoryModal(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Plus size={18} />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '14px' }}>ID</th>
                    <th style={{ padding: '14px' }}>CATEGORY NAME</th>
                    <th style={{ padding: '14px' }}>DESCRIPTION</th>
                    <th style={{ padding: '14px' }}>LINKED MEDICINES</th>
                    <th style={{ padding: '14px' }}>CREATED AT</th>
                    <th style={{ padding: '14px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700' }}>#{c.id}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem' }}>
                          {c.name}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{c.description || 'No detailed description provided.'}</td>
                      <td style={{ padding: '14px' }}>
                        <span className="badge badge-success">
                          {c.medicines_count || 0} Medicines
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Active'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => { setSelectedCategory(c); setShowEditCategoryModal(true); }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => { setSelectedCategory(c); setShowDeleteCategoryModal(true); }}
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

        {/* TAB: EXECUTIVE PRODUCTION-GRADE OPERATIONS & ANALYTICS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* System Infrastructure Health & Connectivity Live Bar */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Server size={22} color="var(--teal-accent)" />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>MediSync Platform Operational Command</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-Time System Health • Node ID: MEDISYNC-PROD-LK</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: '700' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span>Database: <strong style={{ color: 'var(--success)' }}>MySQL 8+ Online</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--teal-accent)', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span>AI Engine: <strong style={{ color: 'var(--teal-accent)' }}>Groq Llama 3.3 Active</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span>API Backend: <strong style={{ color: 'var(--primary)' }}>Laravel v11 (Port 8000)</strong></span>
                </div>
              </div>
            </div>

            {/* Hero Executive KPI Analytics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>AI TRIAGE EVALUATIONS</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{triageLogsList.length} Cases</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--danger)', fontWeight: '700' }}>🚨 {emergencyTriageCount} Emergency</span>
                  <span style={{ color: 'var(--warning)', fontWeight: '700' }}>⚡ {urgentTriageCount} Urgent</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>REGISTERED PATIENTS (EHR)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{patients.length} Patients</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Active Electronic Health Records catalog
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CONSULTATIONS & APPOINTMENTS</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{appointments.length} Scheduled</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--success)', fontWeight: '700' }}>✓ {completedCount} Done</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>⌛ {scheduledCount} Pending</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ELECTRONIC PRESCRIPTIONS (Rx)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>{prescriptionsList.length} Rx Issued</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--success)', fontWeight: '700' }}>{dispensedRxCount} Dispensed</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{issuedRxCount} Active</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>FEFO STOCK & INVENTORY</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px' }}>{totalStockUnits} Units</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '8px' }}>
                  <span>{batchesList.length} Batches</span>
                  <span style={{ color: 'var(--danger)', fontWeight: '700' }}>⚠️ {expiredBatchesCount + lowBatchesCount} Low/Risk</span>
                </div>
              </div>
            </div>

            {/* Quick Operational Shortcuts Bar */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button onClick={() => handleTabChange('patients')} className="btn btn-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                <Users size={16} color="var(--success)" />
                <span>Patient Records (EHR)</span>
              </button>
              <button onClick={() => handleTabChange('appointments')} className="btn btn-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                <Calendar size={16} color="var(--primary)" />
                <span>Consultations</span>
              </button>
              <button onClick={() => handleTabChange('ai_triage')} className="btn btn-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', borderColor: 'var(--teal-accent)', color: 'var(--teal-accent)' }}>
                <Bot size={16} />
                <span>Groq AI Symptom Triage</span>
              </button>
              <button onClick={() => handleTabChange('batches')} className="btn btn-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                <Package size={16} color="var(--warning)" />
                <span>FEFO Batches & Movements</span>
              </button>
              <button onClick={() => handleTabChange('ai_risk')} className="btn btn-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                <Sparkles size={16} color="var(--danger)" />
                <span>AI Expiry Intelligence</span>
              </button>
              {user.roleKey === 'super_admin' && (
                <button onClick={() => handleTabChange('permissions')} className="btn btn-secondary" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  <Key size={16} color="var(--primary)" />
                  <span>Access Control Matrix</span>
                </button>
              )}
            </div>

            {/* Analytics Visualizations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
              {/* AI Clinical Triage Level Distribution */}
              <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={18} color="var(--teal-accent)" />
                    <span>AI Clinical Triage Level Distribution</span>
                  </h3>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--teal-accent)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    Avg AI Confidence: {avgConfidenceScore}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--danger)' }}>🚨 Emergency Priority</span>
                      <span style={{ fontWeight: '800' }}>{emergencyTriageCount} Cases ({triageLogsList.length > 0 ? ((emergencyTriageCount / triageLogsList.length) * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${triageLogsList.length > 0 ? (emergencyTriageCount / triageLogsList.length) * 100 : 0}%`, height: '100%', background: 'var(--danger)', borderRadius: '5px' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--warning)' }}>⚡ Urgent Priority</span>
                      <span style={{ fontWeight: '800' }}>{urgentTriageCount} Cases ({triageLogsList.length > 0 ? ((urgentTriageCount / triageLogsList.length) * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${triageLogsList.length > 0 ? (urgentTriageCount / triageLogsList.length) * 100 : 0}%`, height: '100%', background: 'var(--warning)', borderRadius: '5px' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--success)' }}>🟢 Routine OPD</span>
                      <span style={{ fontWeight: '800' }}>{triageLogsList.length - emergencyTriageCount - urgentTriageCount} Cases ({triageLogsList.length > 0 ? (((triageLogsList.length - emergencyTriageCount - urgentTriageCount) / triageLogsList.length) * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${triageLogsList.length > 0 ? ((triageLogsList.length - emergencyTriageCount - urgentTriageCount) / triageLogsList.length) * 100 : 0}%`, height: '100%', background: 'var(--success)', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  💡 Emergency cases are auto-flagged and routed to Cardiology & ICU with high priority notification.
                </div>
              </div>

              {/* Hospital Wards & Operational Capacity */}
              <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={18} color="var(--primary)" />
                    <span>Hospital Wards & Staff Roster Distribution</span>
                  </h3>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    {onDutyCount} Staff On-Duty
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {departmentsList.slice(0, 6).map(d => (
                    <div key={d.id} style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>{d.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Code: {d.code} • Floor: {d.location_floor || 'G-01'}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '6px', fontWeight: '700' }}>
                        <span>Capacity: 25 Beds</span>
                        <span style={{ color: 'var(--success)' }}>Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FEFO Expiry Risk & Recent Real-Time Security Audit Stream */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
              {/* FEFO Expiry Risk & Demand Forecast Heatmap */}
              <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="var(--danger)" />
                    <span>FEFO Expiry Risk Heatmap & AI Insights</span>
                  </h3>
                  <button onClick={() => handleTabChange('ai_risk')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                    View All Risk Insights
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {aiRiskData.slice(0, 3).map(item => {
                    const riskScore = parseFloat(item.expiry_risk_score) || 0;
                    const isCritical = riskScore >= 80;
                    const borderColor = isCritical ? 'var(--danger)' : 'var(--warning)';

                    return (
                      <div key={item.id} style={{ background: 'rgba(0,0,0,0.15)', padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${borderColor}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.brand_name}</div>
                          <span style={{ fontWeight: '800', color: borderColor, fontSize: '0.88rem' }}>{riskScore.toFixed(1)}% Risk</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                          Batch: {item.batch_number} • Exp: {item.exp_date} • Stock: {item.current_quantity} {item.unit || 'pcs'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                          {item.ai_recommendation?.slice(0, 110)}...
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-Time Platform Audit Trail Stream */}
              <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="var(--success)" />
                    <span>Real-Time Security & System Audit Log Stream</span>
                  </h3>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Live Feed</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {auditLogsList.slice(0, 8).map(log => (
                    <div key={log.id} style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 12px', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>{log.action}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({log.entity_type} #{log.entity_id})</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* TAB: AI EXPIRY & FEFO RISK (POWERED BY GROQ AI) */}
        {activeTab === 'ai_risk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL AI INSIGHTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{aiRiskData.length} Evaluations</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CRITICAL EXPIRY RISKS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>{criticalRiskCount} High Risk</span>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>30-DAY DEMAND FORECAST</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{totalPredictedDemand} Units</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>GROQ AI CONFIDENCE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{avgAiConfidence}% Avg</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search AI insights by medicine name, batch number, or clinical recommendation..." 
                  value={aiRiskSearch}
                  onChange={e => setAiRiskSearch(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                {[
                  { id: 'all', label: 'All Risks' },
                  { id: 'critical', label: 'Critical (>80%)' },
                  { id: 'moderate', label: 'Moderate (50-80%)' },
                  { id: 'low', label: 'Low Risk (<50%)' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setAiRiskFilter(f.id)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      background: aiRiskFilter === f.id ? 'var(--primary)' : 'transparent',
                      color: aiRiskFilter === f.id ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleTriggerAiInventoryAnalysis} 
                className="btn btn-primary" 
                disabled={isGeneratingAiRisk}
                style={{ flexShrink: 0 }}
              >
                <Sparkles size={18} className={isGeneratingAiRisk ? 'pulse-dot' : ''} />
                <span>{isGeneratingAiRisk ? 'Groq AI Analyzing FEFO Stock...' : '⚡ Run Groq AI Inventory Analysis'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredAiRiskData.map(item => {
                const riskScore = parseFloat(item.expiry_risk_score) || 0;
                const isCritical = riskScore >= 80;
                const isModerate = riskScore >= 40 && riskScore < 80;
                const borderColor = isCritical ? 'var(--danger)' : (isModerate ? 'var(--warning)' : 'var(--success)');

                return (
                  <div key={item.id} className="glass-panel" style={{ padding: '22px', borderLeft: `6px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{item.brand_name}</h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({item.generic_name}) • {item.dosage_form || 'Tablet'}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span>FEFO Batch: <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{item.batch_number || 'BATCH-001'}</strong></span>
                          <span>• Expiry Date: <strong style={{ color: isCritical ? 'var(--danger)' : 'var(--warning)' }}>{item.exp_date || 'N/A'}</strong></span>
                          <span>• Current Stock: <strong style={{ color: 'var(--teal-accent)' }}>{item.current_quantity} {item.unit || 'pcs'}</strong></span>
                          <span>• Storage: <strong>{item.storage_location || 'Main Shelf'}</strong></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>EXPIRY RISK SCORE</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: borderColor }}>
                            {riskScore.toFixed(1)}%
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteAiRiskInsight(item.id)}
                          className="btn btn-secondary" 
                          style={{ padding: '6px 8px', color: 'var(--danger)' }}
                          title="Delete AI Insight Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Risk Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, Math.max(5, riskScore))}%`,
                        height: '100%',
                        background: isCritical ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : (isModerate ? 'var(--warning)' : 'var(--success)'),
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>

                    {/* Metrics Forecast Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.15)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.82rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Predicted 30-Day Demand:</span>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--teal-accent)' }}>{item.predicted_demand_30d} {item.unit || 'units'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Recommended Reorder Qty:</span>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary)' }}>{item.recommended_reorder_qty} {item.unit || 'units'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Groq AI Confidence:</span>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--success)' }}>{item.confidence_score}%</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Supplier Contact:</span>
                        <div style={{ fontWeight: '700' }}>{item.supplier_name || 'Central Hospital Supply'}</div>
                      </div>
                    </div>

                    {/* AI Recommendation Box */}
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--primary)', padding: '14px', borderRadius: '8px', fontSize: '0.88rem', lineHeight: '1.5' }}>
                      <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Sparkles size={16} />
                        <span>Groq AI Clinical Inventory Action Plan:</span>
                      </strong>
                      <p style={{ margin: 0, color: 'var(--text-main)' }}>{item.ai_recommendation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* TAB: FEFO STOCK BATCHES & INVENTORY TRANSACTIONS */}
        {activeTab === 'batches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL FEFO BATCHES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{batchesList.length} Active Batches</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL STOCK UNITS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{totalStockUnits} Units</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>AVAILABLE BATCHES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{availableBatchesCount} Available</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>EXPIRED / LOW STOCK</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>{expiredBatchesCount + lowBatchesCount} Risk Batches</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                <button
                  onClick={() => setBatchSubTab('inventory')}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    background: batchSubTab === 'inventory' ? 'var(--primary)' : 'transparent',
                    color: batchSubTab === 'inventory' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <Package size={16} />
                  <span>Multi-Batch FEFO Inventory ({batchesList.length})</span>
                </button>
                <button
                  onClick={() => setBatchSubTab('transactions')}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    background: batchSubTab === 'transactions' ? 'var(--primary)' : 'transparent',
                    color: batchSubTab === 'transactions' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <RefreshCw size={16} />
                  <span>Stock Movements Audit Log ({transactionsList.length})</span>
                </button>
              </div>

              {batchSubTab === 'inventory' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowRecordTransactionModal(true)} className="btn btn-secondary" style={{ color: 'var(--teal-accent)', borderColor: 'var(--teal-accent)' }}>
                    <RefreshCw size={16} />
                    <span>Record Stock Movement</span>
                  </button>
                  <button onClick={() => setShowCreateBatchModal(true)} className="btn btn-primary">
                    <Plus size={18} />
                    <span>Intake New Stock Batch</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowRecordTransactionModal(true)} className="btn btn-primary">
                  <RefreshCw size={18} />
                  <span>Log New Stock Transaction</span>
                </button>
              )}
            </div>

            {batchSubTab === 'inventory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Search batch by batch number, medicine name, storage rack, or supplier..." 
                      value={batchSearch}
                      onChange={e => setBatchSearch(e.target.value)}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                    {[
                      { id: 'all', label: 'All Batches' },
                      { id: 'available', label: 'Available' },
                      { id: 'low', label: 'Low Stock' },
                      { id: 'expired', label: 'Expired' },
                      { id: 'recalled', label: 'Recalled' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setBatchStatusFilter(f.id)}
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          background: batchStatusFilter === f.id ? 'var(--primary)' : 'transparent',
                          color: batchStatusFilter === f.id ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: '6px'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <th style={{ padding: '14px' }}>FEFO BATCH NO</th>
                        <th style={{ padding: '14px' }}>FORMULARY MEDICINE</th>
                        <th style={{ padding: '14px' }}>EXPIRY DATE (FEFO)</th>
                        <th style={{ padding: '14px' }}>STOCK QTY (CURR / INIT)</th>
                        <th style={{ padding: '14px' }}>UNIT COST</th>
                        <th style={{ padding: '14px' }}>STORAGE LOCATION</th>
                        <th style={{ padding: '14px' }}>SUPPLIER</th>
                        <th style={{ padding: '14px' }}>STATUS</th>
                        <th style={{ padding: '14px' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBatches.map(b => {
                        const isExpired = b.status === 'expired' || b.exp_date < new Date().toISOString().slice(0, 10);
                        const isLow = b.status === 'low' || (b.current_quantity > 0 && b.current_quantity < 50);

                        return (
                          <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>{b.batch_number}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MFD: {b.mfd_date}</div>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: '700' }}>{b.brand_name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.generic_name} ({b.dosage_form || 'Tablet'})</div>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: '800', color: isExpired ? 'var(--danger)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} />
                                <span>{b.exp_date}</span>
                              </div>
                              {isExpired && <span style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: '700' }}>EXPIRED</span>}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: '800', fontSize: '1rem', color: isLow ? 'var(--warning)' : (isExpired ? 'var(--danger)' : 'var(--success)') }}>
                                {b.current_quantity} {b.unit || 'pcs'}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Initial: {b.initial_quantity}</div>
                            </td>
                            <td style={{ padding: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                              LKR {parseFloat(b.unit_cost || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--teal-accent)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem' }}>
                                {b.storage_location || 'Main Shelf'}
                              </span>
                            </td>
                            <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                              {b.supplier_name || 'Central Pharmacy Stock'}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span className={`badge ${
                                isExpired ? 'badge-danger' : (isLow ? 'badge-warning' : 'badge-success')
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  onClick={() => { setTransactionForm({ ...transactionForm, batch_id: b.id }); setShowRecordTransactionModal(true); }}
                                  className="btn btn-secondary" 
                                  style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--teal-accent)' }}
                                  title="Record Stock Intake or Dispense"
                                >
                                  <RefreshCw size={13} />
                                  <span>Move</span>
                                </button>
                                <button 
                                  onClick={() => { setSelectedBatch(b); setShowEditBatchModal(true); }}
                                  className="btn btn-secondary" 
                                  style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                                >
                                  <Edit size={13} />
                                </button>
                                <button 
                                  onClick={() => { setSelectedBatch(b); setShowDeleteBatchModal(true); }}
                                  className="btn btn-secondary" 
                                  style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--danger)' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {batchSubTab === 'transactions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Search transactions by reference no, batch no, medicine, user, or notes..." 
                      value={transactionSearch}
                      onChange={e => setTransactionSearch(e.target.value)}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                    {[
                      { id: 'all', label: 'All Movements' },
                      { id: 'RESTOCK', label: 'Restock' },
                      { id: 'DISPENSE', label: 'Dispense' },
                      { id: 'ADJUSTMENT', label: 'Adjustment' },
                      { id: 'RETURN', label: 'Return' },
                      { id: 'EXPIRED_DISCARD', label: 'Discarded' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setTransactionTypeFilter(f.id)}
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          background: transactionTypeFilter === f.id ? 'var(--primary)' : 'transparent',
                          color: transactionTypeFilter === f.id ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: '6px'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <th style={{ padding: '14px' }}>REFERENCE NO / TIME</th>
                        <th style={{ padding: '14px' }}>FORMULARY MEDICINE</th>
                        <th style={{ padding: '14px' }}>BATCH NUMBER</th>
                        <th style={{ padding: '14px' }}>MOVEMENT TYPE</th>
                        <th style={{ padding: '14px' }}>QUANTITY MOVED</th>
                        <th style={{ padding: '14px' }}>PERFORMED BY STAFF</th>
                        <th style={{ padding: '14px' }}>MOVEMENT NOTES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>{t.reference_no}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {new Date(t.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: '700' }}>{t.brand_name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.generic_name}</div>
                          </td>
                          <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--teal-accent)' }}>
                            {t.batch_number}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: '6px', fontWeight: '800', fontSize: '0.78rem',
                              background: t.transaction_type === 'RESTOCK' || t.transaction_type === 'RETURN' ? 'rgba(16, 185, 129, 0.2)' : (t.transaction_type === 'DISPENSE' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                              color: t.transaction_type === 'RESTOCK' || t.transaction_type === 'RETURN' ? 'var(--success)' : (t.transaction_type === 'DISPENSE' ? 'var(--primary)' : 'var(--danger)')
                            }}>
                              {t.transaction_type}
                            </span>
                          </td>
                          <td style={{ padding: '14px', fontWeight: '800', fontSize: '1rem', color: t.transaction_type === 'RESTOCK' || t.transaction_type === 'RETURN' ? 'var(--success)' : 'var(--danger)' }}>
                            {t.transaction_type === 'RESTOCK' || t.transaction_type === 'RETURN' ? `+${t.quantity}` : `-${t.quantity}`} {t.unit || 'units'}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: '600' }}>{t.user_name || 'System Admin'}</div>
                          </td>
                          <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '240px' }}>
                            {t.notes || 'Routine stock update.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB: PERMISSIONS & ROLE-PERMISSION MATRIX CRUD */}
        {activeTab === 'permissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL PERMISSIONS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>{permissionsList.length} Defined</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--teal-accent)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SYSTEM MODULES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal-accent)', marginTop: '4px' }}>{uniquePermissionModules.length} Modules</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CONFIGURED ROLES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>{rolePermissionsMatrix.roles?.length || 0} Roles</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SECURITY AUDIT STATUS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} />
                  <span>Enforced</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                <button
                  onClick={() => setPermissionSubTab('matrix')}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    background: permissionSubTab === 'matrix' ? 'var(--primary)' : 'transparent',
                    color: permissionSubTab === 'matrix' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Role Access Control Matrix Grid</span>
                </button>
                <button
                  onClick={() => setPermissionSubTab('directory')}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    background: permissionSubTab === 'directory' ? 'var(--primary)' : 'transparent',
                    color: permissionSubTab === 'directory' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <Key size={16} />
                  <span>Permissions Registry Directory ({permissionsList.length})</span>
                </button>
              </div>

              <button onClick={() => setShowCreatePermissionModal(true)} className="btn btn-primary">
                <Plus size={18} />
                <span>Add New Permission</span>
              </button>
            </div>

            {permissionSubTab === 'matrix' && (
              <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Key size={20} color="var(--primary)" />
                      <span>Role-Permission Access Control Matrix</span>
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                      Click any toggle switch to dynamically grant or revoke permissions for each system role in real-time.
                    </p>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <th style={{ padding: '14px', minWidth: '220px' }}>SYSTEM PERMISSION</th>
                      <th style={{ padding: '14px' }}>MODULE</th>
                      {(rolePermissionsMatrix.roles || []).map(r => (
                        <th key={r.id} style={{ padding: '14px', textAlign: 'center', minWidth: '130px' }}>
                          <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{r.display_name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsList.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700' }}>{p.display_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{p.name}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            {p.module}
                          </span>
                        </td>
                        {(rolePermissionsMatrix.roles || []).map(r => {
                          const isGranted = (rolePermissionsMatrix.matrix[r.id] || []).includes(p.id);

                          return (
                            <td key={r.id} style={{ padding: '14px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleToggleRolePermission(r.id, p.id)}
                                className="btn"
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '0.78rem',
                                  fontWeight: '800',
                                  borderRadius: '20px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: isGranted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                                  color: isGranted ? 'var(--success)' : 'var(--danger)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {isGranted ? <CheckCircle2 size={14} /> : <X size={14} />}
                                <span>{isGranted ? 'GRANTED' : 'DENIED'}</span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {permissionSubTab === 'directory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Search permissions by key, display label, or module..." 
                      value={permissionSearch}
                      onChange={e => setPermissionSearch(e.target.value)}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
                    <button
                      onClick={() => setPermissionModuleFilter('all')}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        background: permissionModuleFilter === 'all' ? 'var(--primary)' : 'transparent',
                        color: permissionModuleFilter === 'all' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '6px'
                      }}
                    >
                      All Modules
                    </button>
                    {uniquePermissionModules.map(mod => (
                      <button
                        key={mod}
                        onClick={() => setPermissionModuleFilter(mod)}
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          background: permissionModuleFilter === mod ? 'var(--primary)' : 'transparent',
                          color: permissionModuleFilter === mod ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: '6px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        <th style={{ padding: '14px' }}>ID</th>
                        <th style={{ padding: '14px' }}>PERMISSION KEY</th>
                        <th style={{ padding: '14px' }}>DISPLAY LABEL</th>
                        <th style={{ padding: '14px' }}>MODULE</th>
                        <th style={{ padding: '14px' }}>ASSIGNED ROLES</th>
                        <th style={{ padding: '14px' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPermissions.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '700' }}>#{p.id}</td>
                          <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: '800', color: 'var(--primary)' }}>
                            {p.name}
                          </td>
                          <td style={{ padding: '14px', fontWeight: '700' }}>{p.display_name}</td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--teal-accent)', padding: '4px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                              {p.module}
                            </span>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {(p.roles || []).map(r => (
                                <span key={r.id} style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                                  {r.display_name}
                                </span>
                              ))}
                              {(!p.roles || p.roles.length === 0) && (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>No roles assigned</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                onClick={() => { setSelectedPermission(p); setShowEditPermissionModal(true); }}
                                className="btn btn-secondary" 
                                style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                              >
                                <Edit size={13} />
                              </button>
                              <button 
                                onClick={() => { setSelectedPermission(p); setShowDeletePermissionModal(true); }}
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

      {/* CREATE PRESCRIPTION MODAL */}
      {showCreatePrescriptionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreatePrescriptionModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Issue New Clinical Prescription (Rx)</h3>
            <form onSubmit={handleCreatePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Patient (EHR)</label>
                  <select className="input-field" value={prescriptionForm.patient_id} onChange={e => setPrescriptionForm({...prescriptionForm, patient_id: parseInt(e.target.value)})}>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.patient_code} - {p.first_name} {p.last_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prescribing Doctor</label>
                  <select className="input-field" value={prescriptionForm.doctor_id} onChange={e => setPrescriptionForm({...prescriptionForm, doctor_id: parseInt(e.target.value)})}>
                    {staffList.map(st => (
                      <option key={st.id} value={st.id}>{st.employee_code} - Dr. {st.first_name} {st.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Link Clinical Appointment (Optional)</label>
                  <select className="input-field" value={prescriptionForm.appointment_id || ''} onChange={e => setPrescriptionForm({...prescriptionForm, appointment_id: e.target.value ? parseInt(e.target.value) : ''})}>
                    <option value="">Direct Prescription (Unlinked)</option>
                    {appointments.map(a => (
                      <option key={a.id} value={a.id}>Appt #{a.id} - {a.patient_name} ({new Date(a.appointment_date).toLocaleDateString()})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prescription Status</label>
                  <select className="input-field" value={prescriptionForm.status} onChange={e => setPrescriptionForm({...prescriptionForm, status: e.target.value})}>
                    <option value="ISSUED">ISSUED - Ready for Dispensing</option>
                    <option value="DRAFT">DRAFT - Pending Doctor Approval</option>
                    <option value="DISPENSED">DISPENSED - Pharmacy Fulfilled</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Clinical Instructions & Notes</label>
                <textarea className="input-field" rows={2} value={prescriptionForm.clinical_notes} onChange={e => setPrescriptionForm({...prescriptionForm, clinical_notes: e.target.value})} placeholder="Special clinical instructions, dietary cautions, follow-up advice..." />
              </div>

              {/* Dynamic Prescription Items Builder */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)' }}>Prescribed Medicines List ({prescriptionForm.items.length})</label>
                  <button type="button" onClick={handleAddPrescriptionItem} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {prescriptionForm.items.map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 30px', gap: '8px', alignItems: 'center' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Medicine</label>
                          <select className="input-field" value={item.medicine_id} onChange={e => handleUpdatePrescriptionItem(idx, 'medicine_id', parseInt(e.target.value))}>
                            {medicinesList.map(m => (
                              <option key={m.id} value={m.id}>{m.brand_name} ({m.generic_name}) - {m.dosage_form}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dosage</label>
                          <input type="text" className="input-field" value={item.dosage} onChange={e => handleUpdatePrescriptionItem(idx, 'dosage', e.target.value)} placeholder="500mg" />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Qty Prescribed</label>
                          <input type="number" className="input-field" value={item.quantity_prescribed} onChange={e => handleUpdatePrescriptionItem(idx, 'quantity_prescribed', parseInt(e.target.value))} />
                        </div>
                        {prescriptionForm.items.length > 1 && (
                          <button type="button" onClick={() => handleRemovePrescriptionItem(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', marginTop: '14px' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Frequency</label>
                          <input type="text" className="input-field" value={item.frequency} onChange={e => handleUpdatePrescriptionItem(idx, 'frequency', e.target.value)} placeholder="BD - Twice daily" />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Duration (Days)</label>
                          <input type="number" className="input-field" value={item.duration_days} onChange={e => handleUpdatePrescriptionItem(idx, 'duration_days', parseInt(e.target.value))} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Patient Instructions</label>
                          <input type="text" className="input-field" value={item.instructions} onChange={e => handleUpdatePrescriptionItem(idx, 'instructions', e.target.value)} placeholder="Take with food" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button type="button" onClick={() => setShowCreatePrescriptionModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Issue Rx Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & PRINT PRESCRIPTION SLIP MODAL */}
      {showViewPrescriptionModal && selectedPrescription && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', background: '#fff', color: '#1e293b' }}>
            <button onClick={() => setShowViewPrescriptionModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            {/* Clinical Slip Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>MediSync Enterprise Healthcare</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Central Hospital • Clinical Pharmacy Services</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#4f46e5', fontFamily: 'monospace' }}>{selectedPrescription.prescription_code}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Issued: {selectedPrescription.issued_at ? new Date(selectedPrescription.issued_at).toLocaleDateString() : 'Draft'}</div>
              </div>
            </div>

            {/* Patient & Doctor Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>PATIENT DETAILS:</strong>
                <div>{selectedPrescription.patient_name} ({selectedPrescription.patient_code})</div>
                <div>Blood Group: <strong>{selectedPrescription.blood_group || 'O+'}</strong> • Phone: {selectedPrescription.patient_phone || 'N/A'}</div>
                {selectedPrescription.allergies && selectedPrescription.allergies.toLowerCase() !== 'none' && (
                  <div style={{ color: '#dc2626', fontWeight: '700', marginTop: '4px' }}>⚠️ Allergy Alert: {selectedPrescription.allergies}</div>
                )}
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>PRESCRIBING CLINICIAN:</strong>
                <div>Dr. {selectedPrescription.doctor_name}</div>
                <div>{selectedPrescription.specialization || 'Cardiology Specialist'}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Ward: {selectedPrescription.department_name || 'General OPD'}</div>
              </div>
            </div>

            {/* Prescribed Items Table */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Rx Prescribed Medication Protocol:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569' }}>
                  <th style={{ padding: '8px' }}>MEDICINE & FORMULA</th>
                  <th style={{ padding: '8px' }}>DOSAGE</th>
                  <th style={{ padding: '8px' }}>FREQUENCY</th>
                  <th style={{ padding: '8px' }}>DURATION</th>
                  <th style={{ padding: '8px' }}>QTY</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrescription.items && selectedPrescription.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px', fontWeight: '700' }}>{item.brand_name} ({item.generic_name})</td>
                    <td style={{ padding: '8px' }}>{item.dosage}</td>
                    <td style={{ padding: '8px' }}>{item.frequency}</td>
                    <td style={{ padding: '8px' }}>{item.duration_days} days</td>
                    <td style={{ padding: '8px', fontWeight: '700' }}>{item.quantity_prescribed}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedPrescription.clinical_notes && (
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '16px', color: '#334155' }}>
                <strong>Clinical Notes:</strong> {selectedPrescription.clinical_notes}
              </div>
            )}

            {/* Footer Signature & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: selectedPrescription.status === 'DISPENSED' ? '#16a34a' : '#4f46e5' }}>
                STATUS: {selectedPrescription.status}
              </span>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                <Printer size={14} />
                <span>Print Rx Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRESCRIPTION MODAL */}
      {showEditPrescriptionModal && selectedPrescription && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditPrescriptionModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Prescription {selectedPrescription.prescription_code}</h3>
            <form onSubmit={handleUpdatePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prescription Status</label>
                <select className="input-field" value={selectedPrescription.status} onChange={e => setSelectedPrescription({...selectedPrescription, status: e.target.value})}>
                  <option value="ISSUED">ISSUED - Ready for Dispensing</option>
                  <option value="DISPENSED">DISPENSED - Pharmacy Fulfilled</option>
                  <option value="DRAFT">DRAFT - Pending Doctor Review</option>
                  <option value="CANCELLED">CANCELLED - Revoked</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Clinical Instructions & Notes</label>
                <textarea className="input-field" rows={3} value={selectedPrescription.clinical_notes || ''} onChange={e => setSelectedPrescription({...selectedPrescription, clinical_notes: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditPrescriptionModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PRESCRIPTION MODAL */}
      {showDeletePrescriptionModal && selectedPrescription && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Prescription Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete prescription <strong>{selectedPrescription.prescription_code}</strong> for patient <strong>{selectedPrescription.patient_name}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeletePrescriptionModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeletePrescription} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Prescription</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE APPOINTMENT MODAL */}
      {showCreateAppointmentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateAppointmentModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Book New Clinical Appointment</h3>
            <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Patient (EHR)</label>
                <select className="input-field" value={appointmentForm.patient_id} onChange={e => setAppointmentForm({...appointmentForm, patient_id: parseInt(e.target.value)})}>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.patient_code} - {p.first_name} {p.last_name} ({p.blood_group || 'O+'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Attending Doctor / Clinician</label>
                <select className="input-field" value={appointmentForm.doctor_id} onChange={e => setAppointmentForm({...appointmentForm, doctor_id: parseInt(e.target.value)})}>
                  {staffList.map(st => (
                    <option key={st.id} value={st.id}>{st.employee_code} - Dr. {st.first_name} {st.last_name} ({st.specialization || 'General Care'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Appointment Date & Time</label>
                <input type="datetime-local" className="input-field" required value={appointmentForm.appointment_date} onChange={e => setAppointmentForm({...appointmentForm, appointment_date: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Type</label>
                  <select className="input-field" value={appointmentForm.type} onChange={e => setAppointmentForm({...appointmentForm, type: e.target.value})}>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine Checkup">Routine Checkup</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Priority Level</label>
                  <select className="input-field" value={appointmentForm.priority} onChange={e => setAppointmentForm({...appointmentForm, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select className="input-field" value={appointmentForm.status} onChange={e => setAppointmentForm({...appointmentForm, status: e.target.value})}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Clinical Reason / Notes</label>
                <textarea className="input-field" rows={3} value={appointmentForm.reason} onChange={e => setAppointmentForm({...appointmentForm, reason: e.target.value})} placeholder="Reason for consultation or follow-up symptoms..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateAppointmentModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Book Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT APPOINTMENT MODAL */}
      {showEditAppointmentModal && selectedAppointment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditAppointmentModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Clinical Appointment #{selectedAppointment.id}</h3>
            <form onSubmit={handleUpdateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Patient (EHR)</label>
                <select className="input-field" value={selectedAppointment.patient_id} onChange={e => setSelectedAppointment({...selectedAppointment, patient_id: parseInt(e.target.value)})}>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.patient_code} - {p.first_name} {p.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Attending Doctor / Clinician</label>
                <select className="input-field" value={selectedAppointment.doctor_id} onChange={e => setSelectedAppointment({...selectedAppointment, doctor_id: parseInt(e.target.value)})}>
                  {staffList.map(st => (
                    <option key={st.id} value={st.id}>{st.employee_code} - Dr. {st.first_name} {st.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Appointment Date & Time</label>
                <input type="datetime-local" className="input-field" required value={selectedAppointment.appointment_date ? selectedAppointment.appointment_date.replace(' ', 'T').slice(0, 16) : ''} onChange={e => setSelectedAppointment({...selectedAppointment, appointment_date: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Type</label>
                  <select className="input-field" value={selectedAppointment.type} onChange={e => setSelectedAppointment({...selectedAppointment, type: e.target.value})}>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine Checkup">Routine Checkup</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Priority Level</label>
                  <select className="input-field" value={selectedAppointment.priority} onChange={e => setSelectedAppointment({...selectedAppointment, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select className="input-field" value={selectedAppointment.status} onChange={e => setSelectedAppointment({...selectedAppointment, status: e.target.value})}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Clinical Reason / Notes</label>
                <textarea className="input-field" rows={3} value={selectedAppointment.reason || ''} onChange={e => setSelectedAppointment({...selectedAppointment, reason: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditAppointmentModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE APPOINTMENT MODAL */}
      {showDeleteAppointmentModal && selectedAppointment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Appointment Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete clinical appointment <strong>#{selectedAppointment.id}</strong> for patient <strong>{selectedAppointment.patient_name}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteAppointmentModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteAppointment} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* CLINICIAN TRIAGE OVERRIDE MODAL */}
      {showOverrideModal && selectedTriageLog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowOverrideModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>Clinician Triage Override #{selectedTriageLog.id}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Presented Symptoms: <em>"{selectedTriageLog.input_symptoms}"</em>
            </p>

            <form onSubmit={handleDoctorOverride} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Override Triage Priority Level</label>
                <select className="input-field" value={selectedTriageLog.suggested_triage_level} onChange={e => setSelectedTriageLog({...selectedTriageLog, suggested_triage_level: e.target.value})}>
                  <option value="Routine">Routine - OPD Walk-in</option>
                  <option value="Urgent">Urgent - Priority OPD Consultation</option>
                  <option value="Emergency">Emergency - Immediate Resuscitation & ICU</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Override Destination Ward</label>
                <select className="input-field" value={selectedTriageLog.recommended_department} onChange={e => setSelectedTriageLog({...selectedTriageLog, recommended_department: e.target.value})}>
                  <option value="Cardiology & ICU">Cardiology & ICU</option>
                  <option value="Neurology & Stroke Unit">Neurology & Stroke Unit</option>
                  <option value="Pulmonology Ward">Pulmonology Ward</option>
                  <option value="General OPD">General OPD</option>
                  <option value="Pediatrics Ward">Pediatrics Ward</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowOverrideModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Apply Clinician Override</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DEPARTMENT MODAL */}
      {showCreateDepartmentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateDepartmentModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Add Hospital Department / Ward</h3>
            <form onSubmit={handleCreateDepartment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Name</label>
                <input type="text" className="input-field" required value={departmentForm.name} onChange={e => setDepartmentForm({...departmentForm, name: e.target.value})} placeholder="e.g. Pediatrics Unit, Surgical ICU" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Code</label>
                  <input type="text" className="input-field" value={departmentForm.code} onChange={e => setDepartmentForm({...departmentForm, code: e.target.value})} placeholder="DEPT-PED-01" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Floor Location & Wing</label>
                  <input type="text" className="input-field" value={departmentForm.location_floor} onChange={e => setDepartmentForm({...departmentForm, location_floor: e.target.value})} placeholder="3rd Floor - Wing C" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea className="input-field" rows={3} value={departmentForm.description} onChange={e => setDepartmentForm({...departmentForm, description: e.target.value})} placeholder="Specialized pediatric inpatient care and clinical monitoring..." />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ward Operational Status</label>
                <select className="input-field" value={departmentForm.status} onChange={e => setDepartmentForm({...departmentForm, status: e.target.value})}>
                  <option value="active">Active & Operational</option>
                  <option value="inactive">Inactive / Under Renovation</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateDepartmentModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DEPARTMENT MODAL */}
      {showEditDepartmentModal && selectedDepartment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditDepartmentModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Department #{selectedDepartment.id}</h3>
            <form onSubmit={handleUpdateDepartment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Name</label>
                <input type="text" className="input-field" required value={selectedDepartment.name} onChange={e => setSelectedDepartment({...selectedDepartment, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Code</label>
                  <input type="text" className="input-field" value={selectedDepartment.code || ''} onChange={e => setSelectedDepartment({...selectedDepartment, code: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Floor Location & Wing</label>
                  <input type="text" className="input-field" value={selectedDepartment.location_floor || ''} onChange={e => setSelectedDepartment({...selectedDepartment, location_floor: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea className="input-field" rows={3} value={selectedDepartment.description || ''} onChange={e => setSelectedDepartment({...selectedDepartment, description: e.target.value})} />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ward Operational Status</label>
                <select className="input-field" value={selectedDepartment.status || 'active'} onChange={e => setSelectedDepartment({...selectedDepartment, status: e.target.value})}>
                  <option value="active">Active & Operational</option>
                  <option value="inactive">Inactive / Under Renovation</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditDepartmentModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DEPARTMENT MODAL */}
      {showDeleteDepartmentModal && selectedDepartment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Department Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete department <strong>{selectedDepartment.name}</strong> ({selectedDepartment.code}) from the system?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteDepartmentModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteDepartment} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Department</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MEDICINE MODAL */}
      {showCreateMedicineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateMedicineModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Add New Medicine to Formulary</h3>
            <form onSubmit={handleCreateMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Brand Name</label>
                  <input type="text" className="input-field" required value={medicineForm.brand_name} onChange={e => setMedicineForm({...medicineForm, brand_name: e.target.value})} placeholder="Amoxil 500mg" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Generic Formula Name</label>
                  <input type="text" className="input-field" required value={medicineForm.generic_name} onChange={e => setMedicineForm({...medicineForm, generic_name: e.target.value})} placeholder="Amoxicillin Trihydrate" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Classification</label>
                  <select className="input-field" value={medicineForm.category_id} onChange={e => setMedicineForm({...medicineForm, category_id: parseInt(e.target.value)})}>
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Dosage Form</label>
                  <select className="input-field" value={medicineForm.dosage_form} onChange={e => setMedicineForm({...medicineForm, dosage_form: e.target.value})}>
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Inhaler', 'Drops'].map(df => (
                      <option key={df} value={df}>{df}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Measurement Unit</label>
                  <input type="text" className="input-field" value={medicineForm.unit} onChange={e => setMedicineForm({...medicineForm, unit: e.target.value})} placeholder="pcs, capsules" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Unit Price (LKR)</label>
                  <input type="number" step="0.01" className="input-field" value={medicineForm.unit_price} onChange={e => setMedicineForm({...medicineForm, unit_price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Min Reorder Level</label>
                  <input type="number" className="input-field" value={medicineForm.min_reorder_level} onChange={e => setMedicineForm({...medicineForm, min_reorder_level: parseInt(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Barcode / GTIN</label>
                  <input type="text" className="input-field" value={medicineForm.barcode} onChange={e => setMedicineForm({...medicineForm, barcode: e.target.value})} placeholder="8901234567890" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prescription Rule</label>
                  <select className="input-field" value={medicineForm.prescription_required ? 'true' : 'false'} onChange={e => setMedicineForm({...medicineForm, prescription_required: e.target.value === 'true'})}>
                    <option value="true">Prescription Required (Rx Only)</option>
                    <option value="false">Over The Counter (OTC)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateMedicineModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEDICINE MODAL */}
      {showEditMedicineModal && selectedMedicine && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditMedicineModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Medicine Profile #{selectedMedicine.id}</h3>
            <form onSubmit={handleUpdateMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Brand Name</label>
                  <input type="text" className="input-field" required value={selectedMedicine.brand_name} onChange={e => setSelectedMedicine({...selectedMedicine, brand_name: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Generic Formula Name</label>
                  <input type="text" className="input-field" required value={selectedMedicine.generic_name} onChange={e => setSelectedMedicine({...selectedMedicine, generic_name: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Classification</label>
                  <select className="input-field" value={selectedMedicine.category_id || 1} onChange={e => setSelectedMedicine({...selectedMedicine, category_id: parseInt(e.target.value)})}>
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Dosage Form</label>
                  <select className="input-field" value={selectedMedicine.dosage_form || 'Tablet'} onChange={e => setSelectedMedicine({...selectedMedicine, dosage_form: e.target.value})}>
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Inhaler', 'Drops'].map(df => (
                      <option key={df} value={df}>{df}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Measurement Unit</label>
                  <input type="text" className="input-field" value={selectedMedicine.unit || 'pcs'} onChange={e => setSelectedMedicine({...selectedMedicine, unit: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Unit Price (LKR)</label>
                  <input type="number" step="0.01" className="input-field" value={selectedMedicine.unit_price} onChange={e => setSelectedMedicine({...selectedMedicine, unit_price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Min Reorder Level</label>
                  <input type="number" className="input-field" value={selectedMedicine.min_reorder_level} onChange={e => setSelectedMedicine({...selectedMedicine, min_reorder_level: parseInt(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Barcode / GTIN</label>
                  <input type="text" className="input-field" value={selectedMedicine.barcode || ''} onChange={e => setSelectedMedicine({...selectedMedicine, barcode: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prescription Rule</label>
                  <select className="input-field" value={selectedMedicine.prescription_required ? 'true' : 'false'} onChange={e => setSelectedMedicine({...selectedMedicine, prescription_required: e.target.value === 'true'})}>
                    <option value="true">Prescription Required (Rx Only)</option>
                    <option value="false">Over The Counter (OTC)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Catalog Status</label>
                  <select className="input-field" value={selectedMedicine.status || 'active'} onChange={e => setSelectedMedicine({...selectedMedicine, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditMedicineModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MEDICINE MODAL */}
      {showDeleteMedicineModal && selectedMedicine && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Medicine Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete medicine <strong>{selectedMedicine.brand_name}</strong> ({selectedMedicine.barcode}) from the formulary catalog?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteMedicineModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteMedicine} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Medicine</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {showCreateCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateCategoryModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Add Medicine Category</h3>
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Name</label>
                <input type="text" className="input-field" required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="e.g. Antibiotics, Analgesics" />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Description</label>
                <textarea className="input-field" rows={3} value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} placeholder="Brief description of pharmaceutical classification..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateCategoryModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {showEditCategoryModal && selectedCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditCategoryModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Medicine Category #{selectedCategory.id}</h3>
            <form onSubmit={handleUpdateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Name</label>
                <input type="text" className="input-field" required value={selectedCategory.name} onChange={e => setSelectedCategory({...selectedCategory, name: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Description</label>
                <textarea className="input-field" rows={3} value={selectedCategory.description || ''} onChange={e => setSelectedCategory({...selectedCategory, description: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditCategoryModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY MODAL */}
      {showDeleteCategoryModal && selectedCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Category Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete category <strong>{selectedCategory.name}</strong> from the system?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteCategoryModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteCategory} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Category</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PATIENT MODAL */}
      {showCreatePatientModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreatePatientModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Register New Patient Record (EHR)</h3>
            <form onSubmit={handleCreatePatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>First Name</label>
                  <input type="text" className="input-field" required value={patientForm.first_name} onChange={e => setPatientForm({...patientForm, first_name: e.target.value})} placeholder="Eleanor" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Last Name</label>
                  <input type="text" className="input-field" required value={patientForm.last_name} onChange={e => setPatientForm({...patientForm, last_name: e.target.value})} placeholder="Vance" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date of Birth</label>
                  <input type="date" className="input-field" required value={patientForm.dob} onChange={e => setPatientForm({...patientForm, dob: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Gender</label>
                  <select className="input-field" value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Blood Group</label>
                  <select className="input-field" value={patientForm.blood_group} onChange={e => setPatientForm({...patientForm, blood_group: e.target.value})}>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>NIC / Passport No.</label>
                  <input type="text" className="input-field" value={patientForm.nic_passport} onChange={e => setPatientForm({...patientForm, nic_passport: e.target.value})} placeholder="199564501988" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                  <input type="text" className="input-field" value={patientForm.phone} onChange={e => setPatientForm({...patientForm, phone: e.target.value})} placeholder="+94 77 555 1234" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Emergency Contact Name</label>
                  <input type="text" className="input-field" value={patientForm.emergency_contact_name} onChange={e => setPatientForm({...patientForm, emergency_contact_name: e.target.value})} placeholder="Saman Jayasinghe" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Emergency Contact Phone</label>
                  <input type="text" className="input-field" value={patientForm.emergency_contact_phone} onChange={e => setPatientForm({...patientForm, emergency_contact_phone: e.target.value})} placeholder="+94 71 888 9999" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Known Drug Allergies (EHR Alert)</label>
                <input type="text" className="input-field" value={patientForm.allergies} onChange={e => setPatientForm({...patientForm, allergies: e.target.value})} placeholder="Penicillin, Sulfa drugs, Aspirin" />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Medical History & Conditions</label>
                <input type="text" className="input-field" value={patientForm.medical_history} onChange={e => setPatientForm({...patientForm, medical_history: e.target.value})} placeholder="Hypertension, Mild Asthma" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreatePatientModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Patient Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PATIENT MODAL */}
      {showEditPatientModal && selectedPatient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditPatientModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Patient EHR Profile #{selectedPatient.id}</h3>
            <form onSubmit={handleUpdatePatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>First Name</label>
                  <input type="text" className="input-field" required value={selectedPatient.first_name} onChange={e => setSelectedPatient({...selectedPatient, first_name: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Last Name</label>
                  <input type="text" className="input-field" required value={selectedPatient.last_name} onChange={e => setSelectedPatient({...selectedPatient, last_name: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date of Birth</label>
                  <input type="date" className="input-field" required value={selectedPatient.dob || '1995-01-01'} onChange={e => setSelectedPatient({...selectedPatient, dob: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Gender</label>
                  <select className="input-field" value={selectedPatient.gender || 'Female'} onChange={e => setSelectedPatient({...selectedPatient, gender: e.target.value})}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Blood Group</label>
                  <select className="input-field" value={selectedPatient.blood_group || 'O+'} onChange={e => setSelectedPatient({...selectedPatient, blood_group: e.target.value})}>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>NIC / Passport No.</label>
                  <input type="text" className="input-field" value={selectedPatient.nic_passport || ''} onChange={e => setSelectedPatient({...selectedPatient, nic_passport: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                  <input type="text" className="input-field" value={selectedPatient.phone || ''} onChange={e => setSelectedPatient({...selectedPatient, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Known Drug Allergies (EHR Alert)</label>
                <input type="text" className="input-field" value={selectedPatient.allergies || ''} onChange={e => setSelectedPatient({...selectedPatient, allergies: e.target.value})} />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Medical History & Conditions</label>
                <input type="text" className="input-field" value={selectedPatient.medical_history || ''} onChange={e => setSelectedPatient({...selectedPatient, medical_history: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditPatientModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update EHR Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PATIENT MODAL */}
      {showDeletePatientModal && selectedPatient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Patient EHR Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete patient health record <strong>{selectedPatient.first_name} {selectedPatient.last_name}</strong> ({selectedPatient.patient_code}) from the system?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeletePatientModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeletePatient} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Patient EHR</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STAFF MODAL */}
      {showCreateStaffModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateStaffModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Register New Hospital Staff Member</h3>
            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>First Name</label>
                  <input type="text" className="input-field" required value={staffForm.first_name} onChange={e => setStaffForm({...staffForm, first_name: e.target.value})} placeholder="Dr. Aris" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Last Name</label>
                  <input type="text" className="input-field" required value={staffForm.last_name} onChange={e => setStaffForm({...staffForm, last_name: e.target.value})} placeholder="Thorne" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Work Email Address</label>
                  <input type="email" className="input-field" required value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} placeholder="thorne@medisync.health" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Password</label>
                  <input type="password" className="input-field" required value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assign System Role</label>
                  <select className="input-field" value={staffForm.role_id} onChange={e => setStaffForm({...staffForm, role_id: parseInt(e.target.value)})}>
                    {rolesList.map(r => (
                      <option key={r.id} value={r.id}>{r.display_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Ward</label>
                  <select className="input-field" value={staffForm.department_id} onChange={e => setStaffForm({...staffForm, department_id: parseInt(e.target.value)})}>
                    {departmentsList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Specialization</label>
                  <input type="text" className="input-field" value={staffForm.specialization} onChange={e => setStaffForm({...staffForm, specialization: e.target.value})} placeholder="Senior Cardiologist" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>SLMC License Number</label>
                  <input type="text" className="input-field" value={staffForm.license_number} onChange={e => setStaffForm({...staffForm, license_number: e.target.value})} placeholder="SLMC-MED-98712" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                  <input type="text" className="input-field" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} placeholder="+94 71 987 6543" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Duty Status</label>
                  <select className="input-field" value={staffForm.duty_status} onChange={e => setStaffForm({...staffForm, duty_status: e.target.value})}>
                    <option value="on_duty">On Duty</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateStaffModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Staff Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditStaffModal && selectedStaff && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditStaffModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Staff Profile #{selectedStaff.id}</h3>
            <form onSubmit={handleUpdateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>First Name</label>
                  <input type="text" className="input-field" required value={selectedStaff.first_name} onChange={e => setSelectedStaff({...selectedStaff, first_name: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Last Name</label>
                  <input type="text" className="input-field" required value={selectedStaff.last_name} onChange={e => setSelectedStaff({...selectedStaff, last_name: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department Ward</label>
                  <select className="input-field" value={selectedStaff.department_id || 1} onChange={e => setSelectedStaff({...selectedStaff, department_id: parseInt(e.target.value)})}>
                    {departmentsList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Duty Status</label>
                  <select className="input-field" value={selectedStaff.duty_status || 'on_duty'} onChange={e => setSelectedStaff({...selectedStaff, duty_status: e.target.value})}>
                    <option value="on_duty">On Duty</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Specialization</label>
                  <input type="text" className="input-field" value={selectedStaff.specialization || ''} onChange={e => setSelectedStaff({...selectedStaff, specialization: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>SLMC License Number</label>
                  <input type="text" className="input-field" value={selectedStaff.license_number || ''} onChange={e => setSelectedStaff({...selectedStaff, license_number: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                <input type="text" className="input-field" value={selectedStaff.phone || ''} onChange={e => setSelectedStaff({...selectedStaff, phone: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditStaffModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Staff Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE STAFF MODAL */}
      {showDeleteStaffModal && selectedStaff && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Staff Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete staff profile <strong>{selectedStaff.first_name} {selectedStaff.last_name}</strong> ({selectedStaff.employee_code}) from the system?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteStaffModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteStaff} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Staff Profile</button>
            </div>
          </div>
        </div>
      )}

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

      {/* CREATE STOCK BATCH MODAL */}
      {showCreateBatchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreateBatchModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Intake New FEFO Medicine Stock Batch</h3>
            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Formulary Medicine</label>
                  <select className="input-field" value={batchForm.medicine_id} onChange={e => setBatchForm({...batchForm, medicine_id: parseInt(e.target.value)})}>
                    {medicinesList.map(m => (
                      <option key={m.id} value={m.id}>{m.brand_name} ({m.generic_name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Supplier</label>
                  <select className="input-field" value={batchForm.supplier_id || ''} onChange={e => setBatchForm({...batchForm, supplier_id: e.target.value ? parseInt(e.target.value) : ''})}>
                    <option value="">Central Pharmacy Intake (No Supplier)</option>
                    {suppliersList.map(s => (
                      <option key={s.id} value={s.id}>{s.supplier_code} - {s.company_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Batch Number</label>
                  <input type="text" className="input-field" required value={batchForm.batch_number} onChange={e => setBatchForm({...batchForm, batch_number: e.target.value})} placeholder="AMX-2026-N1" />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Storage Rack / Location</label>
                  <input type="text" className="input-field" value={batchForm.storage_location} onChange={e => setBatchForm({...batchForm, storage_location: e.target.value})} placeholder="Rack B-14, Cold Shelf C-02" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Manufacture Date (MFD)</label>
                  <input type="date" className="input-field" required value={batchForm.mfd_date} onChange={e => setBatchForm({...batchForm, mfd_date: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Expiry Date (FEFO)</label>
                  <input type="date" className="input-field" required value={batchForm.exp_date} onChange={e => setBatchForm({...batchForm, exp_date: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Initial Stock Qty</label>
                  <input type="number" className="input-field" required value={batchForm.initial_quantity} onChange={e => setBatchForm({...batchForm, initial_quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Unit Cost (LKR)</label>
                  <input type="number" step="0.01" className="input-field" value={batchForm.unit_cost} onChange={e => setBatchForm({...batchForm, unit_cost: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select className="input-field" value={batchForm.status} onChange={e => setBatchForm({...batchForm, status: e.target.value})}>
                    <option value="available">Available</option>
                    <option value="low">Low Stock</option>
                    <option value="expired">Expired</option>
                    <option value="recalled">Recalled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateBatchModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Intake Stock Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD INVENTORY STOCK MOVEMENT MODAL */}
      {showRecordTransactionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowRecordTransactionModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Record Inventory Stock Movement</h3>
            <form onSubmit={handleRecordTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Target FEFO Batch</label>
                <select className="input-field" value={transactionForm.batch_id} onChange={e => setTransactionForm({...transactionForm, batch_id: parseInt(e.target.value)})}>
                  {batchesList.map(b => (
                    <option key={b.id} value={b.id}>{b.batch_number} - {b.brand_name} (Curr Stock: {b.current_quantity} {b.unit || 'pcs'} • Exp: {b.exp_date})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Movement Type</label>
                  <select className="input-field" value={transactionForm.transaction_type} onChange={e => setTransactionForm({...transactionForm, transaction_type: e.target.value})}>
                    <option value="RESTOCK">RESTOCK (+ Stock Intake)</option>
                    <option value="DISPENSE">DISPENSE (- Clinical Dispense)</option>
                    <option value="ADJUSTMENT">ADJUSTMENT (= Audit Set Stock)</option>
                    <option value="RETURN">RETURN (+ Returned to Inventory)</option>
                    <option value="EXPIRED_DISCARD">EXPIRED_DISCARD (- Damaged/Expired)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Quantity to Move</label>
                  <input type="number" min="1" className="input-field" required value={transactionForm.quantity} onChange={e => setTransactionForm({...transactionForm, quantity: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Movement Audit Notes</label>
                <textarea className="input-field" rows={3} value={transactionForm.notes} onChange={e => setTransactionForm({...transactionForm, notes: e.target.value})} placeholder="Reason for inventory movement, invoice ref, or ward order..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowRecordTransactionModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Log Transaction & Update Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STOCK BATCH MODAL */}
      {showEditBatchModal && selectedBatch && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditBatchModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Stock Batch {selectedBatch.batch_number}</h3>
            <form onSubmit={handleUpdateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Current Stock Qty</label>
                  <input type="number" className="input-field" value={selectedBatch.current_quantity} onChange={e => setSelectedBatch({...selectedBatch, current_quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Batch Status</label>
                  <select className="input-field" value={selectedBatch.status} onChange={e => setSelectedBatch({...selectedBatch, status: e.target.value})}>
                    <option value="available">Available</option>
                    <option value="low">Low Stock</option>
                    <option value="expired">Expired</option>
                    <option value="recalled">Recalled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Expiry Date (FEFO)</label>
                  <input type="date" className="input-field" value={selectedBatch.exp_date} onChange={e => setSelectedBatch({...selectedBatch, exp_date: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Storage Location</label>
                  <input type="text" className="input-field" value={selectedBatch.storage_location || ''} onChange={e => setSelectedBatch({...selectedBatch, storage_location: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditBatchModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PERMISSION MODAL */}
      {showCreatePermissionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowCreatePermissionModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Register New System Permission</h3>
            <form onSubmit={handleCreatePermission} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Permission Key (Name)</label>
                <input type="text" className="input-field" required value={permissionForm.name} onChange={e => setPermissionForm({...permissionForm, name: e.target.value})} placeholder="patients.export, reports.view" />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Display Label</label>
                <input type="text" className="input-field" required value={permissionForm.display_name} onChange={e => setPermissionForm({...permissionForm, display_name: e.target.value})} placeholder="Export Patient EHR Data to PDF" />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>System Module Tag</label>
                <select className="input-field" value={permissionForm.module} onChange={e => setPermissionForm({...permissionForm, module: e.target.value})}>
                  <option value="security">Security & Access Control</option>
                  <option value="patients">Patient Records (EHR)</option>
                  <option value="clinical">Clinical & Prescriptions</option>
                  <option value="inventory">Inventory & FEFO Batches</option>
                  <option value="ai">AI Engine & Triage</option>
                  <option value="general">General Administration</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreatePermissionModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create System Permission</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PERMISSION MODAL */}
      {showEditPermissionModal && selectedPermission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowEditPermissionModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Edit Permission #{selectedPermission.id}</h3>
            <form onSubmit={handleUpdatePermission} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Permission Key</label>
                <input type="text" className="input-field" value={selectedPermission.name} onChange={e => setSelectedPermission({...selectedPermission, name: e.target.value})} />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Display Label</label>
                <input type="text" className="input-field" value={selectedPermission.display_name} onChange={e => setSelectedPermission({...selectedPermission, display_name: e.target.value})} />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>System Module</label>
                <input type="text" className="input-field" value={selectedPermission.module} onChange={e => setSelectedPermission({...selectedPermission, module: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditPermissionModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Permission</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PERMISSION MODAL */}
      {showDeletePermissionModal && selectedPermission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Confirm Permission Deletion</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to delete permission <strong>{selectedPermission.display_name}</strong> (<code>{selectedPermission.name}</code>)?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeletePermissionModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeletePermission} className="btn btn-primary" style={{ background: 'var(--danger)' }}>Delete Permission</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


