<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $adminRoleId = DB::table('roles')->insertGetId([
            'name' => 'super_admin',
            'display_name' => 'Super Administrator',
            'description' => 'Full administrative control over MediSync platform',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $pharmacistRoleId = DB::table('roles')->insertGetId([
            'name' => 'pharmacist',
            'display_name' => 'Chief Pharmacist',
            'description' => 'Manages inventory, FEFO batch tracking, and dispensing',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $doctorRoleId = DB::table('roles')->insertGetId([
            'name' => 'doctor',
            'display_name' => 'Medical Officer / Doctor',
            'description' => 'Prescribes medications and conducts patient consultations',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $nurseRoleId = DB::table('roles')->insertGetId([
            'name' => 'nurse',
            'display_name' => 'Staff Nurse / Ward Care Officer',
            'description' => 'Patient intake, OPD clinic check-ins, and ward bed capacity tracking',
            'created_at' => now(), 'updated_at' => now()
        ]);


        // 2. Permissions & Pivot
        $perms = [
            ['name' => 'inventory.manage', 'display_name' => 'Manage Medicine Inventory & Stock', 'module' => 'inventory'],
            ['name' => 'prescriptions.issue', 'display_name' => 'Issue Electronic Prescriptions', 'module' => 'clinical'],
            ['name' => 'ai.analytics', 'display_name' => 'Access AI Expiry & FEFO Risk Intelligence', 'module' => 'ai'],
            ['name' => 'users.manage', 'display_name' => 'Manage System Users & Roles', 'module' => 'security'],
            ['name' => 'roles.manage', 'display_name' => 'Configure System Roles & Access Matrix', 'module' => 'security'],
            ['name' => 'patients.view', 'display_name' => 'View Patient Health Records (EHR)', 'module' => 'clinical'],
            ['name' => 'patients.create', 'display_name' => 'Register & Edit Patient Records', 'module' => 'patients'],
            ['name' => 'appointments.manage', 'display_name' => 'Schedule & Manage Appointments', 'module' => 'clinical'],
            ['name' => 'medicines.manage', 'display_name' => 'Manage Medicine Formulary Catalog', 'module' => 'inventory'],
            ['name' => 'batches.manage', 'display_name' => 'Intake & Manage FEFO Batches', 'module' => 'inventory'],
            ['name' => 'suppliers.manage', 'display_name' => 'Manage Pharmaceutical Suppliers', 'module' => 'inventory'],
            ['name' => 'ai.triage', 'display_name' => 'Access Groq AI Symptom Triage', 'module' => 'ai'],
            ['name' => 'departments.manage', 'display_name' => 'Manage Hospital Departments & Wards', 'module' => 'security'],
            ['name' => 'reports.export', 'display_name' => 'Export Executive Clinical Reports', 'module' => 'security'],
            ['name' => 'appointments.view', 'display_name' => 'View Clinical Appointments', 'module' => 'clinical'],
            ['name' => 'prescriptions.view', 'display_name' => 'View Electronic Prescriptions', 'module' => 'clinical'],
            ['name' => 'patients.manage', 'display_name' => 'Register & Manage Patient EHR', 'module' => 'clinical'],
            ['name' => 'inventory.view', 'display_name' => 'View Medicine Formulary & Categories', 'module' => 'inventory'],
            ['name' => 'batches.view', 'display_name' => 'View FEFO Stock Batches', 'module' => 'inventory'],
            ['name' => 'transactions.view', 'display_name' => 'View Stock Intake & Dispensing Logs', 'module' => 'inventory'],
            ['name' => 'ai.override', 'display_name' => 'Clinician AI Recommendation Override', 'module' => 'ai'],
            ['name' => 'staff.manage', 'display_name' => 'Manage Medical Staff Roster', 'module' => 'security'],
            ['name' => 'matrix.manage', 'display_name' => 'Manage Role-Permissions Access Matrix', 'module' => 'security'],
            ['name' => 'audit.view', 'display_name' => 'View System Audit Ledger Logs', 'module' => 'security'],
        ];

        foreach ($perms as $p) {
            DB::table('permissions')->updateOrInsert(['name' => $p['name']], $p);
        }

        // 1. Super Admin (ALL 24 PERMISSIONS GRANTED)
        $allPids = DB::table('permissions')->pluck('id');
        foreach ($allPids as $pid) {
            DB::table('role_permissions')->updateOrInsert(['role_id' => $adminRoleId, 'permission_id' => $pid]);
        }

        // 2. Chief Pharmacist (inventory.manage, ai.analytics, medicines.manage, batches.manage, suppliers.manage, reports.export, prescriptions.view, inventory.view, batches.view, transactions.view)
        $pharmPids = DB::table('permissions')->whereIn('name', [
            'inventory.manage', 'ai.analytics', 'medicines.manage', 'batches.manage',
            'suppliers.manage', 'reports.export', 'prescriptions.view', 'inventory.view',
            'batches.view', 'transactions.view'
        ])->pluck('id');
        foreach ($pharmPids as $pid) {
            DB::table('role_permissions')->updateOrInsert(['role_id' => $pharmacistRoleId, 'permission_id' => $pid]);
        }

        // 3. Medical Officer / Doctor (prescriptions.issue, patients.view, patients.create, appointments.manage, ai.triage, appointments.view, prescriptions.view, patients.manage, inventory.view, ai.override)
        $docPids = DB::table('permissions')->whereIn('name', [
            'prescriptions.issue', 'patients.view', 'patients.create', 'appointments.manage',
            'ai.triage', 'appointments.view', 'prescriptions.view', 'patients.manage',
            'inventory.view', 'ai.override'
        ])->pluck('id');
        foreach ($docPids as $pid) {
            DB::table('role_permissions')->updateOrInsert(['role_id' => $doctorRoleId, 'permission_id' => $pid]);
        }

        // 4. Staff Nurse / Ward Care Officer (patients.view, patients.create, appointments.manage, suppliers.manage, ai.triage, departments.manage, reports.export, appointments.view, patients.manage)
        $nursePids = DB::table('permissions')->whereIn('name', [
            'patients.view', 'patients.create', 'appointments.manage', 'suppliers.manage',
            'ai.triage', 'departments.manage', 'reports.export', 'appointments.view',
            'patients.manage'
        ])->pluck('id');
        foreach ($nursePids as $pid) {
            DB::table('role_permissions')->updateOrInsert(['role_id' => $nurseRoleId, 'permission_id' => $pid]);
        }



        // 3. Departments
        $pharmacyDeptId = DB::table('departments')->insertGetId([
            'code' => 'PHARM-01', 'name' => 'Central Pharmacy', 'description' => 'Main hospital drug store & dispensing hub', 'location_floor' => 'Ground Floor - Wing A', 'created_at' => now(), 'updated_at' => now()
        ]);
        $cardioDeptId = DB::table('departments')->insertGetId([
            'code' => 'CARD-02', 'name' => 'Cardiology Unit', 'description' => 'Heart and vascular care unit', 'location_floor' => '2nd Floor - Wing B', 'created_at' => now(), 'updated_at' => now()
        ]);
        $opdDeptId = DB::table('departments')->insertGetId([
            'code' => 'OPD-01', 'name' => 'Outpatient OPD', 'description' => 'General outpatient clinic', 'location_floor' => '1st Floor - Main Lobby', 'created_at' => now(), 'updated_at' => now()
        ]);

        // 4. Users & Staff
        $adminUserId = DB::table('users')->insertGetId([
            'role_id' => $adminRoleId,
            'name' => 'Dr. Admin Director',
            'email' => 'admin@medisync.health',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'phone' => '+94 77 123 4567',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $pharmacistUserId = DB::table('users')->insertGetId([
            'role_id' => $pharmacistRoleId,
            'name' => 'Sarah Jenkins',
            'email' => 'pharmacist@medisync.health',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'phone' => '+94 77 444 5566',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $pharmacistStaffId = DB::table('staff')->insertGetId([
            'user_id' => $pharmacistUserId,
            'department_id' => $pharmacyDeptId,
            'employee_code' => 'EMP-PHARM-102',
            'first_name' => 'Sarah',
            'last_name' => 'Jenkins',
            'specialization' => 'Chief Pharmacist & FEFO Specialist',
            'license_number' => 'SLMC-PH-4421',
            'phone' => '+94 77 444 5566',
            'status' => 'on_duty',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $doctorUserId = DB::table('users')->insertGetId([
            'role_id' => $doctorRoleId,
            'name' => 'Dr. Aris Thorne',
            'email' => 'doctor@medisync.health',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'phone' => '+94 71 987 6543',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // Secondary doctor login alias for legacy compatibility
        DB::table('users')->insertGetId([
            'role_id' => $doctorRoleId,
            'name' => 'Dr. Aris Thorne (Alias)',
            'email' => 'thorne@medisync.health',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'phone' => '+94 71 987 6543',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $doctorStaffId = DB::table('staff')->insertGetId([
            'user_id' => $doctorUserId,
            'department_id' => $cardioDeptId,
            'employee_code' => 'EMP-DOC-101',
            'first_name' => 'Aris',
            'last_name' => 'Thorne',
            'specialization' => 'Senior Cardiologist',
            'license_number' => 'SLMC-98712',
            'phone' => '+94 71 987 6543',
            'status' => 'on_duty',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $nurseUserId = DB::table('users')->insertGetId([
            'role_id' => $nurseRoleId,
            'name' => 'Nurse Clara Barton',
            'email' => 'nurse@medisync.health',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'phone' => '+94 71 333 8899',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $nurseStaffId = DB::table('staff')->insertGetId([
            'user_id' => $nurseUserId,
            'department_id' => $opdDeptId,
            'employee_code' => 'EMP-NURSE-103',
            'first_name' => 'Clara',
            'last_name' => 'Barton',
            'specialization' => 'Ward Lead & OPD Intake Nurse',
            'license_number' => 'SLMC-NR-8819',
            'phone' => '+94 71 333 8899',
            'status' => 'on_duty',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 5. Patients
        $patient1Id = DB::table('patients')->insertGetId([
            'patient_code' => 'PAT-2026-001',
            'first_name' => 'Eleanor',
            'last_name' => 'Vance',
            'dob' => '1992-04-14',
            'gender' => 'Female',
            'nic_passport' => '199264501988',
            'phone' => '+94 70 555 1212',
            'blood_group' => 'O+',
            'allergies' => 'Penicillin, Sulfa drugs',
            'medical_history' => 'Hypertension (3 yrs), Mild asthma',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $patient2Id = DB::table('patients')->insertGetId([
            'patient_code' => 'PAT-2026-002',
            'first_name' => 'Marcus',
            'last_name' => 'Holloway',
            'dob' => '1981-11-22',
            'gender' => 'Male',
            'nic_passport' => '198132109844',
            'phone' => '+94 76 888 3434',
            'blood_group' => 'A+',
            'allergies' => 'None reported',
            'medical_history' => 'Post-op Knee Surgery',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 6. Medicine Categories & Suppliers
        $catAntibiotics = DB::table('medicine_categories')->insertGetId(['name' => 'Antibiotics', 'description' => 'Antimicrobial prescription medications', 'created_at' => now(), 'updated_at' => now()]);
        $catCardio = DB::table('medicine_categories')->insertGetId(['name' => 'Cardiovascular', 'description' => 'Blood pressure and heart medications', 'created_at' => now(), 'updated_at' => now()]);
        $catAnalgesic = DB::table('medicine_categories')->insertGetId(['name' => 'Analgesics', 'description' => 'Pain relief and antipyretics', 'created_at' => now(), 'updated_at' => now()]);

        $supplierId = DB::table('suppliers')->insertGetId([
            'company_name' => 'PharmaCare Lanka Distributors',
            'supplier_code' => 'SUP-LK-001',
            'contact_person' => 'Kamal Perera',
            'email' => 'sales@pharmacare.lk',
            'phone' => '+94 11 234 5678',
            'address' => '45 Colombo Road, Galle',
            'lead_time_days' => 5,
            'rating' => 4.85,
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 7. Medicines & Batches (FEFO simulation)
        $medAmox = DB::table('medicines')->insertGetId([
            'category_id' => $catAntibiotics,
            'barcode' => '8901234567890',
            'generic_name' => 'Amoxicillin Trihydrate',
            'brand_name' => 'Amoxil 500mg',
            'dosage_form' => 'Capsule',
            'unit' => 'capsules',
            'min_reorder_level' => 300,
            'max_stock_capacity' => 5000,
            'unit_price' => 24.50,
            'created_at' => now(), 'updated_at' => now()
        ]);

        $medAtorva = DB::table('medicines')->insertGetId([
            'category_id' => $catCardio,
            'barcode' => '8909876543210',
            'generic_name' => 'Atorvastatin Calcium',
            'brand_name' => 'Lipitor 20mg',
            'dosage_form' => 'Tablet',
            'unit' => 'tablets',
            'min_reorder_level' => 200,
            'max_stock_capacity' => 3000,
            'unit_price' => 45.00,
            'created_at' => now(), 'updated_at' => now()
        ]);

        // Batches with Expiry Dates (FEFO Risk Demo)
        $batchHighRisk = DB::table('medicine_batches')->insertGetId([
            'medicine_id' => $medAmox,
            'supplier_id' => $supplierId,
            'batch_number' => 'AMX-2025-EXP14D',
            'mfd_date' => '2024-09-01',
            'exp_date' => now()->addDays(14)->toDateString(), // Expires in 14 days!
            'initial_quantity' => 1000,
            'current_quantity' => 240,
            'unit_cost' => 18.00,
            'storage_location' => 'Rack B-14',
            'status' => 'low',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $batchSafe = DB::table('medicine_batches')->insertGetId([
            'medicine_id' => $medAtorva,
            'supplier_id' => $supplierId,
            'batch_number' => 'LIP-2026-OK',
            'mfd_date' => '2025-01-10',
            'exp_date' => now()->addMonths(14)->toDateString(),
            'initial_quantity' => 2000,
            'current_quantity' => 1850,
            'unit_cost' => 32.00,
            'storage_location' => 'Cold Shelf C-02',
            'status' => 'available',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 8. AI Insights & Triage Logs
        DB::table('ai_inventory_insights')->insert([
            'medicine_id' => $medAmox,
            'batch_id' => $batchHighRisk,
            'expiry_risk_score' => 92.50,
            'predicted_demand_30d' => 180,
            'recommended_reorder_qty' => 500,
            'confidence_score' => 96.40,
            'ai_recommendation' => 'CRITICAL FEFO ALERT: Batch AMX-2025-EXP14D has 240 units expiring in 14 days. Transfer 150 units to OPD clinic immediately for fast dispensing.',
            'generated_at' => now(),
            'created_at' => now(), 'updated_at' => now()
        ]);

        DB::table('ai_symptom_triage_logs')->insert([
            'patient_id' => $patient1Id,
            'input_symptoms' => 'Severe chest tightness, shortness of breath, blood pressure 150/95',
            'suggested_triage_level' => 'Emergency',
            'recommended_department' => 'Cardiology Unit',
            'ai_confidence_score' => 94.20,
            'suggested_medications' => json_encode(['Atorvastatin 20mg', 'Aspirin 75mg']),
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 9. Appointments & Prescriptions
        $aptId = DB::table('appointments')->insertGetId([
            'patient_id' => $patient1Id,
            'doctor_id' => $doctorStaffId,
            'appointment_date' => now()->addHours(2),
            'type' => 'Consultation',
            'priority' => 'High',
            'status' => 'In_Progress',
            'reason' => 'Hypertension follow-up & chest pain review',
            'created_at' => now(), 'updated_at' => now()
        ]);

        $prescrId = DB::table('prescriptions')->insertGetId([
            'prescription_code' => 'RX-2026-9901',
            'patient_id' => $patient1Id,
            'doctor_id' => $doctorStaffId,
            'appointment_id' => $aptId,
            'status' => 'ISSUED',
            'clinical_notes' => 'Take Atorvastatin daily at bedtime. Avoid high sodium foods.',
            'issued_at' => now(),
            'created_at' => now(), 'updated_at' => now()
        ]);

        DB::table('prescription_items')->insert([
            'prescription_id' => $prescrId,
            'medicine_id' => $medAtorva,
            'dosage' => '20mg',
            'frequency' => 'Once daily (HS)',
            'duration_days' => 30,
            'quantity_prescribed' => 30,
            'quantity_dispensed' => 0,
            'instructions' => 'Take 1 tablet at night after dinner',
            'created_at' => now(), 'updated_at' => now()
        ]);

        // 11. Cold Chain Temperature Sensor Logs
        DB::table('cold_chain_logs')->insert([
            'batch_id' => $batchSafe,
            'sensor_location' => 'Central Pharmacy Cold Room Unit 1 - Rack A',
            'recorded_temp_celsius' => 4.2,
            'min_threshold' => 2.0,
            'max_threshold' => 8.0,
            'status' => 'NORMAL',
            'notes' => 'Storage temperature optimal at 4.2°C',
            'created_at' => now()->subHours(3)
        ]);

        DB::table('cold_chain_logs')->insert([
            'batch_id' => $batchHighRisk,
            'sensor_location' => 'Central Pharmacy Vaccine Fridge 2',
            'recorded_temp_celsius' => 9.8,
            'min_threshold' => 2.0,
            'max_threshold' => 8.0,
            'status' => 'BREACH_HIGH',
            'notes' => 'CRITICAL TEMPERATURE BREACH: Recorded 9.8°C (Optimal: 2.0°C to 8.0°C). Compressor inspection required.',
            'created_at' => now()->subMinutes(25)
        ]);

        // 12. Stock Condemnation Decommissioning Ledger
        $cndCode = 'CND-2026-1088';
        $cndHash = hash('sha256', "MEDISYNC-CONDEMNATION-{$cndCode}-{$batchHighRisk}-240-" . now()->toIso8601String());

        DB::table('stock_condemnations')->insert([
            'condemnation_code' => $cndCode,
            'batch_id' => $batchHighRisk,
            'quantity_condemned' => 240,
            'reason' => 'EXPIRED',
            'disposal_method' => 'Incineration',
            'witnessed_by' => 'Chief Pharmacist & Compliance Auditor',
            'certificate_hash' => $cndHash,
            'condemned_by_user_id' => $adminUserId,
            'status' => 'CONDEMNED_DESTROYED',
            'notes' => 'Decommissioned expired batch AMX-2025-EXP14D. Formal destruction certificate issued.',
            'created_at' => now()->subHours(1),
            'updated_at' => now()->subHours(1)
        ]);

        // 13. Automated Purchase Orders (PO)
        DB::table('purchase_orders')->insert([
            'po_number' => 'PO-2026-8801',
            'supplier_id' => $supplierId,
            'medicine_id' => $medAmox,
            'requested_quantity' => 1000,
            'estimated_cost' => 45000.00,
            'supplier_email' => 'procurement@pharmanet.lk',
            'status' => 'SENT_TO_SUPPLIER',
            'triggered_by' => 'AUTOMATED_LOW_STOCK_THRESHOLD_ENGINE',
            'notes' => 'Auto-triggered purchase order for Amoxil 500mg as stock reached low-stock threshold (240 units). Dispatched to procurement@pharmanet.lk.',
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2)
        ]);

        // 14. Standardized ICD-10 & ICD-11 Clinical Diagnostic Codes
        DB::table('icd_codes')->insert([
            ['icd_version' => 'ICD-10', 'code' => 'I10', 'description' => 'Essential (primary) hypertension', 'category' => 'Circulatory System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'E11.9', 'description' => 'Type 2 diabetes mellitus without complications', 'category' => 'Endocrine & Metabolic', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'J45.909', 'description' => 'Unspecified asthma, uncomplicated', 'category' => 'Respiratory System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'I21.9', 'description' => 'Acute myocardial infarction, unspecified', 'category' => 'Circulatory System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'J18.9', 'description' => 'Pneumonia, unspecified organism', 'category' => 'Respiratory System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'K21.9', 'description' => 'Gastro-esophageal reflux disease without esophagitis', 'category' => 'Digestive System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'N39.0', 'description' => 'Urinary tract infection, site not specified', 'category' => 'Genitourinary System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-10', 'code' => 'M54.5', 'description' => 'Low back pain, unspecific', 'category' => 'Musculoskeletal System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-11', 'code' => 'BA00', 'description' => 'Essential hypertension (Primary hypertension)', 'category' => 'Diseases of Circulatory System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-11', 'code' => '5A11', 'description' => 'Type 2 diabetes mellitus', 'category' => 'Endocrine, Nutritional & Metabolic', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-11', 'code' => 'CA23', 'description' => 'Asthma (Unspecified clinical phenotypes)', 'category' => 'Diseases of Respiratory System', 'created_at' => now(), 'updated_at' => now()],
            ['icd_version' => 'ICD-11', 'code' => 'BA41', 'description' => 'Acute myocardial infarction', 'category' => 'Diseases of Circulatory System', 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 10. Audit Log
        DB::table('audit_logs')->insert([
            'user_id' => $adminUserId,
            'action' => 'SYSTEM_SEED',
            'entity_type' => 'DatabaseSeeder',
            'entity_id' => 1,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'MediSync Enterprise Seeder v1.0',
            'payload' => json_encode(['tables_seeded' => 22, 'status' => 'SUCCESS']),
            'created_at' => now()
        ]);
    }
}
