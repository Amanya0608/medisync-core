# 🏥 MediSync Core - Enterprise Healthcare & Inventory Platform

> **A Centralized Digital Pharmacy Inventory, FEFO Expiry Risk Engine, Groq AI Clinical Symptom Triage, and Electronic Health Records (EHR) System.**

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Groq AI](https://img.shields.io/badge/AI_Engine-Groq_Llama_3.3-f97316?style=for-the-badge)](https://groq.com)
[![Compliance](https://img.shields.io/badge/Compliance-SLMC_%26_HIPAA-10b981?style=for-the-badge)](https://medisync.health)

---

## 📌 Introduction

**MediSync** is an enterprise-grade digital healthcare & clinical inventory platform engineered for hospitals, medical centers, and rural healthcare facilities. It integrates clinical consultations, electronic prescriptions (Rx), patient health records (EHR), and automated **First-Expired, First-Out (FEFO)** pharmaceutical inventory monitoring with **Groq Llama 3.3 AI intelligence**.

The system features a **Role-Based Access Control (RBAC)** security architecture that dynamically enforces access boundaries across medical roles while maintaining compliance with SLMC and HIPAA clinical data protection guidelines.

---

## 🚀 Technology Stack

### **Frontend (User Interface & Portal Shell)**
* **Core Framework**: React 18.x + Vite 6.x (Single Page Application)
* **Styling & Theme Engine**: Modern Vanilla CSS3 with Glassmorphism, CSS Custom Properties, and Theme Engine (Light / Dark Mode Toggle)
* **Iconography**: Lucide React Icons
* **Layout Architecture**: Fixed Viewport Shell (`100vh` non-scrolling TopBar Header, full-height Sidebar, scrollable Content area)

### **Backend (REST API Server)**
* **Framework**: Laravel 11.x (PHP 8.2+)
* **Database ORM**: Eloquent ORM & Query Builder
* **Security & Auth**: Bcrypt (12 salt rounds), Custom Password Strength Validation, Immutable Audit Ledger Logging (`audit_logs`)
* **Environment Configuration**: Dotenv (`.env`) for API Keys and Database Credentials

### **Database (Relational Data Engine)**
* **Database Engine**: MySQL 8.0+ / MariaDB
* **Relational Schemas**: `users`, `roles`, `permissions`, `role_permissions`, `departments`, `staff`, `patients`, `medicines`, `categories`, `suppliers`, `batches`, `inventory_transactions`, `prescriptions`, `prescription_items`, `triage_logs`, `audit_logs`

### **AI Intelligence Engine**
* **Provider**: Groq Cloud API
* **Model**: `llama-3.3-70b-versatile`
* **Features**: Real-time Clinical Symptom Triage, Department Recommendation Routing, AI Confidence Scoring, Clinician Override Logging, and 30/60/90-Day Medicine FEFO Expiry Risk Intelligence.

---

## 🌟 Core Modules & Key Features

### 📊 1. Executive Operational Dashboard (`/dashboard/overview`)
* **KPI Metrics Cards**: Total Hospital Staff, Active FEFO Batches, Outpatient EHR Patients, Pending Consultations, and Stock Expiry Risk alerts.
* **Clinical Triage Donut Chart**: Visual distribution of AI clinical triage severity levels (`Emergency`, `Urgent`, `Routine`).
* **7-Day Consultation Trend Visualization**: Interactive bar visualizer displaying weekly patient volume.
* **FEFO Expiry Risk Visualizer**: Color-coded progress metrics for stock expiring within 30, 60, and 90 days.

### 👥 2. Patient Electronic Health Records (EHR) (`/dashboard/patients`)
* **Demographics & Identification**: Patient registration with code tracking (`PAT-2026-001`), DOB, Gender, and NIC/Passport numbers.
* **Clinical History & Allergies**: Blood group logging and high-risk allergy warning alerts (e.g. Penicillin, Sulfa drugs).

### 📝 3. Electronic Prescriptions (Rx) (`/dashboard/prescriptions`)
* **Rx Issuance**: Doctors issue electronic prescriptions linked to patient EHR records and formulary medicines.
* **Pharmacy Dispensing Workflow**: Tracks prescription status (`Active`, `Dispensed`, `Cancelled`) with dispensing timestamps.

### 🤖 4. Groq AI Clinical Symptom Triage (`/dashboard/ai_triage`)
* **AI Analysis**: Accepts patient symptoms, analyzes severity, assigns triage level, recommends hospital department, and calculates AI confidence score.
* **Clinician Override**: Licensed Doctors can override AI recommendations with custom clinical notes.

### 💊 5. Pharmacy & FEFO Inventory Engine (`/dashboard/medicines`, `/dashboard/batches`, `/dashboard/suppliers`)
* **Formulary Catalog**: Medicine dosage forms, unit prices, minimum reorder thresholds, and maximum capacity limits.
* **FEFO Batch Intake**: Track lot numbers, storage rack locations, manufacture dates (MFD), and expiry dates (EXP).
* **Supplier Performance**: Track supplier ratings, contact details, and recalculate fulfillment performance metrics.
* **Stock Movement Audit Logs**: Automatic ledger logging for `RESTOCK`, `DISPENSE`, `EXPIRED`, and `RETURN` stock transactions.

### 🤖 6. AI FEFO Expiry Intelligence (`/dashboard/ai_risk`)
* **Automated Expiry Forecasting**: Groq AI analyzes stock batch expiry timelines and generates risk scores (`Critical`, `Moderate`, `Low`) to prevent drug loss.

### 🔑 7. Role-Based Access Control (RBAC) Matrix (`/dashboard/permissions`)
* **4 Core Medical Roles**:
  - 👑 **Super Administrator** (`super_admin`): Full 100% administrative & operational control.
  - 💊 **Chief Pharmacist** (`pharmacist`): Inventory, FEFO batches, suppliers, dispensing, and AI expiry risk.
  - 🩺 **Medical Officer / Doctor** (`doctor`): Clinical consultations, appointments, EHR, Rx issuance, AI triage & override.
  - 🩺 **Staff Nurse / Ward Care Officer** (`nurse`): Walk-in patient registration, OPD check-ins, ward status, and AI intake.
* **Live Matrix Toggle**: Real-time permission granting/revoking for all 20 pre-seeded system permissions.

### 👤 8. User Profile & Password Security Management (`/dashboard/profile`)
* **Profile Management**: Profile details, contact numbers, department assignments, and Base64 custom avatar uploading.
* **Password Update**: Bcrypt hashing, dynamic color-coded password strength meter (`Weak`, `Fair`, `Strong`), and audit logging (`USER_PASSWORD_UPDATED`).

---

## 📂 System Folder Structure

```
Medisync/
├── backend/                        # Laravel 11.x REST API Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── migrations/             # Database Schema Migrations
│   │   └── seeders/                # DatabaseSeeder.php (Roles, Permissions, Users, Medicines, Batches)
│   ├── routes/
│   │   └── api.php                 # 70+ RESTful API Endpoint Routes
│   ├── .env.example
│   └── composer.json
│
├── frontend/                       # Vite + React 18 SPA Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx     # Public Marketing & Features Landing Page
│   │   │   ├── AuthPages.jsx       # Login, Register, Forgot Password & OTP Modals
│   │   │   └── RolePortal.jsx      # Fixed Shell Post-Login Portal & Dashboard Views
│   │   ├── App.jsx                 # Theme Engine & Main App Router
│   │   ├── main.jsx
│   │   └── index.css               # Design Tokens, Glassmorphism, Theme Rules & Layout Shell
│   ├── package.json
│   └── vite.config.js
│
├── LICENSE
└── README.md
```

---

## 🛠️ How to Run (Installation & Setup)

### **Prerequisites**
Before setting up MediSync, ensure you have the following installed:
* **PHP**: `>= 8.2`
* **Composer**: `>= 2.5`
* **Node.js**: `>= 18.x` & `npm`
* **MySQL Database**: `>= 8.0` (or MariaDB / XAMPP / WampServer)

---

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/Amanya0608/medisync-core.git
cd medisync-core
```

---

### **Step 2: Backend Setup (Laravel REST API)**

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Create the `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure your MySQL database and Groq API key in `.env`:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=medisync
   DB_USERNAME=root
   DB_PASSWORD=

   GROQ_API_KEY=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
   ```

5. Run database migrations and seed default data:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. Start the Laravel REST API server:
   ```bash
   php artisan serve
   ```
   *The backend API server will run at: `http://127.0.0.1:8000`*

---

### **Step 3: Frontend Setup (Vite + React)**

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application UI will run at: `http://localhost:5173` or `http://localhost:5174`*

4. *(Optional)* Build the production bundle:
   ```bash
   npm run build
   ```

---

## 🔑 Default Login Credentials

After running `php artisan db:seed`, you can log into the portal using any of the seeded accounts below:

| Role Name | Email Address | Default Password | Role Key |
| :--- | :--- | :--- | :--- |
| **Super Administrator** | `admin@medisync.health` | `password123` | `super_admin` |
| **Medical Officer / Doctor** | `thorne@medisync.health` | `password123` | `doctor` |
| **Chief Pharmacist** | `nuwan.jay@medisync.health` | `password123` | `pharmacist` |
| **Staff Nurse** | `savindu147@gmail.com` | `password123` | `nurse` |

---

## 📡 REST API Endpoint Summary

Below is a summary of primary API routes exposed by the Laravel backend (`http://127.0.0.1:8000/api/v1`):

| Method | Endpoint Route | Description | Access Role |
| :---: | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | User Authentication & Session Token | Public |
| `GET` | `/api/v1/admin/users` | List All System Users | Super Admin |
| `GET` | `/api/v1/admin/roles` | List System Roles | All Roles |
| `GET` | `/api/v1/admin/role-permissions-matrix` | Fetch Access Control Matrix | Super Admin |
| `POST`| `/api/v1/admin/role-permissions/toggle` | Toggle Permission Matrix Switch | Super Admin |
| `GET` | `/api/v1/patients` | List Patient EHR Records | Doctor, Nurse, Admin |
| `POST`| `/api/v1/patients` | Register New Patient EHR | Doctor, Nurse, Admin |
| `GET` | `/api/v1/prescriptions` | List Electronic Prescriptions | All Roles |
| `POST`| `/api/v1/prescriptions` | Issue New Prescription (Rx) | Doctor, Admin |
| `GET` | `/api/v1/ai/triage` | Fetch AI Triage Logs | Doctor, Nurse, Admin |
| `POST`| `/api/v1/ai/triage` | Submit Symptoms for AI Triage | Doctor, Nurse, Admin |
| `GET` | `/api/v1/medicines` | List Medicine Formulary Catalog | Pharmacist, Doctor, Admin |
| `GET` | `/api/v1/batches` | List FEFO Stock Batches | Pharmacist, Admin |
| `POST`| `/api/v1/batches` | Intake New Medicine Batch | Pharmacist, Admin |
| `GET` | `/api/v1/ai/inventory-risk` | Generate Groq AI FEFO Expiry Risks | Pharmacist, Admin |
| `PUT` | `/api/v1/user/password` | Update Profile Account Password | Authenticated User |

---

## 🛡️ Security & Compliance
* **HIPAA & SLMC Guidelines**: Enforces data privacy for patient EHR medical histories and allergy alerts.
* **Immutable Audit Trail**: All password updates, privilege toggles, and stock adjustments are automatically recorded in `audit_logs`.
* **Password Encryption**: All passwords are encrypted using Bcrypt with 12 rounds of salt.

---

## 📄 License
This project is proprietary software developed for the MediSync Healthcare System. All rights reserved.
