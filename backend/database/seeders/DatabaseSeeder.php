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

        // 5. Patients (10 Standardized EHR Patient Records)
        $patientsData = [
            [
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
                'emergency_contact_name' => 'Robert Vance (Spouse)',
                'emergency_contact_phone' => '+94 77 111 2233'
            ],
            [
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
                'emergency_contact_name' => 'Sarah Holloway (Sister)',
                'emergency_contact_phone' => '+94 71 999 4455'
            ],
            [
                'patient_code' => 'PAT-2026-003',
                'first_name' => 'Dr. Nimal',
                'last_name' => 'De Silva',
                'dob' => '1968-07-09',
                'gender' => 'Male',
                'nic_passport' => '196819102833',
                'phone' => '+94 77 345 6789',
                'blood_group' => 'B+',
                'allergies' => 'Aspirin, NSAIDs',
                'medical_history' => 'Type 2 Diabetes Mellitus, CAD',
                'emergency_contact_name' => 'Sunethra De Silva (Wife)',
                'emergency_contact_phone' => '+94 77 444 5566'
            ],
            [
                'patient_code' => 'PAT-2026-004',
                'first_name' => 'Kavindi',
                'last_name' => 'Wickramasinghe',
                'dob' => '1998-02-19',
                'gender' => 'Female',
                'nic_passport' => '199855104920',
                'phone' => '+94 71 234 8901',
                'blood_group' => 'AB+',
                'allergies' => 'Latex, Amoxicillin',
                'medical_history' => 'Allergic Rhinitis, Chronic Migraine',
                'emergency_contact_name' => 'Nimali Wickramasinghe (Mother)',
                'emergency_contact_phone' => '+94 70 888 7766'
            ],
            [
                'patient_code' => 'PAT-2026-005',
                'first_name' => 'Sanath',
                'last_name' => 'Jayawardena',
                'dob' => '1975-09-30',
                'gender' => 'Male',
                'nic_passport' => '197527301944',
                'phone' => '+94 75 999 1122',
                'blood_group' => 'O-',
                'allergies' => 'Ciprofloxacin',
                'medical_history' => 'Chronic Kidney Disease Stage 2, Gout',
                'emergency_contact_name' => 'Chamari Jayawardena (Wife)',
                'emergency_contact_phone' => '+94 76 222 3344'
            ],
            [
                'patient_code' => 'PAT-2026-006',
                'first_name' => 'Dilani',
                'last_name' => 'Perera',
                'dob' => '2001-12-05',
                'gender' => 'Female',
                'nic_passport' => '200184002931',
                'phone' => '+94 78 444 5566',
                'blood_group' => 'A-',
                'allergies' => 'Shellfish, Iodine Contrast',
                'medical_history' => 'Hypothyroidism, Iron Deficiency Anemia',
                'emergency_contact_name' => 'Kusal Perera (Brother)',
                'emergency_contact_phone' => '+94 72 333 4455'
            ],
            [
                'patient_code' => 'PAT-2026-007',
                'first_name' => 'Tariq',
                'last_name' => 'Ahamed',
                'dob' => '1989-05-18',
                'gender' => 'Male',
                'nic_passport' => '198913904812',
                'phone' => '+94 72 666 7788',
                'blood_group' => 'B-',
                'allergies' => 'Metronidazole',
                'medical_history' => 'GERD (Acid Reflux), Peptic Ulcer Disease',
                'emergency_contact_name' => 'Fatima Ahamed (Wife)',
                'emergency_contact_phone' => '+94 75 777 8899'
            ],
            [
                'patient_code' => 'PAT-2026-008',
                'first_name' => 'Samantha',
                'last_name' => 'Ratnayake',
                'dob' => '1963-03-25',
                'gender' => 'Female',
                'nic_passport' => '196358401923',
                'phone' => '+94 77 888 9900',
                'blood_group' => 'AB-',
                'allergies' => 'Codeine, Tramadol',
                'medical_history' => 'Osteoarthritis, Osteoporosis',
                'emergency_contact_name' => 'Anura Ratnayake (Son)',
                'emergency_contact_phone' => '+94 77 666 5544'
            ],
            [
                'patient_code' => 'PAT-2026-009',
                'first_name' => 'Dhanushka',
                'last_name' => 'Mendis',
                'dob' => '1994-08-11',
                'gender' => 'Male',
                'nic_passport' => '199422305819',
                'phone' => '+94 76 123 7890',
                'blood_group' => 'O+',
                'allergies' => 'Cephalexin',
                'medical_history' => 'Bronchial Asthma, Atopic Dermatitis',
                'emergency_contact_name' => 'Kasun Mendis (Brother)',
                'emergency_contact_phone' => '+94 71 555 6677'
            ],
            [
                'patient_code' => 'PAT-2026-010',
                'first_name' => 'Ayesha Rashmi',
                'last_name' => 'Cooray',
                'dob' => '2003-06-30',
                'gender' => 'Female',
                'nic_passport' => '200368102945',
                'phone' => '+94 70 333 4455',
                'blood_group' => 'A+',
                'allergies' => 'Peanuts, Erythromycin',
                'medical_history' => 'PCOS, Dysmenorrhea',
                'emergency_contact_name' => 'Kamal Cooray (Father)',
                'emergency_contact_phone' => '+94 70 222 3344'
            ]
        ];

        $patientIds = [];
        foreach ($patientsData as $p) {
            $patientIds[] = DB::table('patients')->insertGetId(array_merge($p, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        $patient1Id = $patientIds[0];
        $patient2Id = $patientIds[1];

        // 6. Medicine Categories (20 Standardized Categories)
        $categoriesData = [
            ['name' => 'Antibiotics & Antimicrobials', 'description' => 'Antimicrobial prescription medications & broad-spectrum agents'],
            ['name' => 'Cardiovascular & Antihypertensives', 'description' => 'Blood pressure, lipid-lowering, and cardiac management drugs'],
            ['name' => 'Analgesics & Anti-inflammatories', 'description' => 'Pain management, NSAIDs, and antipyretics'],
            ['name' => 'Respiratory & Bronchodilators', 'description' => 'Asthma inhalers, antihistamines, and COPD treatments'],
            ['name' => 'Gastrointestinal & Antacids', 'description' => 'Proton pump inhibitors, antiulcer agents, and digestive care'],
            ['name' => 'Endocrine & Antidiabetics', 'description' => 'Insulin, oral hypoglycemic agents, and thyroid hormone therapy'],
            ['name' => 'Central Nervous System (CNS)', 'description' => 'Anticonvulsants, sedatives, antidepressants, and neurotherapeutics'],
            ['name' => 'Dermatological & Topical Agents', 'description' => 'Medicated ointments, anti-fungals, and wound healing care'],
            ['name' => 'Ophthalmic & Otic Preparations', 'description' => 'Sterile eye drops, ear drops, and ocular anti-infectives'],
            ['name' => 'Oncology & Immunosuppressants', 'description' => 'Chemotherapeutic agents and targeted immunosuppressive biologicals'],
            ['name' => 'Vaccines & Cold-Chain Biologics', 'description' => 'Cold-chain vaccines, immunoglobulins, and biological serums'],
            ['name' => 'Nutritional & Vitamin Supplements', 'description' => 'Multivitamins, mineral supplements, and hematinics'],
            ['name' => 'Anticoagulants & Hemostatics', 'description' => 'Blood thinners, antiplatelet agents, and coagulation factors'],
            ['name' => 'Obstetrics & Gynecological Care', 'description' => 'Maternal care, hormonal therapies, and contraceptives'],
            ['name' => 'Urological & Renal Care', 'description' => 'Diuretics, BPH treatments, and urinary tract antiseptics'],
            ['name' => 'Anesthetics & Surgical Blockers', 'description' => 'Local and general anesthetics for surgical procedures'],
            ['name' => 'Antiviral & Antiretroviral Therapies', 'description' => 'Antiviral agents, HIV therapies, and systemic infection management'],
            ['name' => 'Psychiatric & Anti-anxiety Agents', 'description' => 'Anxiolytics, mood stabilizers, and antipsychotic therapeutics'],
            ['name' => 'ENT & Allergy Medications', 'description' => 'Nasal decongestants, antihistamine sprays, and otolaryngology care'],
            ['name' => 'Pediatric & Neonatal Formulations', 'description' => 'Child-friendly liquid suspensions, drops, and pediatric care']
        ];

        $categoryIds = [];
        foreach ($categoriesData as $c) {
            $categoryIds[] = DB::table('medicine_categories')->insertGetId([
                'name' => $c['name'],
                'description' => $c['description'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 6. Suppliers (10 Standardized Pharmaceutical Suppliers)
        $suppliersData = [
            [
                'supplier_code' => 'SUP-LK-001',
                'company_name' => 'PharmaCare Lanka Distributors',
                'contact_person' => 'Kamal Perera',
                'email' => 'sales@pharmacare.lk',
                'phone' => '+94 11 234 5678',
                'address' => '45 Colombo Road, Galle',
                'lead_time_days' => 3,
                'rating' => 4.90
            ],
            [
                'supplier_code' => 'SUP-LK-002',
                'company_name' => 'BioMed Global Healthcare Ltd',
                'contact_person' => 'Dr. Anusha Silva',
                'email' => 'orders@biomedglobal.com',
                'phone' => '+94 11 456 7890',
                'address' => '120 Kandy Road, Kiribathgoda, Colombo',
                'lead_time_days' => 4,
                'rating' => 4.80
            ],
            [
                'supplier_code' => 'SUP-LK-003',
                'company_name' => 'Apex Cold-Chain Logistics & Vaccines',
                'contact_person' => 'Rohan Jayasinghe',
                'email' => 'procurement@apexcoldchain.lk',
                'phone' => '+94 11 789 0123',
                'address' => '88 Port Access Highway, Kelaniya',
                'lead_time_days' => 2,
                'rating' => 4.95
            ],
            [
                'supplier_code' => 'SUP-LK-004',
                'company_name' => 'Lanka Surgimed Supplies Corp',
                'contact_person' => 'Nimali Fernando',
                'email' => 'support@surgimed.lk',
                'phone' => '+94 11 345 6789',
                'address' => '15 Bauddhaloka Mawatha, Colombo 07',
                'lead_time_days' => 5,
                'rating' => 4.70
            ],
            [
                'supplier_code' => 'SUP-LK-005',
                'company_name' => 'MediTech Asia-Pacific Pharmaceuticals',
                'contact_person' => 'David Chen',
                'email' => 'contact@meditech-asia.sg',
                'phone' => '+94 11 890 1234',
                'address' => '300 Galle Road, Kollupitiya, Colombo 03',
                'lead_time_days' => 7,
                'rating' => 4.85
            ],
            [
                'supplier_code' => 'SUP-LK-006',
                'company_name' => 'Ceylon Biologicals & Chemist Co',
                'contact_person' => 'Saman Wickramasinghe',
                'email' => 'info@ceylonbio.lk',
                'phone' => '+94 81 223 4567',
                'address' => '54 Peradeniya Road, Kandy',
                'lead_time_days' => 3,
                'rating' => 4.60
            ],
            [
                'supplier_code' => 'SUP-LK-007',
                'company_name' => 'Sunlight Pharma Distributors Ltd',
                'contact_person' => 'Priyanka De Silva',
                'email' => 'sales@sunlightpharma.lk',
                'phone' => '+94 91 224 5678',
                'address' => '12 Matara Road, Galle',
                'lead_time_days' => 4,
                'rating' => 4.75
            ],
            [
                'supplier_code' => 'SUP-LK-008',
                'company_name' => 'Novartis-Lanka Authorized Depot',
                'contact_person' => 'Dinesh Gunawardena',
                'email' => 'depot@novartis-lanka.com',
                'phone' => '+94 11 567 8901',
                'address' => '77 Union Place, Slave Island, Colombo 02',
                'lead_time_days' => 3,
                'rating' => 4.90
            ],
            [
                'supplier_code' => 'SUP-LK-009',
                'company_name' => 'Horizon Lifesciences & Oncology Supply',
                'contact_person' => 'Dr. K. Rajaratnam',
                'email' => 'oncology@horizonlife.lk',
                'phone' => '+94 21 222 3456',
                'address' => '42 Hospital Road, Jaffna',
                'lead_time_days' => 6,
                'rating' => 4.80
            ],
            [
                'supplier_code' => 'SUP-LK-010',
                'company_name' => 'Zenith Diagnostic & Formula Care',
                'contact_person' => 'Dilrukshi Cooray',
                'email' => 'orders@zenithformulacare.lk',
                'phone' => '+94 31 223 8901',
                'address' => '99 Negombo Road, Kurunegala',
                'lead_time_days' => 3,
                'rating' => 4.70
            ]
        ];

        $supplierIds = [];
        foreach ($suppliersData as $s) {
            $supplierIds[] = DB::table('suppliers')->insertGetId(array_merge($s, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }
        $supplierId = $supplierIds[0];

        // 7. Medicines & Batches (200 Medicines: 20 Categories x 10 Items Each)
        $drugsByCat = [
            0 => [
                ['brand' => 'Amoxil 500mg', 'generic' => 'Amoxicillin Trihydrate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 24.50],
                ['brand' => 'Augmentin 625mg', 'generic' => 'Amoxicillin + Clavulanic Acid', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 85.00],
                ['brand' => 'Zithromax 500mg', 'generic' => 'Azithromycin Monohydrate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 120.00],
                ['brand' => 'Ciproxl 500mg', 'generic' => 'Ciprofloxacin Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 45.00],
                ['brand' => 'Rocephin 1g', 'generic' => 'Ceftriaxone Sodium', 'form' => 'Injection', 'unit' => 'vials', 'price' => 450.00],
                ['brand' => 'Flagyl 400mg', 'generic' => 'Metronidazole', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 18.00],
                ['brand' => 'Doryx 100mg', 'generic' => 'Doxycycline Hyclate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 32.00],
                ['brand' => 'Keflex 500mg', 'generic' => 'Cephalexin Monohydrate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 38.00],
                ['brand' => 'Bactrim DS', 'generic' => 'Sulfamethoxazole + Trimethoprim', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 22.00],
                ['brand' => 'Vancocin 500mg', 'generic' => 'Vancomycin Hydrochloride', 'form' => 'Injection', 'unit' => 'vials', 'price' => 1250.00]
            ],
            1 => [
                ['brand' => 'Lipitor 20mg', 'generic' => 'Atorvastatin Calcium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 45.00],
                ['brand' => 'Norvasc 5mg', 'generic' => 'Amlodipine Besylate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 15.00],
                ['brand' => 'Zestril 10mg', 'generic' => 'Lisinopril Dihydrate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Cozaar 50mg', 'generic' => 'Losartan Potassium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 34.00],
                ['brand' => 'Tenormin 50mg', 'generic' => 'Atenolol', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 12.50],
                ['brand' => 'Coreg 6.25mg', 'generic' => 'Carvedilol Phosphate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 42.00],
                ['brand' => 'Crestor 10mg', 'generic' => 'Rosuvastatin Calcium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 95.00],
                ['brand' => 'Lasix 40mg', 'generic' => 'Furosemide', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 10.00],
                ['brand' => 'Diovan 80mg', 'generic' => 'Valsartan', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 68.00],
                ['brand' => 'Cardizem 60mg', 'generic' => 'Diltiazem Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 29.00]
            ],
            2 => [
                ['brand' => 'Panadol 500mg', 'generic' => 'Paracetamol (Acetaminophen)', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 5.00],
                ['brand' => 'Nurofen 400mg', 'generic' => 'Ibuprofen', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 14.00],
                ['brand' => 'Voltaren 50mg', 'generic' => 'Diclofenac Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 25.00],
                ['brand' => 'Celebrex 200mg', 'generic' => 'Celecoxib', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 110.00],
                ['brand' => 'Tramal 50mg', 'generic' => 'Tramadol Hydrochloride', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 45.00],
                ['brand' => 'Arcoxia 90mg', 'generic' => 'Etoricoxib', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 140.00],
                ['brand' => 'Ponstan 500mg', 'generic' => 'Mefenamic Acid', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 20.00],
                ['brand' => 'Feldene 20mg', 'generic' => 'Piroxicam', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 30.00],
                ['brand' => 'Aleve 220mg', 'generic' => 'Naproxen Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Cataflam 50mg', 'generic' => 'Diclofenac Potassium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 32.00]
            ],
            3 => [
                ['brand' => 'Ventolin Evohaler 100mcg', 'generic' => 'Salbutamol Sulfate', 'form' => 'Inhaler', 'unit' => 'devices', 'price' => 650.00],
                ['brand' => 'Seretide Accuhaler 250', 'generic' => 'Fluticasone + Salmeterol', 'form' => 'Inhaler', 'unit' => 'devices', 'price' => 2400.00],
                ['brand' => 'Singulair 10mg', 'generic' => 'Montelukast Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 95.00],
                ['brand' => 'Spiriva HandiHaler 18mcg', 'generic' => 'Tiotropium Bromide', 'form' => 'Inhaler', 'unit' => 'devices', 'price' => 3100.00],
                ['brand' => 'Telfast 120mg', 'generic' => 'Fexofenadine Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 48.00],
                ['brand' => 'Zyrtec 10mg', 'generic' => 'Cetirizine Dihydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 18.00],
                ['brand' => 'Claritin 10mg', 'generic' => 'Loratadine', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 22.00],
                ['brand' => 'Symbicort 160/4.5', 'generic' => 'Budesonide + Formoterol', 'form' => 'Inhaler', 'unit' => 'devices', 'price' => 2850.00],
                ['brand' => 'Pulmicort 0.5mg/2ml', 'generic' => 'Budesonide Suspension', 'form' => 'Ampoule', 'unit' => 'ampoules', 'price' => 150.00],
                ['brand' => 'Mucosolvan 30mg/5ml', 'generic' => 'Ambroxol Hydrochloride', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 320.00]
            ],
            4 => [
                ['brand' => 'Losec 20mg', 'generic' => 'Omeprazole Magnesium', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 26.00],
                ['brand' => 'Nexium 40mg', 'generic' => 'Esomeprazole Magnesium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 88.00],
                ['brand' => 'Zantac 150mg', 'generic' => 'Ranitidine Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 15.00],
                ['brand' => 'Gaviscon Double Action', 'generic' => 'Sodium Alginate + Antacids', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 780.00],
                ['brand' => 'Motilium 10mg', 'generic' => 'Domperidone', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 14.00],
                ['brand' => 'Buscopan 10mg', 'generic' => 'Hyoscine Butylbromide', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 18.00],
                ['brand' => 'Dulcolax 5mg', 'generic' => 'Bisacodyl', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 8.50],
                ['brand' => 'Imodium 2mg', 'generic' => 'Loperamide Hydrochloride', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 22.00],
                ['brand' => 'Creon 10000', 'generic' => 'Pancreatin Enzymes', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 145.00],
                ['brand' => 'Pantocid 40mg', 'generic' => 'Pantoprazole Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 35.00]
            ],
            5 => [
                ['brand' => 'Glucophage 850mg', 'generic' => 'Metformin Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 16.00],
                ['brand' => 'Lantus SoloStar 100IU', 'generic' => 'Insulin Glargine', 'form' => 'Pen', 'unit' => 'pens', 'price' => 1850.00],
                ['brand' => 'Novorapid FlexPen 100IU', 'generic' => 'Insulin Aspart', 'form' => 'Pen', 'unit' => 'pens', 'price' => 1950.00],
                ['brand' => 'Januvia 100mg', 'generic' => 'Sitagliptin Phosphate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 125.00],
                ['brand' => 'Amaryl 2mg', 'generic' => 'Glimepiride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Eltroxin 50mcg', 'generic' => 'Levothyroxine Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 12.00],
                ['brand' => 'Jardiance 10mg', 'generic' => 'Empagliflozin', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 165.00],
                ['brand' => 'Forxiga 10mg', 'generic' => 'Dapagliflozin Propanediol', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 155.00],
                ['brand' => 'Diamicron MR 60mg', 'generic' => 'Gliclazide', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 42.00],
                ['brand' => 'Actos 15mg', 'generic' => 'Pioglitazone Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 38.00]
            ],
            6 => [
                ['brand' => 'Epilim Chrono 500mg', 'generic' => 'Sodium Valproate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 52.00],
                ['brand' => 'Tegretol CR 200mg', 'generic' => 'Carbamazepine', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 35.00],
                ['brand' => 'Lyrica 75mg', 'generic' => 'Pregabalin', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 98.00],
                ['brand' => 'Neurontin 300mg', 'generic' => 'Gabapentin', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 64.00],
                ['brand' => 'Sinemet 250/25', 'generic' => 'Levodopa + Carbidopa', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 88.00],
                ['brand' => 'Topamax 50mg', 'generic' => 'Topiramate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 75.00],
                ['brand' => 'Keppra 500mg', 'generic' => 'Levetiracetam', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 130.00],
                ['brand' => 'Seroquel 100mg', 'generic' => 'Quetiapine Fumarate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 115.00],
                ['brand' => 'Zyprexa 5mg', 'generic' => 'Olanzapine', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 140.00],
                ['brand' => 'Aricept 5mg', 'generic' => 'Donepezil Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 185.00]
            ],
            7 => [
                ['brand' => 'Betnovate-N Cream 15g', 'generic' => 'Betamethasone + Neomycin', 'form' => 'Cream', 'unit' => 'tubes', 'price' => 240.00],
                ['brand' => 'Fucidin 2% Ointment 15g', 'generic' => 'Fusidic Acid', 'form' => 'Ointment', 'unit' => 'tubes', 'price' => 380.00],
                ['brand' => 'Daktarin Cream 20g', 'generic' => 'Miconazole Nitrate', 'form' => 'Cream', 'unit' => 'tubes', 'price' => 310.00],
                ['brand' => 'Dermovate 0.05% 25g', 'generic' => 'Clobetasol Propionate', 'form' => 'Ointment', 'unit' => 'tubes', 'price' => 450.00],
                ['brand' => 'Bactroban 2% 15g', 'generic' => 'Mupirocin', 'form' => 'Ointment', 'unit' => 'tubes', 'price' => 520.00],
                ['brand' => 'Canesten Cream 20g', 'generic' => 'Clotrimazole', 'form' => 'Cream', 'unit' => 'tubes', 'price' => 280.00],
                ['brand' => 'Elidel 1% Cream 15g', 'generic' => 'Pimecrolimus', 'form' => 'Cream', 'unit' => 'tubes', 'price' => 1850.00],
                ['brand' => 'Kenacort-A Ointment 5g', 'generic' => 'Triamcinolone Acetonide', 'form' => 'Ointment', 'unit' => 'tubes', 'price' => 190.00],
                ['brand' => 'Sudocrem Antiseptic 125g', 'generic' => 'Zinc Oxide + Lanolin', 'form' => 'Ointment', 'unit' => 'jars', 'price' => 950.00],
                ['brand' => 'Daivonex Ointment 30g', 'generic' => 'Calcipotriol Monohydrate', 'form' => 'Ointment', 'unit' => 'tubes', 'price' => 1650.00]
            ],
            8 => [
                ['brand' => 'Xalatan 0.005% 2.5ml', 'generic' => 'Latanoprost', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 1450.00],
                ['brand' => 'Tobradex Eye Drops 5ml', 'generic' => 'Tobramycin + Dexamethasone', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 580.00],
                ['brand' => 'Vigamox 0.5% 5ml', 'generic' => 'Moxifloxacin Hydrochloride', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 720.00],
                ['brand' => 'Systane Ultra 10ml', 'generic' => 'Polyethylene Glycol Lubricant', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 890.00],
                ['brand' => 'Cosopt Eye Drops 5ml', 'generic' => 'Dorzolamide + Timolol', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 1250.00],
                ['brand' => 'Patanol 0.1% 5ml', 'generic' => 'Olopatadine Hydrochloride', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 640.00],
                ['brand' => 'Otrivin 0.1% 10ml', 'generic' => 'Xylometazoline Hydrochloride', 'form' => 'Nasal Drop', 'unit' => 'bottles', 'price' => 180.00],
                ['brand' => 'Sofradex Ear Drops 8ml', 'generic' => 'Framycetin + Dexamethasone', 'form' => 'Ear Drop', 'unit' => 'bottles', 'price' => 410.00],
                ['brand' => 'Ciplox 0.3% 10ml', 'generic' => 'Ciprofloxacin Eye/Ear Drop', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 120.00],
                ['brand' => 'Refresh Tears 10ml', 'generic' => 'Carboxymethylcellulose Sodium', 'form' => 'Eye Drop', 'unit' => 'bottles', 'price' => 520.00]
            ],
            9 => [
                ['brand' => 'Tamofen 20mg', 'generic' => 'Tamoxifen Citrate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 65.00],
                ['brand' => 'Methotrexate 2.5mg', 'generic' => 'Methotrexate Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Neoral 50mg', 'generic' => 'Cyclosporine Microemulsion', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 380.00],
                ['brand' => 'Cellcept 500mg', 'generic' => 'Mycophenolate Mofetil', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 290.00],
                ['brand' => 'Imuran 50mg', 'generic' => 'Azathioprine', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 85.00],
                ['brand' => 'Femara 2.5mg', 'generic' => 'Letrozole', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 240.00],
                ['brand' => 'Casodex 50mg', 'generic' => 'Bicalutamide', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 310.00],
                ['brand' => 'Tarceva 100mg', 'generic' => 'Erlotinib Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 2800.00],
                ['brand' => 'Gleevec 100mg', 'generic' => 'Imatinib Mesylate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 1950.00],
                ['brand' => 'Prograf 1mg', 'generic' => 'Tacrolimus Hydrate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 450.00]
            ],
            10 => [
                ['brand' => 'Engerix-B 20mcg/ml', 'generic' => 'Hepatitis B Vaccine Recombinant', 'form' => 'Injection', 'unit' => 'vials', 'price' => 1250.00],
                ['brand' => 'MMR II Vaccine', 'generic' => 'Measles, Mumps & Rubella Virus', 'form' => 'Injection', 'unit' => 'vials', 'price' => 1850.00],
                ['brand' => 'Verorab Rabies 0.5ml', 'generic' => 'Rabies Vaccine Inactivated', 'form' => 'Injection', 'unit' => 'vials', 'price' => 2100.00],
                ['brand' => 'Vaxigrip Tetra 0.5ml', 'generic' => 'Influenza Quadrivalent Vaccine', 'form' => 'Injection', 'unit' => 'syringes', 'price' => 1950.00],
                ['brand' => 'Gardasil 9', 'generic' => 'Human Papillomavirus 9-Valent', 'form' => 'Injection', 'unit' => 'vials', 'price' => 8500.00],
                ['brand' => 'Prevenar 13', 'generic' => 'Pneumococcal 13-Valent Conjugate', 'form' => 'Injection', 'unit' => 'syringes', 'price' => 6400.00],
                ['brand' => 'BCG Vaccine 0.1ml', 'generic' => 'Bacillus Calmette-Guerin Live', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 450.00],
                ['brand' => 'Infanrix Hexa 0.5ml', 'generic' => 'DTaP-IPV-HepB-Hib Combined', 'form' => 'Injection', 'unit' => 'syringes', 'price' => 5200.00],
                ['brand' => 'Rotarix Oral 1.5ml', 'generic' => 'Rotavirus Live Attenuated Oral', 'form' => 'Oral Suspension', 'unit' => 'tubes', 'price' => 3100.00],
                ['brand' => 'Humira 40mg/0.4ml', 'generic' => 'Adalimumab Subcutaneous', 'form' => 'Pen', 'unit' => 'pens', 'price' => 24500.00]
            ],
            11 => [
                ['brand' => 'Neurobion Forte', 'generic' => 'Vitamin B1 + B6 + B12', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 12.00],
                ['brand' => 'Caltrate 600+D3', 'generic' => 'Calcium Carbonate + Cholecalciferol', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Sangobion Iron Capsules', 'generic' => 'Ferrous Gluconate + Folic Acid', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 22.00],
                ['brand' => 'Redoxon 1000mg Orange', 'generic' => 'Ascorbic Acid (Vitamin C)', 'form' => 'Effervescent', 'unit' => 'tablets', 'price' => 45.00],
                ['brand' => 'Revidox 100mg', 'generic' => 'Coenzyme Q10 + Antioxidants', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 110.00],
                ['brand' => 'Osteocare Original', 'generic' => 'Calcium + Magnesium + Zinc + Vit D3', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 38.00],
                ['brand' => 'Iberet Folic 500', 'generic' => 'Iron + Vitamin C + B-Complex', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 42.00],
                ['brand' => 'Evion 400', 'generic' => 'Tocopheryl Acetate (Vitamin E)', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 16.00],
                ['brand' => 'Seven Seas Cod Liver Oil', 'generic' => 'Omega-3 + Vitamin A & D', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 30.00],
                ['brand' => 'Becosules Z', 'generic' => 'B-Complex + Zinc Sulphate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 14.00]
            ],
            12 => [
                ['brand' => 'Marevan 5mg', 'generic' => 'Warfarin Sodium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 18.00],
                ['brand' => 'Clexane 40mg/0.4ml', 'generic' => 'Enoxaparin Sodium', 'form' => 'Injection', 'unit' => 'syringes', 'price' => 980.00],
                ['brand' => 'Xarelto 15mg', 'generic' => 'Rivaroxaban Micronized', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 260.00],
                ['brand' => 'Eliquis 5mg', 'generic' => 'Apixaban', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 240.00],
                ['brand' => 'Plavix 75mg', 'generic' => 'Clopidogrel Bisulfate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 55.00],
                ['brand' => 'Tranexa 500mg', 'generic' => 'Tranexamic Acid', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 32.00],
                ['brand' => 'Pradaxa 110mg', 'generic' => 'Dabigatran Etexilate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 210.00],
                ['brand' => 'Brilinta 90mg', 'generic' => 'Ticagrelor', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 195.00],
                ['brand' => 'Heparin 5000IU/ml 5ml', 'generic' => 'Heparin Sodium IV', 'form' => 'Injection', 'unit' => 'vials', 'price' => 420.00],
                ['brand' => 'Vitamin K1 10mg/ml', 'generic' => 'Phytomenadione Solution', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 85.00]
            ],
            13 => [
                ['brand' => 'Duphaston 10mg', 'generic' => 'Dydrogesterone', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 110.00],
                ['brand' => 'Yasmin 0.03/3mg', 'generic' => 'Ethinylestradiol + Drospirenone', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 1450.00],
                ['brand' => 'Clomid 50mg', 'generic' => 'Clomifene Citrate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 68.00],
                ['brand' => 'Cyclogest 400mg', 'generic' => 'Progesterone Pessary', 'form' => 'Pessary', 'unit' => 'pessaries', 'price' => 185.00],
                ['brand' => 'Primolut N 5mg', 'generic' => 'Norethisterone', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 24.00],
                ['brand' => 'Microgynon 30', 'generic' => 'Levonorgestrel + Ethinylestradiol', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 350.00],
                ['brand' => 'Vagifem 10mcg', 'generic' => 'Estradiol Vaginal Tablet', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 450.00],
                ['brand' => 'Canesten 500mg Pessary', 'generic' => 'Clotrimazole Vaginal', 'form' => 'Pessary', 'unit' => 'pessaries', 'price' => 520.00],
                ['brand' => 'Postinor-2 0.75mg', 'generic' => 'Levonorgestrel Emergency', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 280.00],
                ['brand' => 'Cytotec 200mcg', 'generic' => 'Misoprostol', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 95.00]
            ],
            14 => [
                ['brand' => 'Harnal D 0.2mg', 'generic' => 'Tamsulosin Hydrochloride', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 58.00],
                ['brand' => 'Avodart 0.5mg', 'generic' => 'Dutasteride Softgel', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 145.00],
                ['brand' => 'Proscar 5mg', 'generic' => 'Finasteride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 88.00],
                ['brand' => 'Renalux Phosphate Binder', 'generic' => 'Calcium Acetate 667mg', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 32.00],
                ['brand' => 'Urispas 200mg', 'generic' => 'Flavoxate Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 42.00],
                ['brand' => 'Betmiga 50mg', 'generic' => 'Mirabegron Extended Release', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 210.00],
                ['brand' => 'Vesicare 5mg', 'generic' => 'Solifenacin Succinate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 165.00],
                ['brand' => 'Cialis 5mg Daily', 'generic' => 'Tadalafil', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 340.00],
                ['brand' => 'Nephrosteril 500ml', 'generic' => 'Essential Renal Amino Acids', 'form' => 'Infusion', 'unit' => 'bottles', 'price' => 1450.00],
                ['brand' => 'Urocit-K 10mEq', 'generic' => 'Potassium Citrate ER', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 45.00]
            ],
            15 => [
                ['brand' => 'Xylocaine 2% 20ml', 'generic' => 'Lidocaine Hydrochloride', 'form' => 'Injection', 'unit' => 'vials', 'price' => 120.00],
                ['brand' => 'Propofol 1% 20ml', 'generic' => 'Propofol Injectable Emulsion', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 480.00],
                ['brand' => 'Marcaine 0.5% Heavy 4ml', 'generic' => 'Bupivacaine Hydrochloride', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 250.00],
                ['brand' => 'Esmeron 50mg/5ml', 'generic' => 'Rocuronium Bromide', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 620.00],
                ['brand' => 'Ketalar 50mg/ml 10ml', 'generic' => 'Ketamine Hydrochloride', 'form' => 'Injection', 'unit' => 'vials', 'price' => 380.00],
                ['brand' => 'Midazolam 5mg/5ml', 'generic' => 'Midazolam Hydrochloride', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 140.00],
                ['brand' => 'Sevoflurane Liquid 250ml', 'generic' => 'Sevoflurane Inhalation', 'form' => 'Liquid', 'unit' => 'bottles', 'price' => 8900.00],
                ['brand' => 'Neostigmine 0.5mg/ml', 'generic' => 'Neostigmine Methylsulfate', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 65.00],
                ['brand' => 'Anectine 50mg/ml 2ml', 'generic' => 'Succinylcholine Chloride', 'form' => 'Injection', 'unit' => 'vials', 'price' => 180.00],
                ['brand' => 'Nimbex 2mg/ml 5ml', 'generic' => 'Cisatracurium Besylate', 'form' => 'Injection', 'unit' => 'ampoules', 'price' => 740.00]
            ],
            16 => [
                ['brand' => 'Zovirax 400mg', 'generic' => 'Acyclovir', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 38.00],
                ['brand' => 'Tamiflu 75mg', 'generic' => 'Oseltamivir Phosphate', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 450.00],
                ['brand' => 'Valtrex 500mg', 'generic' => 'Valacyclovir Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 280.00],
                ['brand' => 'Baraclude 0.5mg', 'generic' => 'Entecavir Monohydrate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 340.00],
                ['brand' => 'Viread 300mg', 'generic' => 'Tenofovir Disoproxil Fumarate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 290.00],
                ['brand' => 'Epivir 150mg', 'generic' => 'Lamivudine', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 85.00],
                ['brand' => 'Isentress 400mg', 'generic' => 'Raltegravir Potassium', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 1200.00],
                ['brand' => 'Biktarvy Triple Therapy', 'generic' => 'Bictegravir + Emtricitabine + Tenofovir', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 3500.00],
                ['brand' => 'Sovaldi 400mg', 'generic' => 'Sofosbuvir', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 4200.00],
                ['brand' => 'Paxlovid Co-Pack', 'generic' => 'Nirmatrelvir + Ritonavir', 'form' => 'Tablet Pack', 'unit' => 'packs', 'price' => 4800.00]
            ],
            17 => [
                ['brand' => 'Xanax 0.5mg', 'generic' => 'Alprazolam', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 22.00],
                ['brand' => 'Valium 5mg', 'generic' => 'Diazepam', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 12.00],
                ['brand' => 'Ativan 1mg', 'generic' => 'Lorazepam', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 18.00],
                ['brand' => 'Lexapro 10mg', 'generic' => 'Escitalopram Oxalate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 65.00],
                ['brand' => 'Zoloft 50mg', 'generic' => 'Sertraline Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 58.00],
                ['brand' => 'Prozac 20mg', 'generic' => 'Fluoxetine Hydrochloride', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 42.00],
                ['brand' => 'Rivotril 2mg', 'generic' => 'Clonazepam', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Effexor XR 75mg', 'generic' => 'Venlafaxine Hydrochloride', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 95.00],
                ['brand' => 'Cymbalta 30mg', 'generic' => 'Duloxetine Hydrochloride', 'form' => 'Capsule', 'unit' => 'capsules', 'price' => 110.00],
                ['brand' => 'Risperdal 2mg', 'generic' => 'Risperidone', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 82.00]
            ],
            18 => [
                ['brand' => 'Nasonex 50mcg Spray', 'generic' => 'Mometasone Furoate Nasal', 'form' => 'Spray', 'unit' => 'bottles', 'price' => 850.00],
                ['brand' => 'Flixonase 50mcg Spray', 'generic' => 'Fluticasone Propionate Nasal', 'form' => 'Spray', 'unit' => 'bottles', 'price' => 780.00],
                ['brand' => 'Otrivin Adult Spray 10ml', 'generic' => 'Xylometazoline Nasal Spray', 'form' => 'Spray', 'unit' => 'bottles', 'price' => 220.00],
                ['brand' => 'Dymista Nasal Spray', 'generic' => 'Azelastine + Fluticasone', 'form' => 'Spray', 'unit' => 'bottles', 'price' => 1450.00],
                ['brand' => 'Sinupret Forte Tablets', 'generic' => 'Gentian + Primula Herbal Extract', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 45.00],
                ['brand' => 'Sudafed 60mg', 'generic' => 'Pseudoephedrine Hydrochloride', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 28.00],
                ['brand' => 'Chlor-Trimeton 4mg', 'generic' => 'Chlorpheniramine Maleate', 'form' => 'Tablet', 'unit' => 'tablets', 'price' => 6.00],
                ['brand' => 'Actifed Expectorant 100ml', 'generic' => 'Triprolidine + Pseudoephedrine', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 380.00],
                ['brand' => 'Locacorten-Vioform Drops', 'generic' => 'Flumethasone + Clioquinol Ear', 'form' => 'Ear Drop', 'unit' => 'bottles', 'price' => 490.00],
                ['brand' => 'Beconase 50mcg Nasal', 'generic' => 'Beclomethasone Dipropionate', 'form' => 'Spray', 'unit' => 'bottles', 'price' => 620.00]
            ],
            19 => [
                ['brand' => 'Calpol Infant Syrup 100ml', 'generic' => 'Paracetamol 120mg/5ml', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 280.00],
                ['brand' => 'Pedialyte Electrolyte 500ml', 'generic' => 'Oral Rehydration Salts Liquid', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 350.00],
                ['brand' => 'Bonnisan Drops 30ml', 'generic' => 'Herbal Pediatric Digestive Drops', 'form' => 'Drops', 'unit' => 'bottles', 'price' => 240.00],
                ['brand' => 'Amoxil Oral Powder 100ml', 'generic' => 'Amoxicillin Suspension 125mg/5ml', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 320.00],
                ['brand' => 'Ventolin Pediatric Syrup 100ml', 'generic' => 'Salbutamol Syrup 2mg/5ml', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 260.00],
                ['brand' => 'Zyrtec Kids Drops 15ml', 'generic' => 'Cetirizine Drops 10mg/ml', 'form' => 'Drops', 'unit' => 'bottles', 'price' => 410.00],
                ['brand' => 'Augmentin Duo Suspension 70ml', 'generic' => 'Amoxicillin + Clavulanate 228mg/5ml', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 680.00],
                ['brand' => 'Advil Junior Suspension 100ml', 'generic' => 'Ibuprofen Junior 100mg/5ml', 'form' => 'Syrup', 'unit' => 'bottles', 'price' => 450.00],
                ['brand' => 'Infacol Wind Drops 50ml', 'generic' => 'Simethicone 40mg/ml Drops', 'form' => 'Drops', 'unit' => 'bottles', 'price' => 520.00],
                ['brand' => 'Nutramigen LGG Formula 400g', 'generic' => 'Hypoallergenic Infant Formula', 'form' => 'Powder', 'unit' => 'cans', 'price' => 3800.00]
            ]
        ];

        $medAmox = null;
        $medAtorva = null;
        $batchHighRisk = null;
        $batchSafe = null;

        $barcodeCounter = 8901000000000;

        foreach ($drugsByCat as $catIdx => $drugList) {
            $catId = $categoryIds[$catIdx];
            foreach ($drugList as $dIdx => $d) {
                $barcodeCounter++;
                $mId = DB::table('medicines')->insertGetId([
                    'category_id' => $catId,
                    'barcode' => (string)$barcodeCounter,
                    'generic_name' => $d['generic'],
                    'brand_name' => $d['brand'],
                    'dosage_form' => $d['form'],
                    'unit' => $d['unit'],
                    'min_reorder_level' => 150,
                    'max_stock_capacity' => 3000,
                    'unit_price' => $d['price'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                if ($catIdx === 0 && $dIdx === 0) $medAmox = $mId;
                if ($catIdx === 1 && $dIdx === 0) $medAtorva = $mId;

                $batchCode = strtoupper(substr($d['brand'], 0, 3)) . '-2026-B' . sprintf('%03d', rand(10, 999));
                $isHighRiskBatch = ($catIdx === 0 && $dIdx === 0);
                $expDays = $isHighRiskBatch ? 14 : rand(90, 720);
                $currQty = $isHighRiskBatch ? 240 : rand(800, 2500);

                $bId = DB::table('medicine_batches')->insertGetId([
                    'medicine_id' => $mId,
                    'supplier_id' => $supplierIds[($catIdx + $dIdx) % 10],
                    'batch_number' => $batchCode,
                    'mfd_date' => now()->subMonths(rand(1, 6))->toDateString(),
                    'exp_date' => now()->addDays($expDays)->toDateString(),
                    'initial_quantity' => 3000,
                    'current_quantity' => $currQty,
                    'unit_cost' => round($d['price'] * 0.7, 2),
                    'storage_location' => 'Rack ' . chr(65 + ($catIdx % 8)) . '-' . sprintf('%02d', $dIdx + 1),
                    'status' => $currQty < 300 ? 'low' : 'available',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                if ($isHighRiskBatch) $batchHighRisk = $bId;
                if ($catIdx === 1 && $dIdx === 0) $batchSafe = $bId;
            }
        }

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
