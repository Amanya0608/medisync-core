-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2026 at 02:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medisync`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_inventory_insights`
--

CREATE TABLE `ai_inventory_insights` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `medicine_id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `expiry_risk_score` decimal(5,2) NOT NULL DEFAULT 0.00,
  `predicted_demand_30d` int(11) NOT NULL DEFAULT 0,
  `recommended_reorder_qty` int(11) NOT NULL DEFAULT 0,
  `confidence_score` decimal(5,2) NOT NULL DEFAULT 90.00,
  `ai_recommendation` text DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ai_inventory_insights`
--

INSERT INTO `ai_inventory_insights` (`id`, `medicine_id`, `batch_id`, `expiry_risk_score`, `predicted_demand_30d`, `recommended_reorder_qty`, `confidence_score`, `ai_recommendation`, `generated_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 92.50, 180, 500, 96.40, 'CRITICAL FEFO ALERT: Batch AMX-2025-EXP14D has 240 units expiring in 14 days. Transfer 150 units to OPD clinic immediately for fast dispensing.', '2026-08-26 06:17:55', '2026-08-26 06:17:55', '2026-08-26 06:17:55');

-- --------------------------------------------------------

--
-- Table structure for table `ai_symptom_triage_logs`
--

CREATE TABLE `ai_symptom_triage_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED DEFAULT NULL,
  `input_symptoms` text NOT NULL,
  `suggested_triage_level` enum('Routine','Urgent','Emergency') NOT NULL DEFAULT 'Routine',
  `recommended_department` varchar(255) NOT NULL DEFAULT 'General OPD',
  `ai_confidence_score` decimal(5,2) NOT NULL DEFAULT 85.00,
  `suggested_medications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`suggested_medications`)),
  `doctor_override` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ai_symptom_triage_logs`
--

INSERT INTO `ai_symptom_triage_logs` (`id`, `patient_id`, `input_symptoms`, `suggested_triage_level`, `recommended_department`, `ai_confidence_score`, `suggested_medications`, `doctor_override`, `created_at`, `updated_at`) VALUES
(1, 1, 'Severe chest tightness, shortness of breath, blood pressure 150/95', 'Emergency', 'Cardiology Unit', 94.20, '[\"Atorvastatin 20mg\",\"Aspirin 75mg\"]', 0, '2026-08-26 06:17:55', '2026-08-26 06:17:55');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_date` datetime NOT NULL,
  `type` enum('Consultation','Follow-up','Emergency','Routine Checkup') NOT NULL DEFAULT 'Consultation',
  `priority` enum('Low','Normal','High','Emergency') NOT NULL DEFAULT 'Normal',
  `status` enum('Scheduled','In_Progress','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `type`, `priority`, `status`, `reason`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2026-08-26 13:47:55', 'Consultation', 'High', 'In_Progress', 'Hypertension follow-up & chest pain review', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(2, 2, 1, '2026-08-26 22:39:00', 'Consultation', 'Normal', 'Scheduled', 'Test Refill Request', '2026-08-26 06:48:53', '2026-08-26 06:48:53'),
(3, 2, 1, '2026-08-29 22:39:00', 'Follow-up', 'Normal', 'Scheduled', 'ghjfhfggffghgfhgf', '2026-08-26 06:56:32', '2026-08-26 06:56:32'),
(4, 2, 1, '2026-08-26 21:56:00', 'Follow-up', 'Normal', 'Scheduled', 'gfdfhjjhjhj', '2026-08-26 06:56:41', '2026-08-26 06:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `entity_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `ip_address`, `user_agent`, `payload`, `created_at`) VALUES
(1, 1, 'SYSTEM_SEED', 'DatabaseSeeder', 1, '127.0.0.1', 'MediSync Enterprise Seeder v1.0', '{\"tables_seeded\":22,\"status\":\"SUCCESS\"}', '2026-08-26 06:17:55'),
(2, NULL, 'PATIENT_SELF_SERVICE_APPOINTMENT_REQUESTED', 'Appointment', 2, NULL, NULL, '{\"patient_id\":2,\"doctor_id\":1,\"date\":\"2026-08-26 22:39:00\",\"reason\":\"Test Refill Request\"}', '2026-08-26 06:48:53'),
(3, NULL, 'PATIENT_SELF_SERVICE_APPOINTMENT_REQUESTED', 'Appointment', 3, NULL, NULL, '{\"patient_id\":2,\"doctor_id\":1,\"date\":\"2026-08-29 22:39:00\",\"reason\":\"ghjfhfggffghgfhgf\"}', '2026-08-26 06:56:32'),
(4, NULL, 'PATIENT_SELF_SERVICE_APPOINTMENT_REQUESTED', 'Appointment', 4, NULL, NULL, '{\"patient_id\":2,\"doctor_id\":1,\"date\":\"2026-08-26 21:56:00\",\"reason\":\"gfdfhjjhjhj\"}', '2026-08-26 06:56:41'),
(5, 2, 'LOGIN_OTP_GENERATED', 'User', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '{\"email\":\"pharmacist@medisync.health\",\"otp_sent\":true}', '2026-08-26 06:58:03'),
(6, 2, 'LOGIN_OTP_VERIFIED', 'User', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '{\"role\":\"Chief Pharmacist\"}', '2026-08-26 06:58:13'),
(7, 5, 'LOGIN_OTP_GENERATED', 'User', 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '{\"email\":\"nurse@medisync.health\",\"otp_sent\":true}', '2026-08-26 06:58:42'),
(8, 5, 'LOGIN_OTP_VERIFIED', 'User', 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '{\"role\":\"Staff Nurse \\/ Ward Care Officer\"}', '2026-08-26 06:58:55'),
(9, NULL, 'PRESCRIPTION_ISSUED', 'Prescription', 2, NULL, NULL, '{\"prescription_code\":\"RX-2026-9138\",\"patient_id\":1,\"status\":\"ISSUED\"}', '2026-08-26 06:59:18'),
(10, NULL, 'PRESCRIPTION_ISSUED', 'Prescription', 3, NULL, NULL, '{\"prescription_code\":\"RX-2026-9182\",\"patient_id\":1,\"status\":\"ISSUED\"}', '2026-08-26 06:59:55'),
(11, 3, 'LOGIN_OTP_GENERATED', 'User', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '{\"email\":\"doctor@medisync.health\",\"otp_sent\":true}', '2026-08-26 07:15:50'),
(12, 3, 'LOGIN_OTP_VERIFIED', 'User', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '{\"role\":\"Medical Officer \\/ Doctor\"}', '2026-08-26 07:16:01');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cold_chain_logs`
--

CREATE TABLE `cold_chain_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `sensor_location` varchar(255) NOT NULL DEFAULT 'Central Pharmacy Cold Unit 1',
  `recorded_temp_celsius` decimal(4,1) NOT NULL,
  `min_threshold` decimal(4,1) NOT NULL DEFAULT 2.0,
  `max_threshold` decimal(4,1) NOT NULL DEFAULT 8.0,
  `status` enum('NORMAL','BREACH_HIGH','BREACH_LOW') NOT NULL DEFAULT 'NORMAL',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cold_chain_logs`
--

INSERT INTO `cold_chain_logs` (`id`, `batch_id`, `sensor_location`, `recorded_temp_celsius`, `min_threshold`, `max_threshold`, `status`, `notes`, `created_at`) VALUES
(1, 11, 'Central Pharmacy Cold Room Unit 1 - Rack A', 4.2, 2.0, 8.0, 'NORMAL', 'Storage temperature optimal at 4.2°C', '2026-08-26 03:17:55'),
(2, 1, 'Central Pharmacy Vaccine Fridge 2', 9.8, 2.0, 8.0, 'BREACH_HIGH', 'CRITICAL TEMPERATURE BREACH: Recorded 9.8°C (Optimal: 2.0°C to 8.0°C). Compressor inspection required.', '2026-08-26 05:52:55');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location_floor` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `code`, `name`, `description`, `location_floor`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PHARM-01', 'Central Pharmacy', 'Main hospital drug store & dispensing hub', 'Ground Floor - Wing A', 'active', '2026-08-26 06:17:53', '2026-08-26 06:17:53'),
(2, 'CARD-02', 'Cardiology Unit', 'Heart and vascular care unit', '2nd Floor - Wing B', 'active', '2026-08-26 06:17:53', '2026-08-26 06:17:53'),
(3, 'OPD-01', 'Outpatient OPD', 'General outpatient clinic', '1st Floor - Main Lobby', 'active', '2026-08-26 06:17:53', '2026-08-26 06:17:53');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `icd_codes`
--

CREATE TABLE `icd_codes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icd_version` enum('ICD-10','ICD-11') NOT NULL DEFAULT 'ICD-10',
  `code` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'General Medicine',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `icd_codes`
--

INSERT INTO `icd_codes` (`id`, `icd_version`, `code`, `description`, `category`, `created_at`, `updated_at`) VALUES
(1, 'ICD-10', 'I10', 'Essential (primary) hypertension', 'Circulatory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(2, 'ICD-10', 'E11.9', 'Type 2 diabetes mellitus without complications', 'Endocrine & Metabolic', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(3, 'ICD-10', 'J45.909', 'Unspecified asthma, uncomplicated', 'Respiratory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(4, 'ICD-10', 'I21.9', 'Acute myocardial infarction, unspecified', 'Circulatory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(5, 'ICD-10', 'J18.9', 'Pneumonia, unspecified organism', 'Respiratory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(6, 'ICD-10', 'K21.9', 'Gastro-esophageal reflux disease without esophagitis', 'Digestive System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(7, 'ICD-10', 'N39.0', 'Urinary tract infection, site not specified', 'Genitourinary System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(8, 'ICD-10', 'M54.5', 'Low back pain, unspecific', 'Musculoskeletal System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(9, 'ICD-11', 'BA00', 'Essential hypertension (Primary hypertension)', 'Diseases of Circulatory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(10, 'ICD-11', '5A11', 'Type 2 diabetes mellitus', 'Endocrine, Nutritional & Metabolic', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(11, 'ICD-11', 'CA23', 'Asthma (Unspecified clinical phenotypes)', 'Diseases of Respiratory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(12, 'ICD-11', 'BA41', 'Acute myocardial infarction', 'Diseases of Circulatory System', '2026-08-26 06:17:55', '2026-08-26 06:17:55');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_type` enum('RESTOCK','DISPENSE','ADJUSTMENT','RETURN','EXPIRED_DISCARD') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference_no` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `generic_name` varchar(255) NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `dosage_form` varchar(255) NOT NULL DEFAULT 'Tablet',
  `unit` varchar(255) NOT NULL DEFAULT 'pcs',
  `min_reorder_level` int(11) NOT NULL DEFAULT 100,
  `max_stock_capacity` int(11) NOT NULL DEFAULT 5000,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `prescription_required` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('active','discontinued') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `requires_cold_chain` tinyint(1) NOT NULL DEFAULT 0,
  `min_temp_celsius` decimal(4,1) NOT NULL DEFAULT 2.0,
  `max_temp_celsius` decimal(4,1) NOT NULL DEFAULT 8.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `category_id`, `barcode`, `generic_name`, `brand_name`, `dosage_form`, `unit`, `min_reorder_level`, `max_stock_capacity`, `unit_price`, `prescription_required`, `status`, `created_at`, `updated_at`, `requires_cold_chain`, `min_temp_celsius`, `max_temp_celsius`) VALUES
(1, 1, '8901000000001', 'Amoxicillin Trihydrate', 'Amoxil 500mg', 'Capsule', 'capsules', 150, 3000, 24.50, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(2, 1, '8901000000002', 'Amoxicillin + Clavulanic Acid', 'Augmentin 625mg', 'Tablet', 'tablets', 150, 3000, 85.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(3, 1, '8901000000003', 'Azithromycin Monohydrate', 'Zithromax 500mg', 'Tablet', 'tablets', 150, 3000, 120.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(4, 1, '8901000000004', 'Ciprofloxacin Hydrochloride', 'Ciproxl 500mg', 'Tablet', 'tablets', 150, 3000, 45.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(5, 1, '8901000000005', 'Ceftriaxone Sodium', 'Rocephin 1g', 'Injection', 'vials', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(6, 1, '8901000000006', 'Metronidazole', 'Flagyl 400mg', 'Tablet', 'tablets', 150, 3000, 18.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(7, 1, '8901000000007', 'Doxycycline Hyclate', 'Doryx 100mg', 'Capsule', 'capsules', 150, 3000, 32.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(8, 1, '8901000000008', 'Cephalexin Monohydrate', 'Keflex 500mg', 'Capsule', 'capsules', 150, 3000, 38.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(9, 1, '8901000000009', 'Sulfamethoxazole + Trimethoprim', 'Bactrim DS', 'Tablet', 'tablets', 150, 3000, 22.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(10, 1, '8901000000010', 'Vancomycin Hydrochloride', 'Vancocin 500mg', 'Injection', 'vials', 150, 3000, 1250.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(11, 2, '8901000000011', 'Atorvastatin Calcium', 'Lipitor 20mg', 'Tablet', 'tablets', 150, 3000, 45.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(12, 2, '8901000000012', 'Amlodipine Besylate', 'Norvasc 5mg', 'Tablet', 'tablets', 150, 3000, 15.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(13, 2, '8901000000013', 'Lisinopril Dihydrate', 'Zestril 10mg', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(14, 2, '8901000000014', 'Losartan Potassium', 'Cozaar 50mg', 'Tablet', 'tablets', 150, 3000, 34.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(15, 2, '8901000000015', 'Atenolol', 'Tenormin 50mg', 'Tablet', 'tablets', 150, 3000, 12.50, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(16, 2, '8901000000016', 'Carvedilol Phosphate', 'Coreg 6.25mg', 'Tablet', 'tablets', 150, 3000, 42.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(17, 2, '8901000000017', 'Rosuvastatin Calcium', 'Crestor 10mg', 'Tablet', 'tablets', 150, 3000, 95.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(18, 2, '8901000000018', 'Furosemide', 'Lasix 40mg', 'Tablet', 'tablets', 150, 3000, 10.00, 1, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54', 0, 2.0, 8.0),
(19, 2, '8901000000019', 'Valsartan', 'Diovan 80mg', 'Tablet', 'tablets', 150, 3000, 68.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(20, 2, '8901000000020', 'Diltiazem Hydrochloride', 'Cardizem 60mg', 'Tablet', 'tablets', 150, 3000, 29.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(21, 3, '8901000000021', 'Paracetamol (Acetaminophen)', 'Panadol 500mg', 'Tablet', 'tablets', 150, 3000, 5.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(22, 3, '8901000000022', 'Ibuprofen', 'Nurofen 400mg', 'Tablet', 'tablets', 150, 3000, 14.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(23, 3, '8901000000023', 'Diclofenac Sodium', 'Voltaren 50mg', 'Tablet', 'tablets', 150, 3000, 25.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(24, 3, '8901000000024', 'Celecoxib', 'Celebrex 200mg', 'Capsule', 'capsules', 150, 3000, 110.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(25, 3, '8901000000025', 'Tramadol Hydrochloride', 'Tramal 50mg', 'Capsule', 'capsules', 150, 3000, 45.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(26, 3, '8901000000026', 'Etoricoxib', 'Arcoxia 90mg', 'Tablet', 'tablets', 150, 3000, 140.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(27, 3, '8901000000027', 'Mefenamic Acid', 'Ponstan 500mg', 'Capsule', 'capsules', 150, 3000, 20.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(28, 3, '8901000000028', 'Piroxicam', 'Feldene 20mg', 'Capsule', 'capsules', 150, 3000, 30.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(29, 3, '8901000000029', 'Naproxen Sodium', 'Aleve 220mg', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(30, 3, '8901000000030', 'Diclofenac Potassium', 'Cataflam 50mg', 'Tablet', 'tablets', 150, 3000, 32.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(31, 4, '8901000000031', 'Salbutamol Sulfate', 'Ventolin Evohaler 100mcg', 'Inhaler', 'devices', 150, 3000, 650.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(32, 4, '8901000000032', 'Fluticasone + Salmeterol', 'Seretide Accuhaler 250', 'Inhaler', 'devices', 150, 3000, 2400.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(33, 4, '8901000000033', 'Montelukast Sodium', 'Singulair 10mg', 'Tablet', 'tablets', 150, 3000, 95.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(34, 4, '8901000000034', 'Tiotropium Bromide', 'Spiriva HandiHaler 18mcg', 'Inhaler', 'devices', 150, 3000, 3100.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(35, 4, '8901000000035', 'Fexofenadine Hydrochloride', 'Telfast 120mg', 'Tablet', 'tablets', 150, 3000, 48.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(36, 4, '8901000000036', 'Cetirizine Dihydrochloride', 'Zyrtec 10mg', 'Tablet', 'tablets', 150, 3000, 18.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(37, 4, '8901000000037', 'Loratadine', 'Claritin 10mg', 'Tablet', 'tablets', 150, 3000, 22.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(38, 4, '8901000000038', 'Budesonide + Formoterol', 'Symbicort 160/4.5', 'Inhaler', 'devices', 150, 3000, 2850.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(39, 4, '8901000000039', 'Budesonide Suspension', 'Pulmicort 0.5mg/2ml', 'Ampoule', 'ampoules', 150, 3000, 150.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(40, 4, '8901000000040', 'Ambroxol Hydrochloride', 'Mucosolvan 30mg/5ml', 'Syrup', 'bottles', 150, 3000, 320.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(41, 5, '8901000000041', 'Omeprazole Magnesium', 'Losec 20mg', 'Capsule', 'capsules', 150, 3000, 26.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(42, 5, '8901000000042', 'Esomeprazole Magnesium', 'Nexium 40mg', 'Tablet', 'tablets', 150, 3000, 88.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(43, 5, '8901000000043', 'Ranitidine Hydrochloride', 'Zantac 150mg', 'Tablet', 'tablets', 150, 3000, 15.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(44, 5, '8901000000044', 'Sodium Alginate + Antacids', 'Gaviscon Double Action', 'Syrup', 'bottles', 150, 3000, 780.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(45, 5, '8901000000045', 'Domperidone', 'Motilium 10mg', 'Tablet', 'tablets', 150, 3000, 14.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(46, 5, '8901000000046', 'Hyoscine Butylbromide', 'Buscopan 10mg', 'Tablet', 'tablets', 150, 3000, 18.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(47, 5, '8901000000047', 'Bisacodyl', 'Dulcolax 5mg', 'Tablet', 'tablets', 150, 3000, 8.50, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(48, 5, '8901000000048', 'Loperamide Hydrochloride', 'Imodium 2mg', 'Capsule', 'capsules', 150, 3000, 22.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(49, 5, '8901000000049', 'Pancreatin Enzymes', 'Creon 10000', 'Capsule', 'capsules', 150, 3000, 145.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(50, 5, '8901000000050', 'Pantoprazole Sodium', 'Pantocid 40mg', 'Tablet', 'tablets', 150, 3000, 35.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(51, 6, '8901000000051', 'Metformin Hydrochloride', 'Glucophage 850mg', 'Tablet', 'tablets', 150, 3000, 16.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(52, 6, '8901000000052', 'Insulin Glargine', 'Lantus SoloStar 100IU', 'Pen', 'pens', 150, 3000, 1850.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(53, 6, '8901000000053', 'Insulin Aspart', 'Novorapid FlexPen 100IU', 'Pen', 'pens', 150, 3000, 1950.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(54, 6, '8901000000054', 'Sitagliptin Phosphate', 'Januvia 100mg', 'Tablet', 'tablets', 150, 3000, 125.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(55, 6, '8901000000055', 'Glimepiride', 'Amaryl 2mg', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(56, 6, '8901000000056', 'Levothyroxine Sodium', 'Eltroxin 50mcg', 'Tablet', 'tablets', 150, 3000, 12.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(57, 6, '8901000000057', 'Empagliflozin', 'Jardiance 10mg', 'Tablet', 'tablets', 150, 3000, 165.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(58, 6, '8901000000058', 'Dapagliflozin Propanediol', 'Forxiga 10mg', 'Tablet', 'tablets', 150, 3000, 155.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(59, 6, '8901000000059', 'Gliclazide', 'Diamicron MR 60mg', 'Tablet', 'tablets', 150, 3000, 42.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(60, 6, '8901000000060', 'Pioglitazone Hydrochloride', 'Actos 15mg', 'Tablet', 'tablets', 150, 3000, 38.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(61, 7, '8901000000061', 'Sodium Valproate', 'Epilim Chrono 500mg', 'Tablet', 'tablets', 150, 3000, 52.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(62, 7, '8901000000062', 'Carbamazepine', 'Tegretol CR 200mg', 'Tablet', 'tablets', 150, 3000, 35.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(63, 7, '8901000000063', 'Pregabalin', 'Lyrica 75mg', 'Capsule', 'capsules', 150, 3000, 98.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(64, 7, '8901000000064', 'Gabapentin', 'Neurontin 300mg', 'Capsule', 'capsules', 150, 3000, 64.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(65, 7, '8901000000065', 'Levodopa + Carbidopa', 'Sinemet 250/25', 'Tablet', 'tablets', 150, 3000, 88.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(66, 7, '8901000000066', 'Topiramate', 'Topamax 50mg', 'Tablet', 'tablets', 150, 3000, 75.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(67, 7, '8901000000067', 'Levetiracetam', 'Keppra 500mg', 'Tablet', 'tablets', 150, 3000, 130.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(68, 7, '8901000000068', 'Quetiapine Fumarate', 'Seroquel 100mg', 'Tablet', 'tablets', 150, 3000, 115.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(69, 7, '8901000000069', 'Olanzapine', 'Zyprexa 5mg', 'Tablet', 'tablets', 150, 3000, 140.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(70, 7, '8901000000070', 'Donepezil Hydrochloride', 'Aricept 5mg', 'Tablet', 'tablets', 150, 3000, 185.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(71, 8, '8901000000071', 'Betamethasone + Neomycin', 'Betnovate-N Cream 15g', 'Cream', 'tubes', 150, 3000, 240.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(72, 8, '8901000000072', 'Fusidic Acid', 'Fucidin 2% Ointment 15g', 'Ointment', 'tubes', 150, 3000, 380.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(73, 8, '8901000000073', 'Miconazole Nitrate', 'Daktarin Cream 20g', 'Cream', 'tubes', 150, 3000, 310.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(74, 8, '8901000000074', 'Clobetasol Propionate', 'Dermovate 0.05% 25g', 'Ointment', 'tubes', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(75, 8, '8901000000075', 'Mupirocin', 'Bactroban 2% 15g', 'Ointment', 'tubes', 150, 3000, 520.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(76, 8, '8901000000076', 'Clotrimazole', 'Canesten Cream 20g', 'Cream', 'tubes', 150, 3000, 280.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(77, 8, '8901000000077', 'Pimecrolimus', 'Elidel 1% Cream 15g', 'Cream', 'tubes', 150, 3000, 1850.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(78, 8, '8901000000078', 'Triamcinolone Acetonide', 'Kenacort-A Ointment 5g', 'Ointment', 'tubes', 150, 3000, 190.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(79, 8, '8901000000079', 'Zinc Oxide + Lanolin', 'Sudocrem Antiseptic 125g', 'Ointment', 'jars', 150, 3000, 950.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(80, 8, '8901000000080', 'Calcipotriol Monohydrate', 'Daivonex Ointment 30g', 'Ointment', 'tubes', 150, 3000, 1650.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(81, 9, '8901000000081', 'Latanoprost', 'Xalatan 0.005% 2.5ml', 'Eye Drop', 'bottles', 150, 3000, 1450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(82, 9, '8901000000082', 'Tobramycin + Dexamethasone', 'Tobradex Eye Drops 5ml', 'Eye Drop', 'bottles', 150, 3000, 580.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(83, 9, '8901000000083', 'Moxifloxacin Hydrochloride', 'Vigamox 0.5% 5ml', 'Eye Drop', 'bottles', 150, 3000, 720.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(84, 9, '8901000000084', 'Polyethylene Glycol Lubricant', 'Systane Ultra 10ml', 'Eye Drop', 'bottles', 150, 3000, 890.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(85, 9, '8901000000085', 'Dorzolamide + Timolol', 'Cosopt Eye Drops 5ml', 'Eye Drop', 'bottles', 150, 3000, 1250.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(86, 9, '8901000000086', 'Olopatadine Hydrochloride', 'Patanol 0.1% 5ml', 'Eye Drop', 'bottles', 150, 3000, 640.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(87, 9, '8901000000087', 'Xylometazoline Hydrochloride', 'Otrivin 0.1% 10ml', 'Nasal Drop', 'bottles', 150, 3000, 180.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(88, 9, '8901000000088', 'Framycetin + Dexamethasone', 'Sofradex Ear Drops 8ml', 'Ear Drop', 'bottles', 150, 3000, 410.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(89, 9, '8901000000089', 'Ciprofloxacin Eye/Ear Drop', 'Ciplox 0.3% 10ml', 'Eye Drop', 'bottles', 150, 3000, 120.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(90, 9, '8901000000090', 'Carboxymethylcellulose Sodium', 'Refresh Tears 10ml', 'Eye Drop', 'bottles', 150, 3000, 520.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(91, 10, '8901000000091', 'Tamoxifen Citrate', 'Tamofen 20mg', 'Tablet', 'tablets', 150, 3000, 65.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(92, 10, '8901000000092', 'Methotrexate Sodium', 'Methotrexate 2.5mg', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(93, 10, '8901000000093', 'Cyclosporine Microemulsion', 'Neoral 50mg', 'Capsule', 'capsules', 150, 3000, 380.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(94, 10, '8901000000094', 'Mycophenolate Mofetil', 'Cellcept 500mg', 'Tablet', 'tablets', 150, 3000, 290.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(95, 10, '8901000000095', 'Azathioprine', 'Imuran 50mg', 'Tablet', 'tablets', 150, 3000, 85.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(96, 10, '8901000000096', 'Letrozole', 'Femara 2.5mg', 'Tablet', 'tablets', 150, 3000, 240.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(97, 10, '8901000000097', 'Bicalutamide', 'Casodex 50mg', 'Tablet', 'tablets', 150, 3000, 310.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(98, 10, '8901000000098', 'Erlotinib Hydrochloride', 'Tarceva 100mg', 'Tablet', 'tablets', 150, 3000, 2800.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(99, 10, '8901000000099', 'Imatinib Mesylate', 'Gleevec 100mg', 'Capsule', 'capsules', 150, 3000, 1950.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(100, 10, '8901000000100', 'Tacrolimus Hydrate', 'Prograf 1mg', 'Capsule', 'capsules', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(101, 11, '8901000000101', 'Hepatitis B Vaccine Recombinant', 'Engerix-B 20mcg/ml', 'Injection', 'vials', 150, 3000, 1250.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(102, 11, '8901000000102', 'Measles, Mumps & Rubella Virus', 'MMR II Vaccine', 'Injection', 'vials', 150, 3000, 1850.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(103, 11, '8901000000103', 'Rabies Vaccine Inactivated', 'Verorab Rabies 0.5ml', 'Injection', 'vials', 150, 3000, 2100.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(104, 11, '8901000000104', 'Influenza Quadrivalent Vaccine', 'Vaxigrip Tetra 0.5ml', 'Injection', 'syringes', 150, 3000, 1950.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(105, 11, '8901000000105', 'Human Papillomavirus 9-Valent', 'Gardasil 9', 'Injection', 'vials', 150, 3000, 8500.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(106, 11, '8901000000106', 'Pneumococcal 13-Valent Conjugate', 'Prevenar 13', 'Injection', 'syringes', 150, 3000, 6400.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(107, 11, '8901000000107', 'Bacillus Calmette-Guerin Live', 'BCG Vaccine 0.1ml', 'Injection', 'ampoules', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(108, 11, '8901000000108', 'DTaP-IPV-HepB-Hib Combined', 'Infanrix Hexa 0.5ml', 'Injection', 'syringes', 150, 3000, 5200.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(109, 11, '8901000000109', 'Rotavirus Live Attenuated Oral', 'Rotarix Oral 1.5ml', 'Oral Suspension', 'tubes', 150, 3000, 3100.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(110, 11, '8901000000110', 'Adalimumab Subcutaneous', 'Humira 40mg/0.4ml', 'Pen', 'pens', 150, 3000, 24500.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(111, 12, '8901000000111', 'Vitamin B1 + B6 + B12', 'Neurobion Forte', 'Tablet', 'tablets', 150, 3000, 12.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(112, 12, '8901000000112', 'Calcium Carbonate + Cholecalciferol', 'Caltrate 600+D3', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(113, 12, '8901000000113', 'Ferrous Gluconate + Folic Acid', 'Sangobion Iron Capsules', 'Capsule', 'capsules', 150, 3000, 22.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(114, 12, '8901000000114', 'Ascorbic Acid (Vitamin C)', 'Redoxon 1000mg Orange', 'Effervescent', 'tablets', 150, 3000, 45.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(115, 12, '8901000000115', 'Coenzyme Q10 + Antioxidants', 'Revidox 100mg', 'Capsule', 'capsules', 150, 3000, 110.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(116, 12, '8901000000116', 'Calcium + Magnesium + Zinc + Vit D3', 'Osteocare Original', 'Tablet', 'tablets', 150, 3000, 38.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(117, 12, '8901000000117', 'Iron + Vitamin C + B-Complex', 'Iberet Folic 500', 'Tablet', 'tablets', 150, 3000, 42.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(118, 12, '8901000000118', 'Tocopheryl Acetate (Vitamin E)', 'Evion 400', 'Capsule', 'capsules', 150, 3000, 16.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(119, 12, '8901000000119', 'Omega-3 + Vitamin A & D', 'Seven Seas Cod Liver Oil', 'Capsule', 'capsules', 150, 3000, 30.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(120, 12, '8901000000120', 'B-Complex + Zinc Sulphate', 'Becosules Z', 'Capsule', 'capsules', 150, 3000, 14.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(121, 13, '8901000000121', 'Warfarin Sodium', 'Marevan 5mg', 'Tablet', 'tablets', 150, 3000, 18.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(122, 13, '8901000000122', 'Enoxaparin Sodium', 'Clexane 40mg/0.4ml', 'Injection', 'syringes', 150, 3000, 980.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(123, 13, '8901000000123', 'Rivaroxaban Micronized', 'Xarelto 15mg', 'Tablet', 'tablets', 150, 3000, 260.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(124, 13, '8901000000124', 'Apixaban', 'Eliquis 5mg', 'Tablet', 'tablets', 150, 3000, 240.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(125, 13, '8901000000125', 'Clopidogrel Bisulfate', 'Plavix 75mg', 'Tablet', 'tablets', 150, 3000, 55.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(126, 13, '8901000000126', 'Tranexamic Acid', 'Tranexa 500mg', 'Tablet', 'tablets', 150, 3000, 32.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(127, 13, '8901000000127', 'Dabigatran Etexilate', 'Pradaxa 110mg', 'Capsule', 'capsules', 150, 3000, 210.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(128, 13, '8901000000128', 'Ticagrelor', 'Brilinta 90mg', 'Tablet', 'tablets', 150, 3000, 195.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(129, 13, '8901000000129', 'Heparin Sodium IV', 'Heparin 5000IU/ml 5ml', 'Injection', 'vials', 150, 3000, 420.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(130, 13, '8901000000130', 'Phytomenadione Solution', 'Vitamin K1 10mg/ml', 'Injection', 'ampoules', 150, 3000, 85.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(131, 14, '8901000000131', 'Dydrogesterone', 'Duphaston 10mg', 'Tablet', 'tablets', 150, 3000, 110.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(132, 14, '8901000000132', 'Ethinylestradiol + Drospirenone', 'Yasmin 0.03/3mg', 'Tablet', 'tablets', 150, 3000, 1450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(133, 14, '8901000000133', 'Clomifene Citrate', 'Clomid 50mg', 'Tablet', 'tablets', 150, 3000, 68.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(134, 14, '8901000000134', 'Progesterone Pessary', 'Cyclogest 400mg', 'Pessary', 'pessaries', 150, 3000, 185.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(135, 14, '8901000000135', 'Norethisterone', 'Primolut N 5mg', 'Tablet', 'tablets', 150, 3000, 24.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(136, 14, '8901000000136', 'Levonorgestrel + Ethinylestradiol', 'Microgynon 30', 'Tablet', 'tablets', 150, 3000, 350.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(137, 14, '8901000000137', 'Estradiol Vaginal Tablet', 'Vagifem 10mcg', 'Tablet', 'tablets', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(138, 14, '8901000000138', 'Clotrimazole Vaginal', 'Canesten 500mg Pessary', 'Pessary', 'pessaries', 150, 3000, 520.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(139, 14, '8901000000139', 'Levonorgestrel Emergency', 'Postinor-2 0.75mg', 'Tablet', 'tablets', 150, 3000, 280.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(140, 14, '8901000000140', 'Misoprostol', 'Cytotec 200mcg', 'Tablet', 'tablets', 150, 3000, 95.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(141, 15, '8901000000141', 'Tamsulosin Hydrochloride', 'Harnal D 0.2mg', 'Capsule', 'capsules', 150, 3000, 58.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(142, 15, '8901000000142', 'Dutasteride Softgel', 'Avodart 0.5mg', 'Capsule', 'capsules', 150, 3000, 145.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(143, 15, '8901000000143', 'Finasteride', 'Proscar 5mg', 'Tablet', 'tablets', 150, 3000, 88.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(144, 15, '8901000000144', 'Calcium Acetate 667mg', 'Renalux Phosphate Binder', 'Tablet', 'tablets', 150, 3000, 32.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(145, 15, '8901000000145', 'Flavoxate Hydrochloride', 'Urispas 200mg', 'Tablet', 'tablets', 150, 3000, 42.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(146, 15, '8901000000146', 'Mirabegron Extended Release', 'Betmiga 50mg', 'Tablet', 'tablets', 150, 3000, 210.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(147, 15, '8901000000147', 'Solifenacin Succinate', 'Vesicare 5mg', 'Tablet', 'tablets', 150, 3000, 165.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(148, 15, '8901000000148', 'Tadalafil', 'Cialis 5mg Daily', 'Tablet', 'tablets', 150, 3000, 340.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(149, 15, '8901000000149', 'Essential Renal Amino Acids', 'Nephrosteril 500ml', 'Infusion', 'bottles', 150, 3000, 1450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(150, 15, '8901000000150', 'Potassium Citrate ER', 'Urocit-K 10mEq', 'Tablet', 'tablets', 150, 3000, 45.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(151, 16, '8901000000151', 'Lidocaine Hydrochloride', 'Xylocaine 2% 20ml', 'Injection', 'vials', 150, 3000, 120.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(152, 16, '8901000000152', 'Propofol Injectable Emulsion', 'Propofol 1% 20ml', 'Injection', 'ampoules', 150, 3000, 480.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(153, 16, '8901000000153', 'Bupivacaine Hydrochloride', 'Marcaine 0.5% Heavy 4ml', 'Injection', 'ampoules', 150, 3000, 250.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(154, 16, '8901000000154', 'Rocuronium Bromide', 'Esmeron 50mg/5ml', 'Injection', 'ampoules', 150, 3000, 620.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(155, 16, '8901000000155', 'Ketamine Hydrochloride', 'Ketalar 50mg/ml 10ml', 'Injection', 'vials', 150, 3000, 380.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(156, 16, '8901000000156', 'Midazolam Hydrochloride', 'Midazolam 5mg/5ml', 'Injection', 'ampoules', 150, 3000, 140.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(157, 16, '8901000000157', 'Sevoflurane Inhalation', 'Sevoflurane Liquid 250ml', 'Liquid', 'bottles', 150, 3000, 8900.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(158, 16, '8901000000158', 'Neostigmine Methylsulfate', 'Neostigmine 0.5mg/ml', 'Injection', 'ampoules', 150, 3000, 65.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(159, 16, '8901000000159', 'Succinylcholine Chloride', 'Anectine 50mg/ml 2ml', 'Injection', 'vials', 150, 3000, 180.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(160, 16, '8901000000160', 'Cisatracurium Besylate', 'Nimbex 2mg/ml 5ml', 'Injection', 'ampoules', 150, 3000, 740.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(161, 17, '8901000000161', 'Acyclovir', 'Zovirax 400mg', 'Tablet', 'tablets', 150, 3000, 38.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(162, 17, '8901000000162', 'Oseltamivir Phosphate', 'Tamiflu 75mg', 'Capsule', 'capsules', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(163, 17, '8901000000163', 'Valacyclovir Hydrochloride', 'Valtrex 500mg', 'Tablet', 'tablets', 150, 3000, 280.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(164, 17, '8901000000164', 'Entecavir Monohydrate', 'Baraclude 0.5mg', 'Tablet', 'tablets', 150, 3000, 340.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(165, 17, '8901000000165', 'Tenofovir Disoproxil Fumarate', 'Viread 300mg', 'Tablet', 'tablets', 150, 3000, 290.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(166, 17, '8901000000166', 'Lamivudine', 'Epivir 150mg', 'Tablet', 'tablets', 150, 3000, 85.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(167, 17, '8901000000167', 'Raltegravir Potassium', 'Isentress 400mg', 'Tablet', 'tablets', 150, 3000, 1200.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(168, 17, '8901000000168', 'Bictegravir + Emtricitabine + Tenofovir', 'Biktarvy Triple Therapy', 'Tablet', 'tablets', 150, 3000, 3500.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(169, 17, '8901000000169', 'Sofosbuvir', 'Sovaldi 400mg', 'Tablet', 'tablets', 150, 3000, 4200.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(170, 17, '8901000000170', 'Nirmatrelvir + Ritonavir', 'Paxlovid Co-Pack', 'Tablet Pack', 'packs', 150, 3000, 4800.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(171, 18, '8901000000171', 'Alprazolam', 'Xanax 0.5mg', 'Tablet', 'tablets', 150, 3000, 22.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(172, 18, '8901000000172', 'Diazepam', 'Valium 5mg', 'Tablet', 'tablets', 150, 3000, 12.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(173, 18, '8901000000173', 'Lorazepam', 'Ativan 1mg', 'Tablet', 'tablets', 150, 3000, 18.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(174, 18, '8901000000174', 'Escitalopram Oxalate', 'Lexapro 10mg', 'Tablet', 'tablets', 150, 3000, 65.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(175, 18, '8901000000175', 'Sertraline Hydrochloride', 'Zoloft 50mg', 'Tablet', 'tablets', 150, 3000, 58.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(176, 18, '8901000000176', 'Fluoxetine Hydrochloride', 'Prozac 20mg', 'Capsule', 'capsules', 150, 3000, 42.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(177, 18, '8901000000177', 'Clonazepam', 'Rivotril 2mg', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(178, 18, '8901000000178', 'Venlafaxine Hydrochloride', 'Effexor XR 75mg', 'Capsule', 'capsules', 150, 3000, 95.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(179, 18, '8901000000179', 'Duloxetine Hydrochloride', 'Cymbalta 30mg', 'Capsule', 'capsules', 150, 3000, 110.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(180, 18, '8901000000180', 'Risperidone', 'Risperdal 2mg', 'Tablet', 'tablets', 150, 3000, 82.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(181, 19, '8901000000181', 'Mometasone Furoate Nasal', 'Nasonex 50mcg Spray', 'Spray', 'bottles', 150, 3000, 850.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(182, 19, '8901000000182', 'Fluticasone Propionate Nasal', 'Flixonase 50mcg Spray', 'Spray', 'bottles', 150, 3000, 780.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(183, 19, '8901000000183', 'Xylometazoline Nasal Spray', 'Otrivin Adult Spray 10ml', 'Spray', 'bottles', 150, 3000, 220.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(184, 19, '8901000000184', 'Azelastine + Fluticasone', 'Dymista Nasal Spray', 'Spray', 'bottles', 150, 3000, 1450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(185, 19, '8901000000185', 'Gentian + Primula Herbal Extract', 'Sinupret Forte Tablets', 'Tablet', 'tablets', 150, 3000, 45.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(186, 19, '8901000000186', 'Pseudoephedrine Hydrochloride', 'Sudafed 60mg', 'Tablet', 'tablets', 150, 3000, 28.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(187, 19, '8901000000187', 'Chlorpheniramine Maleate', 'Chlor-Trimeton 4mg', 'Tablet', 'tablets', 150, 3000, 6.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(188, 19, '8901000000188', 'Triprolidine + Pseudoephedrine', 'Actifed Expectorant 100ml', 'Syrup', 'bottles', 150, 3000, 380.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(189, 19, '8901000000189', 'Flumethasone + Clioquinol Ear', 'Locacorten-Vioform Drops', 'Ear Drop', 'bottles', 150, 3000, 490.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(190, 19, '8901000000190', 'Beclomethasone Dipropionate', 'Beconase 50mcg Nasal', 'Spray', 'bottles', 150, 3000, 620.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(191, 20, '8901000000191', 'Paracetamol 120mg/5ml', 'Calpol Infant Syrup 100ml', 'Syrup', 'bottles', 150, 3000, 280.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(192, 20, '8901000000192', 'Oral Rehydration Salts Liquid', 'Pedialyte Electrolyte 500ml', 'Syrup', 'bottles', 150, 3000, 350.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(193, 20, '8901000000193', 'Herbal Pediatric Digestive Drops', 'Bonnisan Drops 30ml', 'Drops', 'bottles', 150, 3000, 240.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(194, 20, '8901000000194', 'Amoxicillin Suspension 125mg/5ml', 'Amoxil Oral Powder 100ml', 'Syrup', 'bottles', 150, 3000, 320.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(195, 20, '8901000000195', 'Salbutamol Syrup 2mg/5ml', 'Ventolin Pediatric Syrup 100ml', 'Syrup', 'bottles', 150, 3000, 260.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(196, 20, '8901000000196', 'Cetirizine Drops 10mg/ml', 'Zyrtec Kids Drops 15ml', 'Drops', 'bottles', 150, 3000, 410.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(197, 20, '8901000000197', 'Amoxicillin + Clavulanate 228mg/5ml', 'Augmentin Duo Suspension 70ml', 'Syrup', 'bottles', 150, 3000, 680.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(198, 20, '8901000000198', 'Ibuprofen Junior 100mg/5ml', 'Advil Junior Suspension 100ml', 'Syrup', 'bottles', 150, 3000, 450.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(199, 20, '8901000000199', 'Simethicone 40mg/ml Drops', 'Infacol Wind Drops 50ml', 'Drops', 'bottles', 150, 3000, 520.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0),
(200, 20, '8901000000200', 'Hypoallergenic Infant Formula', 'Nutramigen LGG Formula 400g', 'Powder', 'cans', 150, 3000, 3800.00, 1, 'active', '2026-08-26 06:17:55', '2026-08-26 06:17:55', 0, 2.0, 8.0);

-- --------------------------------------------------------

--
-- Table structure for table `medicine_batches`
--

CREATE TABLE `medicine_batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `medicine_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `batch_number` varchar(255) NOT NULL,
  `mfd_date` date NOT NULL,
  `exp_date` date NOT NULL,
  `initial_quantity` int(11) NOT NULL,
  `current_quantity` int(11) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `storage_location` varchar(255) NOT NULL DEFAULT 'Main Pharmacy Shelf',
  `status` enum('available','low','expired','recalled') NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicine_batches`
--

INSERT INTO `medicine_batches` (`id`, `medicine_id`, `supplier_id`, `batch_number`, `mfd_date`, `exp_date`, `initial_quantity`, `current_quantity`, `unit_cost`, `storage_location`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'AMO-2026-B619', '2026-07-26', '2026-09-09', 3000, 240, 17.15, 'Rack A-01', 'low', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(2, 2, 2, 'AUG-2026-B027', '2026-06-26', '2027-08-14', 3000, 813, 59.50, 'Rack A-02', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(3, 3, 3, 'ZIT-2026-B907', '2026-05-26', '2027-12-01', 3000, 1774, 84.00, 'Rack A-03', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(4, 4, 4, 'CIP-2026-B642', '2026-05-26', '2027-09-16', 3000, 1711, 31.50, 'Rack A-04', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(5, 5, 5, 'ROC-2026-B678', '2026-02-26', '2028-07-27', 3000, 1300, 315.00, 'Rack A-05', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(6, 6, 6, 'FLA-2026-B286', '2026-07-26', '2028-06-17', 3000, 2335, 12.60, 'Rack A-06', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(7, 7, 7, 'DOR-2026-B598', '2026-05-26', '2028-03-19', 3000, 1256, 22.40, 'Rack A-07', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(8, 8, 8, 'KEF-2026-B373', '2026-03-26', '2027-11-27', 3000, 963, 26.60, 'Rack A-08', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(9, 9, 9, 'BAC-2026-B109', '2026-03-26', '2028-02-28', 3000, 1700, 15.40, 'Rack A-09', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(10, 10, 10, 'VAN-2026-B345', '2026-05-26', '2028-06-29', 3000, 1587, 875.00, 'Rack A-10', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(11, 11, 2, 'LIP-2026-B149', '2026-03-26', '2027-08-25', 3000, 2414, 31.50, 'Rack B-01', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(12, 12, 3, 'NOR-2026-B521', '2026-03-26', '2028-07-16', 3000, 1150, 10.50, 'Rack B-02', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(13, 13, 4, 'ZES-2026-B823', '2026-02-26', '2028-08-11', 3000, 1042, 19.60, 'Rack B-03', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(14, 14, 5, 'COZ-2026-B496', '2026-04-26', '2028-05-04', 3000, 2317, 23.80, 'Rack B-04', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(15, 15, 6, 'TEN-2026-B228', '2026-02-26', '2027-09-18', 3000, 1138, 8.75, 'Rack B-05', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(16, 16, 7, 'COR-2026-B236', '2026-04-26', '2028-08-04', 3000, 1266, 29.40, 'Rack B-06', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(17, 17, 8, 'CRE-2026-B907', '2026-02-26', '2028-04-21', 3000, 2323, 66.50, 'Rack B-07', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(18, 18, 9, 'LAS-2026-B310', '2026-05-26', '2027-12-03', 3000, 1986, 7.00, 'Rack B-08', 'available', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(19, 19, 10, 'DIO-2026-B719', '2026-06-26', '2028-06-11', 3000, 1373, 47.60, 'Rack B-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(20, 20, 1, 'CAR-2026-B313', '2026-04-26', '2027-05-13', 3000, 1055, 20.30, 'Rack B-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(21, 21, 3, 'PAN-2026-B228', '2026-03-26', '2028-06-17', 3000, 2263, 3.50, 'Rack C-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(22, 22, 4, 'NUR-2026-B525', '2026-07-26', '2027-09-03', 3000, 1674, 9.80, 'Rack C-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(23, 23, 5, 'VOL-2026-B197', '2026-05-26', '2027-06-17', 3000, 1327, 17.50, 'Rack C-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(24, 24, 6, 'CEL-2026-B893', '2026-03-26', '2027-07-20', 3000, 1859, 77.00, 'Rack C-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(25, 25, 7, 'TRA-2026-B487', '2026-04-26', '2026-12-05', 3000, 2146, 31.50, 'Rack C-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(26, 26, 8, 'ARC-2026-B743', '2026-06-26', '2027-10-29', 3000, 2369, 98.00, 'Rack C-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(27, 27, 9, 'PON-2026-B189', '2026-04-26', '2027-04-03', 3000, 824, 14.00, 'Rack C-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(28, 28, 10, 'FEL-2026-B607', '2026-04-26', '2028-05-19', 3000, 1745, 21.00, 'Rack C-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(29, 29, 1, 'ALE-2026-B461', '2026-04-26', '2027-08-18', 3000, 1238, 19.60, 'Rack C-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(30, 30, 2, 'CAT-2026-B606', '2026-06-26', '2028-03-03', 3000, 1367, 22.40, 'Rack C-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(31, 31, 4, 'VEN-2026-B940', '2026-05-26', '2028-01-09', 3000, 2379, 455.00, 'Rack D-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(32, 32, 5, 'SER-2026-B161', '2026-06-26', '2027-10-03', 3000, 2268, 1680.00, 'Rack D-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(33, 33, 6, 'SIN-2026-B157', '2026-06-26', '2028-06-20', 3000, 2102, 66.50, 'Rack D-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(34, 34, 7, 'SPI-2026-B584', '2026-02-26', '2028-03-08', 3000, 2405, 2170.00, 'Rack D-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(35, 35, 8, 'TEL-2026-B964', '2026-02-26', '2028-02-16', 3000, 2226, 33.60, 'Rack D-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(36, 36, 9, 'ZYR-2026-B219', '2026-04-26', '2028-04-17', 3000, 1672, 12.60, 'Rack D-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(37, 37, 10, 'CLA-2026-B183', '2026-02-26', '2027-12-11', 3000, 1850, 15.40, 'Rack D-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(38, 38, 1, 'SYM-2026-B907', '2026-02-26', '2027-02-17', 3000, 2464, 1995.00, 'Rack D-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(39, 39, 2, 'PUL-2026-B013', '2026-07-26', '2028-02-07', 3000, 2032, 105.00, 'Rack D-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(40, 40, 3, 'MUC-2026-B297', '2026-04-26', '2028-03-07', 3000, 2443, 224.00, 'Rack D-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(41, 41, 5, 'LOS-2026-B421', '2026-03-26', '2027-05-19', 3000, 2252, 18.20, 'Rack E-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(42, 42, 6, 'NEX-2026-B103', '2026-02-26', '2028-01-11', 3000, 1466, 61.60, 'Rack E-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(43, 43, 7, 'ZAN-2026-B984', '2026-02-26', '2027-03-10', 3000, 1211, 10.50, 'Rack E-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(44, 44, 8, 'GAV-2026-B556', '2026-02-26', '2028-04-01', 3000, 1951, 546.00, 'Rack E-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(45, 45, 9, 'MOT-2026-B126', '2026-07-26', '2027-10-09', 3000, 2451, 9.80, 'Rack E-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(46, 46, 10, 'BUS-2026-B527', '2026-06-26', '2027-02-12', 3000, 1579, 12.60, 'Rack E-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(47, 47, 1, 'DUL-2026-B669', '2026-07-26', '2027-06-16', 3000, 1057, 5.95, 'Rack E-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(48, 48, 2, 'IMO-2026-B997', '2026-07-26', '2027-07-07', 3000, 1036, 15.40, 'Rack E-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(49, 49, 3, 'CRE-2026-B012', '2026-02-26', '2027-12-17', 3000, 1326, 101.50, 'Rack E-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(50, 50, 4, 'PAN-2026-B895', '2026-06-26', '2028-08-14', 3000, 1477, 24.50, 'Rack E-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(51, 51, 6, 'GLU-2026-B530', '2026-02-26', '2027-12-07', 3000, 2051, 11.20, 'Rack F-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(52, 52, 7, 'LAN-2026-B143', '2026-03-26', '2028-02-10', 3000, 994, 1295.00, 'Rack F-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(53, 53, 8, 'NOV-2026-B821', '2026-07-26', '2027-01-02', 3000, 2147, 1365.00, 'Rack F-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(54, 54, 9, 'JAN-2026-B058', '2026-03-26', '2027-07-06', 3000, 1920, 87.50, 'Rack F-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(55, 55, 10, 'AMA-2026-B330', '2026-02-26', '2027-09-29', 3000, 2010, 19.60, 'Rack F-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(56, 56, 1, 'ELT-2026-B472', '2026-05-26', '2028-07-05', 3000, 1525, 8.40, 'Rack F-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(57, 57, 2, 'JAR-2026-B435', '2026-07-26', '2028-03-28', 3000, 1264, 115.50, 'Rack F-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(58, 58, 3, 'FOR-2026-B722', '2026-07-26', '2027-03-20', 3000, 2235, 108.50, 'Rack F-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(59, 59, 4, 'DIA-2026-B303', '2026-07-26', '2027-06-30', 3000, 900, 29.40, 'Rack F-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(60, 60, 5, 'ACT-2026-B619', '2026-05-26', '2028-07-24', 3000, 2053, 26.60, 'Rack F-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(61, 61, 7, 'EPI-2026-B980', '2026-06-26', '2027-01-14', 3000, 2444, 36.40, 'Rack G-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(62, 62, 8, 'TEG-2026-B300', '2026-05-26', '2027-02-11', 3000, 1571, 24.50, 'Rack G-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(63, 63, 9, 'LYR-2026-B768', '2026-03-26', '2027-08-21', 3000, 1927, 68.60, 'Rack G-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(64, 64, 10, 'NEU-2026-B066', '2026-06-26', '2027-10-02', 3000, 2277, 44.80, 'Rack G-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(65, 65, 1, 'SIN-2026-B794', '2026-04-26', '2027-04-01', 3000, 1817, 61.60, 'Rack G-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(66, 66, 2, 'TOP-2026-B028', '2026-03-26', '2028-07-25', 3000, 968, 52.50, 'Rack G-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(67, 67, 3, 'KEP-2026-B062', '2026-06-26', '2028-08-01', 3000, 2433, 91.00, 'Rack G-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(68, 68, 4, 'SER-2026-B132', '2026-02-26', '2027-02-15', 3000, 1027, 80.50, 'Rack G-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(69, 69, 5, 'ZYP-2026-B844', '2026-07-26', '2027-03-18', 3000, 1685, 98.00, 'Rack G-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(70, 70, 6, 'ARI-2026-B761', '2026-06-26', '2028-07-27', 3000, 1143, 129.50, 'Rack G-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(71, 71, 8, 'BET-2026-B890', '2026-02-26', '2027-10-30', 3000, 1018, 168.00, 'Rack H-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(72, 72, 9, 'FUC-2026-B173', '2026-05-26', '2027-01-04', 3000, 1907, 266.00, 'Rack H-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(73, 73, 10, 'DAK-2026-B631', '2026-05-26', '2027-10-11', 3000, 2381, 217.00, 'Rack H-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(74, 74, 1, 'DER-2026-B993', '2026-07-26', '2027-06-26', 3000, 2276, 315.00, 'Rack H-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(75, 75, 2, 'BAC-2026-B255', '2026-06-26', '2028-05-25', 3000, 1088, 364.00, 'Rack H-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(76, 76, 3, 'CAN-2026-B726', '2026-07-26', '2027-01-04', 3000, 1195, 196.00, 'Rack H-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(77, 77, 4, 'ELI-2026-B834', '2026-02-26', '2028-02-26', 3000, 1029, 1295.00, 'Rack H-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(78, 78, 5, 'KEN-2026-B142', '2026-06-26', '2027-10-18', 3000, 1779, 133.00, 'Rack H-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(79, 79, 6, 'SUD-2026-B307', '2026-02-26', '2028-06-17', 3000, 2381, 665.00, 'Rack H-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(80, 80, 7, 'DAI-2026-B842', '2026-05-26', '2028-01-04', 3000, 2053, 1155.00, 'Rack H-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(81, 81, 9, 'XAL-2026-B694', '2026-07-26', '2028-03-31', 3000, 2060, 1015.00, 'Rack A-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(82, 82, 10, 'TOB-2026-B838', '2026-06-26', '2028-06-01', 3000, 2115, 406.00, 'Rack A-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(83, 83, 1, 'VIG-2026-B974', '2026-03-26', '2028-04-11', 3000, 2488, 504.00, 'Rack A-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(84, 84, 2, 'SYS-2026-B666', '2026-07-26', '2027-05-15', 3000, 1241, 623.00, 'Rack A-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(85, 85, 3, 'COS-2026-B275', '2026-03-26', '2027-10-28', 3000, 1945, 875.00, 'Rack A-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(86, 86, 4, 'PAT-2026-B780', '2026-07-26', '2026-12-20', 3000, 1381, 448.00, 'Rack A-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(87, 87, 5, 'OTR-2026-B201', '2026-04-26', '2028-02-05', 3000, 2076, 126.00, 'Rack A-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(88, 88, 6, 'SOF-2026-B241', '2026-03-26', '2027-06-09', 3000, 860, 287.00, 'Rack A-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(89, 89, 7, 'CIP-2026-B690', '2026-07-26', '2027-01-28', 3000, 1351, 84.00, 'Rack A-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(90, 90, 8, 'REF-2026-B702', '2026-02-26', '2027-11-24', 3000, 1340, 364.00, 'Rack A-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(91, 91, 10, 'TAM-2026-B969', '2026-02-26', '2027-05-03', 3000, 1967, 45.50, 'Rack B-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(92, 92, 1, 'MET-2026-B658', '2026-05-26', '2027-02-22', 3000, 1524, 19.60, 'Rack B-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(93, 93, 2, 'NEO-2026-B535', '2026-04-26', '2028-04-08', 3000, 1708, 266.00, 'Rack B-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(94, 94, 3, 'CEL-2026-B978', '2026-05-26', '2028-03-12', 3000, 1638, 203.00, 'Rack B-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(95, 95, 4, 'IMU-2026-B285', '2026-07-26', '2027-10-17', 3000, 1074, 59.50, 'Rack B-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(96, 96, 5, 'FEM-2026-B567', '2026-03-26', '2028-03-29', 3000, 2061, 168.00, 'Rack B-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(97, 97, 6, 'CAS-2026-B169', '2026-05-26', '2028-06-30', 3000, 841, 217.00, 'Rack B-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(98, 98, 7, 'TAR-2026-B148', '2026-03-26', '2028-06-19', 3000, 1054, 1960.00, 'Rack B-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(99, 99, 8, 'GLE-2026-B197', '2026-03-26', '2026-12-09', 3000, 1657, 1365.00, 'Rack B-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(100, 100, 9, 'PRO-2026-B828', '2026-02-26', '2027-06-24', 3000, 852, 315.00, 'Rack B-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(101, 101, 1, 'ENG-2026-B041', '2026-06-26', '2027-08-28', 3000, 2001, 875.00, 'Rack C-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(102, 102, 2, 'MMR-2026-B667', '2026-06-26', '2027-04-21', 3000, 2432, 1295.00, 'Rack C-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(103, 103, 3, 'VER-2026-B250', '2026-05-26', '2027-01-09', 3000, 2207, 1470.00, 'Rack C-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(104, 104, 4, 'VAX-2026-B725', '2026-07-26', '2027-07-15', 3000, 1573, 1365.00, 'Rack C-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(105, 105, 5, 'GAR-2026-B605', '2026-02-26', '2028-06-05', 3000, 2099, 5950.00, 'Rack C-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(106, 106, 6, 'PRE-2026-B242', '2026-04-26', '2027-02-07', 3000, 1146, 4480.00, 'Rack C-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(107, 107, 7, 'BCG-2026-B945', '2026-07-26', '2027-12-17', 3000, 1275, 315.00, 'Rack C-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(108, 108, 8, 'INF-2026-B638', '2026-02-26', '2027-11-14', 3000, 2032, 3640.00, 'Rack C-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(109, 109, 9, 'ROT-2026-B781', '2026-07-26', '2027-12-18', 3000, 2341, 2170.00, 'Rack C-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(110, 110, 10, 'HUM-2026-B649', '2026-07-26', '2028-02-10', 3000, 1288, 17150.00, 'Rack C-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(111, 111, 2, 'NEU-2026-B153', '2026-07-26', '2026-11-27', 3000, 2271, 8.40, 'Rack D-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(112, 112, 3, 'CAL-2026-B785', '2026-05-26', '2028-01-23', 3000, 1748, 19.60, 'Rack D-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(113, 113, 4, 'SAN-2026-B651', '2026-05-26', '2028-02-04', 3000, 1961, 15.40, 'Rack D-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(114, 114, 5, 'RED-2026-B668', '2026-06-26', '2028-02-19', 3000, 1083, 31.50, 'Rack D-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(115, 115, 6, 'REV-2026-B232', '2026-03-26', '2028-03-28', 3000, 2141, 77.00, 'Rack D-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(116, 116, 7, 'OST-2026-B546', '2026-05-26', '2027-09-10', 3000, 2321, 26.60, 'Rack D-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(117, 117, 8, 'IBE-2026-B100', '2026-07-26', '2028-02-10', 3000, 1538, 29.40, 'Rack D-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(118, 118, 9, 'EVI-2026-B940', '2026-06-26', '2028-02-17', 3000, 900, 11.20, 'Rack D-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(119, 119, 10, 'SEV-2026-B474', '2026-03-26', '2027-03-26', 3000, 1244, 21.00, 'Rack D-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(120, 120, 1, 'BEC-2026-B457', '2026-03-26', '2027-05-28', 3000, 2050, 9.80, 'Rack D-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(121, 121, 3, 'MAR-2026-B973', '2026-03-26', '2028-08-12', 3000, 1799, 12.60, 'Rack E-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(122, 122, 4, 'CLE-2026-B168', '2026-03-26', '2028-07-16', 3000, 2042, 686.00, 'Rack E-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(123, 123, 5, 'XAR-2026-B635', '2026-03-26', '2027-04-15', 3000, 1932, 182.00, 'Rack E-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(124, 124, 6, 'ELI-2026-B187', '2026-07-26', '2027-12-11', 3000, 1323, 168.00, 'Rack E-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(125, 125, 7, 'PLA-2026-B693', '2026-05-26', '2028-01-29', 3000, 968, 38.50, 'Rack E-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(126, 126, 8, 'TRA-2026-B992', '2026-05-26', '2028-03-21', 3000, 1562, 22.40, 'Rack E-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(127, 127, 9, 'PRA-2026-B081', '2026-03-26', '2028-03-05', 3000, 1134, 147.00, 'Rack E-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(128, 128, 10, 'BRI-2026-B075', '2026-02-26', '2028-05-03', 3000, 1988, 136.50, 'Rack E-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(129, 129, 1, 'HEP-2026-B735', '2026-05-26', '2028-04-04', 3000, 1740, 294.00, 'Rack E-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(130, 130, 2, 'VIT-2026-B385', '2026-07-26', '2027-04-13', 3000, 928, 59.50, 'Rack E-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(131, 131, 4, 'DUP-2026-B854', '2026-04-26', '2027-11-23', 3000, 1600, 77.00, 'Rack F-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(132, 132, 5, 'YAS-2026-B973', '2026-02-26', '2026-12-29', 3000, 891, 1015.00, 'Rack F-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(133, 133, 6, 'CLO-2026-B334', '2026-04-26', '2027-12-23', 3000, 1571, 47.60, 'Rack F-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(134, 134, 7, 'CYC-2026-B359', '2026-07-26', '2028-04-15', 3000, 2398, 129.50, 'Rack F-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(135, 135, 8, 'PRI-2026-B430', '2026-07-26', '2027-01-13', 3000, 1978, 16.80, 'Rack F-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(136, 136, 9, 'MIC-2026-B254', '2026-05-26', '2028-05-29', 3000, 857, 245.00, 'Rack F-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(137, 137, 10, 'VAG-2026-B591', '2026-05-26', '2028-06-24', 3000, 968, 315.00, 'Rack F-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(138, 138, 1, 'CAN-2026-B430', '2026-06-26', '2028-06-01', 3000, 1818, 364.00, 'Rack F-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(139, 139, 2, 'POS-2026-B318', '2026-03-26', '2027-07-20', 3000, 1715, 196.00, 'Rack F-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(140, 140, 3, 'CYT-2026-B945', '2026-05-26', '2026-12-13', 3000, 1181, 66.50, 'Rack F-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(141, 141, 5, 'HAR-2026-B074', '2026-05-26', '2027-04-28', 3000, 2468, 40.60, 'Rack G-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(142, 142, 6, 'AVO-2026-B589', '2026-06-26', '2026-12-10', 3000, 1909, 101.50, 'Rack G-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(143, 143, 7, 'PRO-2026-B652', '2026-06-26', '2027-12-17', 3000, 2098, 61.60, 'Rack G-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(144, 144, 8, 'REN-2026-B507', '2026-04-26', '2028-05-24', 3000, 1215, 22.40, 'Rack G-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(145, 145, 9, 'URI-2026-B702', '2026-06-26', '2028-04-01', 3000, 2113, 29.40, 'Rack G-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(146, 146, 10, 'BET-2026-B413', '2026-06-26', '2027-05-03', 3000, 2481, 147.00, 'Rack G-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(147, 147, 1, 'VES-2026-B927', '2026-04-26', '2027-02-01', 3000, 2103, 115.50, 'Rack G-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(148, 148, 2, 'CIA-2026-B328', '2026-02-26', '2027-08-10', 3000, 1948, 238.00, 'Rack G-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(149, 149, 3, 'NEP-2026-B188', '2026-07-26', '2028-05-02', 3000, 1620, 1015.00, 'Rack G-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(150, 150, 4, 'URO-2026-B206', '2026-07-26', '2027-06-09', 3000, 2368, 31.50, 'Rack G-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(151, 151, 6, 'XYL-2026-B766', '2026-03-26', '2028-02-27', 3000, 1434, 84.00, 'Rack H-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(152, 152, 7, 'PRO-2026-B542', '2026-06-26', '2027-01-11', 3000, 1835, 336.00, 'Rack H-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(153, 153, 8, 'MAR-2026-B173', '2026-02-26', '2027-06-29', 3000, 1710, 175.00, 'Rack H-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(154, 154, 9, 'ESM-2026-B324', '2026-06-26', '2028-01-03', 3000, 986, 434.00, 'Rack H-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(155, 155, 10, 'KET-2026-B878', '2026-05-26', '2027-03-01', 3000, 2289, 266.00, 'Rack H-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(156, 156, 1, 'MID-2026-B835', '2026-06-26', '2028-03-06', 3000, 2437, 98.00, 'Rack H-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(157, 157, 2, 'SEV-2026-B821', '2026-07-26', '2027-02-14', 3000, 2483, 6230.00, 'Rack H-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(158, 158, 3, 'NEO-2026-B041', '2026-06-26', '2027-12-10', 3000, 2010, 45.50, 'Rack H-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(159, 159, 4, 'ANE-2026-B943', '2026-02-26', '2027-12-18', 3000, 1706, 126.00, 'Rack H-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(160, 160, 5, 'NIM-2026-B401', '2026-06-26', '2027-04-28', 3000, 2006, 518.00, 'Rack H-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(161, 161, 7, 'ZOV-2026-B631', '2026-07-26', '2028-07-19', 3000, 1105, 26.60, 'Rack A-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(162, 162, 8, 'TAM-2026-B559', '2026-05-26', '2027-04-12', 3000, 2236, 315.00, 'Rack A-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(163, 163, 9, 'VAL-2026-B420', '2026-04-26', '2027-06-11', 3000, 1975, 196.00, 'Rack A-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(164, 164, 10, 'BAR-2026-B870', '2026-07-26', '2027-11-12', 3000, 1183, 238.00, 'Rack A-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(165, 165, 1, 'VIR-2026-B766', '2026-07-26', '2027-03-20', 3000, 827, 203.00, 'Rack A-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(166, 166, 2, 'EPI-2026-B572', '2026-02-26', '2027-03-12', 3000, 2298, 59.50, 'Rack A-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(167, 167, 3, 'ISE-2026-B679', '2026-07-26', '2027-03-23', 3000, 977, 840.00, 'Rack A-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(168, 168, 4, 'BIK-2026-B520', '2026-07-26', '2027-02-15', 3000, 1024, 2450.00, 'Rack A-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(169, 169, 5, 'SOV-2026-B371', '2026-03-26', '2027-11-26', 3000, 1930, 2940.00, 'Rack A-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(170, 170, 6, 'PAX-2026-B628', '2026-02-26', '2027-07-02', 3000, 1685, 3360.00, 'Rack A-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(171, 171, 8, 'XAN-2026-B070', '2026-05-26', '2027-04-25', 3000, 1178, 15.40, 'Rack B-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(172, 172, 9, 'VAL-2026-B279', '2026-02-26', '2028-06-14', 3000, 1444, 8.40, 'Rack B-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(173, 173, 10, 'ATI-2026-B581', '2026-06-26', '2027-03-14', 3000, 929, 12.60, 'Rack B-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(174, 174, 1, 'LEX-2026-B395', '2026-06-26', '2028-07-27', 3000, 1762, 45.50, 'Rack B-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(175, 175, 2, 'ZOL-2026-B759', '2026-05-26', '2027-09-12', 3000, 1965, 40.60, 'Rack B-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(176, 176, 3, 'PRO-2026-B936', '2026-02-26', '2027-10-01', 3000, 1064, 29.40, 'Rack B-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(177, 177, 4, 'RIV-2026-B496', '2026-05-26', '2027-08-16', 3000, 2010, 19.60, 'Rack B-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(178, 178, 5, 'EFF-2026-B814', '2026-04-26', '2028-03-21', 3000, 1915, 66.50, 'Rack B-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(179, 179, 6, 'CYM-2026-B668', '2026-04-26', '2027-04-15', 3000, 1705, 77.00, 'Rack B-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(180, 180, 7, 'RIS-2026-B965', '2026-02-26', '2028-07-29', 3000, 1744, 57.40, 'Rack B-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(181, 181, 9, 'NAS-2026-B390', '2026-02-26', '2027-04-14', 3000, 1860, 595.00, 'Rack C-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(182, 182, 10, 'FLI-2026-B797', '2026-02-26', '2027-12-05', 3000, 2447, 546.00, 'Rack C-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(183, 183, 1, 'OTR-2026-B288', '2026-06-26', '2027-06-03', 3000, 2265, 154.00, 'Rack C-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(184, 184, 2, 'DYM-2026-B965', '2026-05-26', '2028-02-23', 3000, 1110, 1015.00, 'Rack C-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(185, 185, 3, 'SIN-2026-B248', '2026-05-26', '2027-08-14', 3000, 1314, 31.50, 'Rack C-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(186, 186, 4, 'SUD-2026-B164', '2026-02-26', '2027-03-02', 3000, 1302, 19.60, 'Rack C-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(187, 187, 5, 'CHL-2026-B359', '2026-05-26', '2027-07-16', 3000, 2016, 4.20, 'Rack C-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(188, 188, 6, 'ACT-2026-B569', '2026-05-26', '2027-11-18', 3000, 2299, 266.00, 'Rack C-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(189, 189, 7, 'LOC-2026-B927', '2026-07-26', '2028-03-18', 3000, 1436, 343.00, 'Rack C-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(190, 190, 8, 'BEC-2026-B198', '2026-05-26', '2028-01-21', 3000, 1001, 434.00, 'Rack C-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(191, 191, 10, 'CAL-2026-B196', '2026-02-26', '2028-07-21', 3000, 1495, 196.00, 'Rack D-01', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(192, 192, 1, 'PED-2026-B876', '2026-06-26', '2027-10-25', 3000, 1751, 245.00, 'Rack D-02', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(193, 193, 2, 'BON-2026-B749', '2026-02-26', '2027-08-07', 3000, 2082, 168.00, 'Rack D-03', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(194, 194, 3, 'AMO-2026-B927', '2026-03-26', '2028-04-13', 3000, 959, 224.00, 'Rack D-04', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(195, 195, 4, 'VEN-2026-B328', '2026-05-26', '2027-07-10', 3000, 2171, 182.00, 'Rack D-05', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(196, 196, 5, 'ZYR-2026-B766', '2026-05-26', '2027-09-27', 3000, 2379, 287.00, 'Rack D-06', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(197, 197, 6, 'AUG-2026-B910', '2026-07-26', '2027-12-06', 3000, 1134, 476.00, 'Rack D-07', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(198, 198, 7, 'ADV-2026-B382', '2026-03-26', '2027-02-24', 3000, 2157, 315.00, 'Rack D-08', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(199, 199, 8, 'INF-2026-B921', '2026-03-26', '2027-05-31', 3000, 828, 364.00, 'Rack D-09', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(200, 200, 9, 'NUT-2026-B536', '2026-05-26', '2028-01-27', 3000, 1209, 2660.00, 'Rack D-10', 'available', '2026-08-26 06:17:55', '2026-08-26 06:17:55');

-- --------------------------------------------------------

--
-- Table structure for table `medicine_categories`
--

CREATE TABLE `medicine_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicine_categories`
--

INSERT INTO `medicine_categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Antibiotics & Antimicrobials', 'Antimicrobial prescription medications & broad-spectrum agents', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(2, 'Cardiovascular & Antihypertensives', 'Blood pressure, lipid-lowering, and cardiac management drugs', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(3, 'Analgesics & Anti-inflammatories', 'Pain management, NSAIDs, and antipyretics', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(4, 'Respiratory & Bronchodilators', 'Asthma inhalers, antihistamines, and COPD treatments', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(5, 'Gastrointestinal & Antacids', 'Proton pump inhibitors, antiulcer agents, and digestive care', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(6, 'Endocrine & Antidiabetics', 'Insulin, oral hypoglycemic agents, and thyroid hormone therapy', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(7, 'Central Nervous System (CNS)', 'Anticonvulsants, sedatives, antidepressants, and neurotherapeutics', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(8, 'Dermatological & Topical Agents', 'Medicated ointments, anti-fungals, and wound healing care', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(9, 'Ophthalmic & Otic Preparations', 'Sterile eye drops, ear drops, and ocular anti-infectives', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(10, 'Oncology & Immunosuppressants', 'Chemotherapeutic agents and targeted immunosuppressive biologicals', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(11, 'Vaccines & Cold-Chain Biologics', 'Cold-chain vaccines, immunoglobulins, and biological serums', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(12, 'Nutritional & Vitamin Supplements', 'Multivitamins, mineral supplements, and hematinics', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(13, 'Anticoagulants & Hemostatics', 'Blood thinners, antiplatelet agents, and coagulation factors', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(14, 'Obstetrics & Gynecological Care', 'Maternal care, hormonal therapies, and contraceptives', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(15, 'Urological & Renal Care', 'Diuretics, BPH treatments, and urinary tract antiseptics', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(16, 'Anesthetics & Surgical Blockers', 'Local and general anesthetics for surgical procedures', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(17, 'Antiviral & Antiretroviral Therapies', 'Antiviral agents, HIV therapies, and systemic infection management', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(18, 'Psychiatric & Anti-anxiety Agents', 'Anxiolytics, mood stabilizers, and antipsychotic therapeutics', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(19, 'ENT & Allergy Medications', 'Nasal decongestants, antihistamine sprays, and otolaryngology care', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(20, 'Pediatric & Neonatal Formulations', 'Child-friendly liquid suspensions, drops, and pediatric care', '2026-08-26 06:17:54', '2026-08-26 06:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_18_000001_create_roles_table', 1),
(5, '2026_08_18_000002_create_permissions_table', 1),
(6, '2026_08_18_000003_create_role_permissions_table', 1),
(7, '2026_08_18_000004_update_users_table', 1),
(8, '2026_08_18_000005_create_departments_table', 1),
(9, '2026_08_18_000006_create_staff_table', 1),
(10, '2026_08_18_000007_create_patients_table', 1),
(11, '2026_08_18_000008_create_medicine_categories_table', 1),
(12, '2026_08_18_000009_create_suppliers_table', 1),
(13, '2026_08_18_000010_create_medicines_table', 1),
(14, '2026_08_18_000011_create_medicine_batches_table', 1),
(15, '2026_08_18_000012_create_inventory_transactions_table', 1),
(16, '2026_08_18_000013_create_appointments_table', 1),
(17, '2026_08_18_000014_create_prescriptions_table', 1),
(18, '2026_08_18_000015_create_prescription_items_table', 1),
(19, '2026_08_18_000016_create_ai_inventory_insights_table', 1),
(20, '2026_08_18_000017_create_ai_symptom_triage_logs_table', 1),
(21, '2026_08_18_000018_create_audit_logs_table', 1),
(22, '2026_08_18_000019_add_otp_fields_to_users_table', 1),
(23, '2026_08_18_042352_create_personal_access_tokens_table', 1),
(24, '2026_08_24_000020_create_cold_chain_table', 1),
(25, '2026_08_24_000021_create_stock_condemnations_table', 1),
(26, '2026_08_24_000022_create_purchase_orders_table', 1),
(27, '2026_08_24_000023_create_icd_codes_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_code` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `nic_passport` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(255) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `medical_history` text DEFAULT NULL,
  `status` enum('active','archived','deceased') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `patient_code`, `first_name`, `last_name`, `dob`, `gender`, `nic_passport`, `phone`, `email`, `blood_group`, `emergency_contact_name`, `emergency_contact_phone`, `allergies`, `medical_history`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PAT-2026-001', 'Eleanor', 'Vance', '1992-04-14', 'Female', '199264501988', '+94 70 555 1212', NULL, 'O+', 'Robert Vance (Spouse)', '+94 77 111 2233', 'Penicillin, Sulfa drugs', 'Hypertension (3 yrs), Mild asthma', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(2, 'PAT-2026-002', 'Marcus', 'Holloway', '1981-11-22', 'Male', '198132109844', '+94 76 888 3434', NULL, 'A+', 'Sarah Holloway (Sister)', '+94 71 999 4455', 'None reported', 'Post-op Knee Surgery', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(3, 'PAT-2026-003', 'Dr. Nimal', 'De Silva', '1968-07-09', 'Male', '196819102833', '+94 77 345 6789', NULL, 'B+', 'Sunethra De Silva (Wife)', '+94 77 444 5566', 'Aspirin, NSAIDs', 'Type 2 Diabetes Mellitus, CAD', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(4, 'PAT-2026-004', 'Kavindi', 'Wickramasinghe', '1998-02-19', 'Female', '199855104920', '+94 71 234 8901', NULL, 'AB+', 'Nimali Wickramasinghe (Mother)', '+94 70 888 7766', 'Latex, Amoxicillin', 'Allergic Rhinitis, Chronic Migraine', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(5, 'PAT-2026-005', 'Sanath', 'Jayawardena', '1975-09-30', 'Male', '197527301944', '+94 75 999 1122', NULL, 'O-', 'Chamari Jayawardena (Wife)', '+94 76 222 3344', 'Ciprofloxacin', 'Chronic Kidney Disease Stage 2, Gout', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(6, 'PAT-2026-006', 'Dilani', 'Perera', '2001-12-05', 'Female', '200184002931', '+94 78 444 5566', NULL, 'A-', 'Kusal Perera (Brother)', '+94 72 333 4455', 'Shellfish, Iodine Contrast', 'Hypothyroidism, Iron Deficiency Anemia', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(7, 'PAT-2026-007', 'Tariq', 'Ahamed', '1989-05-18', 'Male', '198913904812', '+94 72 666 7788', NULL, 'B-', 'Fatima Ahamed (Wife)', '+94 75 777 8899', 'Metronidazole', 'GERD (Acid Reflux), Peptic Ulcer Disease', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(8, 'PAT-2026-008', 'Samantha', 'Ratnayake', '1963-03-25', 'Female', '196358401923', '+94 77 888 9900', NULL, 'AB-', 'Anura Ratnayake (Son)', '+94 77 666 5544', 'Codeine, Tramadol', 'Osteoarthritis, Osteoporosis', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(9, 'PAT-2026-009', 'Dhanushka', 'Mendis', '1994-08-11', 'Male', '199422305819', '+94 76 123 7890', NULL, 'O+', 'Kasun Mendis (Brother)', '+94 71 555 6677', 'Cephalexin', 'Bronchial Asthma, Atopic Dermatitis', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(10, 'PAT-2026-010', 'Ayesha Rashmi', 'Cooray', '2003-06-30', 'Female', '200368102945', '+94 70 333 4455', NULL, 'A+', 'Kamal Cooray (Father)', '+94 70 222 3344', 'Peanuts, Erythromycin', 'PCOS, Dysmenorrhea', 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `display_name`, `module`, `created_at`, `updated_at`) VALUES
(1, 'inventory.manage', 'Manage Medicine Inventory & Stock', 'inventory', NULL, NULL),
(2, 'prescriptions.issue', 'Issue Electronic Prescriptions', 'clinical', NULL, NULL),
(3, 'ai.analytics', 'Access AI Expiry & FEFO Risk Intelligence', 'ai', NULL, NULL),
(4, 'users.manage', 'Manage System Users & Roles', 'security', NULL, NULL),
(5, 'roles.manage', 'Configure System Roles & Access Matrix', 'security', NULL, NULL),
(6, 'patients.view', 'View Patient Health Records (EHR)', 'clinical', NULL, NULL),
(7, 'patients.create', 'Register & Edit Patient Records', 'patients', NULL, NULL),
(8, 'appointments.manage', 'Schedule & Manage Appointments', 'clinical', NULL, NULL),
(9, 'medicines.manage', 'Manage Medicine Formulary Catalog', 'inventory', NULL, NULL),
(10, 'batches.manage', 'Intake & Manage FEFO Batches', 'inventory', NULL, NULL),
(11, 'suppliers.manage', 'Manage Pharmaceutical Suppliers', 'inventory', NULL, NULL),
(12, 'ai.triage', 'Access Groq AI Symptom Triage', 'ai', NULL, NULL),
(13, 'departments.manage', 'Manage Hospital Departments & Wards', 'security', NULL, NULL),
(14, 'reports.export', 'Export Executive Clinical Reports', 'security', NULL, NULL),
(15, 'appointments.view', 'View Clinical Appointments', 'clinical', NULL, NULL),
(16, 'prescriptions.view', 'View Electronic Prescriptions', 'clinical', NULL, NULL),
(17, 'patients.manage', 'Register & Manage Patient EHR', 'clinical', NULL, NULL),
(18, 'inventory.view', 'View Medicine Formulary & Categories', 'inventory', NULL, NULL),
(19, 'batches.view', 'View FEFO Stock Batches', 'inventory', NULL, NULL),
(20, 'transactions.view', 'View Stock Intake & Dispensing Logs', 'inventory', NULL, NULL),
(21, 'ai.override', 'Clinician AI Recommendation Override', 'ai', NULL, NULL),
(22, 'staff.manage', 'Manage Medical Staff Roster', 'security', NULL, NULL),
(23, 'matrix.manage', 'Manage Role-Permissions Access Matrix', 'security', NULL, NULL),
(24, 'audit.view', 'View System Audit Ledger Logs', 'security', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `prescription_code` varchar(255) NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('DRAFT','ISSUED','DISPENSED','CANCELLED') NOT NULL DEFAULT 'ISSUED',
  `clinical_notes` text DEFAULT NULL,
  `issued_at` timestamp NULL DEFAULT NULL,
  `dispensed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `prescription_code`, `patient_id`, `doctor_id`, `appointment_id`, `status`, `clinical_notes`, `issued_at`, `dispensed_at`, `created_at`, `updated_at`) VALUES
(1, 'RX-2026-9901', 1, 2, 1, 'ISSUED', 'Take Atorvastatin daily at bedtime. Avoid high sodium foods.', '2026-08-26 06:17:55', NULL, '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(2, 'RX-2026-9138', 1, 2, 1, 'ISSUED', 'Prescription issued following Consultation appointment on 2026-08-26 13:47:55. Reason: Hypertension follow-up & chest pain review.', '2026-08-26 06:59:18', NULL, '2026-08-26 06:59:18', '2026-08-26 06:59:18'),
(3, 'RX-2026-9182', 1, 2, 1, 'ISSUED', 'Prescription issued following Consultation appointment on 2026-08-26 13:47:55. Reason: Hypertension follow-up & chest pain review.', '2026-08-26 06:59:55', NULL, '2026-08-26 06:59:55', '2026-08-26 06:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `prescription_items`
--

CREATE TABLE `prescription_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `prescription_id` bigint(20) UNSIGNED NOT NULL,
  `medicine_id` bigint(20) UNSIGNED NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `frequency` varchar(255) NOT NULL,
  `duration_days` int(11) NOT NULL DEFAULT 7,
  `quantity_prescribed` int(11) NOT NULL,
  `quantity_dispensed` int(11) NOT NULL DEFAULT 0,
  `instructions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prescription_items`
--

INSERT INTO `prescription_items` (`id`, `prescription_id`, `medicine_id`, `dosage`, `frequency`, `duration_days`, `quantity_prescribed`, `quantity_dispensed`, `instructions`, `created_at`, `updated_at`) VALUES
(1, 1, 11, '20mg', 'Once daily (HS)', 30, 30, 0, 'Take 1 tablet at night after dinner', '2026-08-26 06:17:55', '2026-08-26 06:17:55'),
(2, 2, 200, '500mg', 'BD - Twice daily', 7, 14, 0, 'Take after meals as prescribed', '2026-08-26 06:59:18', '2026-08-26 06:59:18'),
(3, 2, 182, '500mg', 'BD - Twice daily', 7, 14, 0, 'Take with water after meals', '2026-08-26 06:59:18', '2026-08-26 06:59:18'),
(4, 3, 200, '500mg', 'BD - Twice daily', 7, 14, 0, 'Take after meals as prescribed', '2026-08-26 06:59:55', '2026-08-26 06:59:55'),
(5, 3, 185, '500mg', 'BD - Twice daily', 7, 14, 0, 'Take with water after meals', '2026-08-26 06:59:55', '2026-08-26 06:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `po_number` varchar(255) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `medicine_id` bigint(20) UNSIGNED NOT NULL,
  `requested_quantity` int(11) NOT NULL,
  `estimated_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `supplier_email` varchar(255) NOT NULL,
  `status` enum('DRAFT','SENT_TO_SUPPLIER','DELIVERED','CANCELLED') NOT NULL DEFAULT 'SENT_TO_SUPPLIER',
  `triggered_by` varchar(255) NOT NULL DEFAULT 'AUTOMATED_LOW_STOCK_REORDER',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `po_number`, `supplier_id`, `medicine_id`, `requested_quantity`, `estimated_cost`, `supplier_email`, `status`, `triggered_by`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'PO-2026-8801', 1, 1, 1000, 45000.00, 'procurement@pharmanet.lk', 'SENT_TO_SUPPLIER', 'AUTOMATED_LOW_STOCK_THRESHOLD_ENGINE', 'Auto-triggered purchase order for Amoxil 500mg as stock reached low-stock threshold (240 units). Dispatched to procurement@pharmanet.lk.', '2026-08-26 04:17:55', '2026-08-26 04:17:55');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 'Super Administrator', 'Full administrative control over MediSync platform', '2026-08-26 06:17:53', '2026-08-26 06:17:53'),
(2, 'pharmacist', 'Chief Pharmacist', 'Manages inventory, FEFO batch tracking, and dispensing', '2026-08-26 06:17:53', '2026-08-26 06:17:53'),
(3, 'doctor', 'Medical Officer / Doctor', 'Prescribes medications and conducts patient consultations', '2026-08-26 06:17:53', '2026-08-26 06:17:53'),
(4, 'nurse', 'Staff Nurse / Ward Care Officer', 'Patient intake, OPD clinic check-ins, and ward bed capacity tracking', '2026-08-26 06:17:53', '2026-08-26 06:17:53');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(2, 1),
(2, 3),
(2, 9),
(2, 10),
(2, 11),
(2, 14),
(2, 16),
(2, 18),
(2, 19),
(2, 20),
(3, 2),
(3, 6),
(3, 7),
(3, 8),
(3, 12),
(3, 15),
(3, 16),
(3, 17),
(3, 18),
(3, 21),
(4, 6),
(4, 7),
(4, 8),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(4, 15),
(4, 17);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_code` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` enum('on_duty','off_duty','on_leave') NOT NULL DEFAULT 'on_duty',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `user_id`, `department_id`, `employee_code`, `first_name`, `last_name`, `specialization`, `license_number`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'EMP-PHARM-102', 'Sarah', 'Jenkins', 'Chief Pharmacist & FEFO Specialist', 'SLMC-PH-4421', '+94 77 444 5566', 'on_duty', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(2, 3, 2, 'EMP-DOC-101', 'Aris', 'Thorne', 'Senior Cardiologist', 'SLMC-98712', '+94 71 987 6543', 'on_duty', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(3, 5, 3, 'EMP-NURSE-103', 'Clara', 'Barton', 'Ward Lead & OPD Intake Nurse', 'SLMC-NR-8819', '+94 71 333 8899', 'on_duty', '2026-08-26 06:17:54', '2026-08-26 06:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `stock_condemnations`
--

CREATE TABLE `stock_condemnations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `condemnation_code` varchar(255) NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `quantity_condemned` int(11) NOT NULL,
  `reason` enum('EXPIRED','DAMAGED','CONTAMINATED','STORAGE_BREACH','RECALLED') NOT NULL DEFAULT 'EXPIRED',
  `disposal_method` varchar(255) NOT NULL DEFAULT 'Incineration',
  `witnessed_by` varchar(255) NOT NULL DEFAULT 'Chief Pharmacist & Compliance Officer',
  `certificate_hash` varchar(255) DEFAULT NULL,
  `condemned_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('PENDING_APPROVAL','CONDEMNED_DESTROYED') NOT NULL DEFAULT 'CONDEMNED_DESTROYED',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_condemnations`
--

INSERT INTO `stock_condemnations` (`id`, `condemnation_code`, `batch_id`, `quantity_condemned`, `reason`, `disposal_method`, `witnessed_by`, `certificate_hash`, `condemned_by_user_id`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'CND-2026-1088', 1, 240, 'EXPIRED', 'Incineration', 'Chief Pharmacist & Compliance Auditor', '161c19cd7ac2233a923348ba04df14f07ef1179d86843fc5cd875cb74e63a8c3', 1, 'CONDEMNED_DESTROYED', 'Decommissioned expired batch AMX-2025-EXP14D. Formal destruction certificate issued.', '2026-08-26 05:17:55', '2026-08-26 05:17:55');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `supplier_code` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `lead_time_days` int(11) NOT NULL DEFAULT 7,
  `rating` decimal(3,2) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `company_name`, `supplier_code`, `contact_person`, `email`, `phone`, `address`, `lead_time_days`, `rating`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PharmaCare Lanka Distributors', 'SUP-LK-001', 'Kamal Perera', 'sales@pharmacare.lk', '+94 11 234 5678', '45 Colombo Road, Galle', 3, 4.90, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(2, 'BioMed Global Healthcare Ltd', 'SUP-LK-002', 'Dr. Anusha Silva', 'orders@biomedglobal.com', '+94 11 456 7890', '120 Kandy Road, Kiribathgoda, Colombo', 4, 4.80, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(3, 'Apex Cold-Chain Logistics & Vaccines', 'SUP-LK-003', 'Rohan Jayasinghe', 'procurement@apexcoldchain.lk', '+94 11 789 0123', '88 Port Access Highway, Kelaniya', 2, 4.95, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(4, 'Lanka Surgimed Supplies Corp', 'SUP-LK-004', 'Nimali Fernando', 'support@surgimed.lk', '+94 11 345 6789', '15 Bauddhaloka Mawatha, Colombo 07', 5, 4.70, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(5, 'MediTech Asia-Pacific Pharmaceuticals', 'SUP-LK-005', 'David Chen', 'contact@meditech-asia.sg', '+94 11 890 1234', '300 Galle Road, Kollupitiya, Colombo 03', 7, 4.85, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(6, 'Ceylon Biologicals & Chemist Co', 'SUP-LK-006', 'Saman Wickramasinghe', 'info@ceylonbio.lk', '+94 81 223 4567', '54 Peradeniya Road, Kandy', 3, 4.60, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(7, 'Sunlight Pharma Distributors Ltd', 'SUP-LK-007', 'Priyanka De Silva', 'sales@sunlightpharma.lk', '+94 91 224 5678', '12 Matara Road, Galle', 4, 4.75, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(8, 'Novartis-Lanka Authorized Depot', 'SUP-LK-008', 'Dinesh Gunawardena', 'depot@novartis-lanka.com', '+94 11 567 8901', '77 Union Place, Slave Island, Colombo 02', 3, 4.90, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(9, 'Horizon Lifesciences & Oncology Supply', 'SUP-LK-009', 'Dr. K. Rajaratnam', 'oncology@horizonlife.lk', '+94 21 222 3456', '42 Hospital Road, Jaffna', 6, 4.80, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(10, 'Zenith Diagnostic & Formula Care', 'SUP-LK-010', 'Dilrukshi Cooray', 'orders@zenithformulacare.lk', '+94 31 223 8901', '99 Negombo Road, Kurunegala', 3, 4.70, 'active', '2026-08-26 06:17:54', '2026-08-26 06:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `reset_otp_code` varchar(6) DEFAULT NULL,
  `reset_otp_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `status`, `phone`, `email_verified_at`, `password`, `otp_code`, `otp_expires_at`, `reset_otp_code`, `reset_otp_expires_at`, `remember_token`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'Dr. Admin Director', 'admin@medisync.health', 'active', '+94 77 123 4567', NULL, '$2y$12$IgPFnfaIEwOHv8YaQZVLN.GqWmOVPs4TomFqyBjzeuS.sMkqWNHv2', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-26 06:17:53', '2026-08-26 06:17:53'),
(2, 2, 'Sarah Jenkins', 'pharmacist@medisync.health', 'active', '+94 77 444 5566', NULL, '$2y$12$Yopsw8Jq5Wj7eku/hnvi4etrb8/oeT9/Z9E.AKi.f9FCHe5ZzZpdW', NULL, NULL, NULL, NULL, NULL, '2026-08-26 06:58:13', '2026-08-26 06:17:54', '2026-08-26 06:58:13'),
(3, 3, 'Dr. Aris Thorne', 'doctor@medisync.health', 'active', '+94 71 987 6543', NULL, '$2y$12$Ezt5xsz0Qxve0dTJKJ3v9eBYmtVMLuNAJAK1Qp/4GTxo8olP4MBU.', NULL, NULL, NULL, NULL, NULL, '2026-08-26 07:16:01', '2026-08-26 06:17:54', '2026-08-26 07:16:01'),
(4, 3, 'Dr. Aris Thorne (Alias)', 'thorne@medisync.health', 'active', '+94 71 987 6543', NULL, '$2y$12$bVA5itQ.7yhuvDcFR2g43OyM5dFtPv2X8FVSVa/pRmYjx4xgvFg0C', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-26 06:17:54', '2026-08-26 06:17:54'),
(5, 4, 'Nurse Clara Barton', 'nurse@medisync.health', 'active', '+94 71 333 8899', NULL, '$2y$12$SSjTgsjyh0kqqYDFkFx5AOXf/0MiyP9u3AJd/ykgp6uCPpwWu8gjS', NULL, NULL, NULL, NULL, NULL, '2026-08-26 06:58:55', '2026-08-26 06:17:54', '2026-08-26 06:58:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_inventory_insights`
--
ALTER TABLE `ai_inventory_insights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_inventory_insights_medicine_id_foreign` (`medicine_id`),
  ADD KEY `ai_inventory_insights_batch_id_foreign` (`batch_id`);

--
-- Indexes for table `ai_symptom_triage_logs`
--
ALTER TABLE `ai_symptom_triage_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_symptom_triage_logs_patient_id_foreign` (`patient_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_patient_id_foreign` (`patient_id`),
  ADD KEY `appointments_doctor_id_foreign` (`doctor_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `cold_chain_logs`
--
ALTER TABLE `cold_chain_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cold_chain_logs_batch_id_foreign` (`batch_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_code_unique` (`code`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `icd_codes`
--
ALTER TABLE `icd_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `icd_codes_code_index` (`code`);

--
-- Indexes for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_transactions_batch_id_foreign` (`batch_id`),
  ADD KEY `inventory_transactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `medicines_barcode_unique` (`barcode`),
  ADD KEY `medicines_category_id_foreign` (`category_id`);

--
-- Indexes for table `medicine_batches`
--
ALTER TABLE `medicine_batches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medicine_batches_supplier_id_foreign` (`supplier_id`),
  ADD KEY `medicine_batches_medicine_id_exp_date_index` (`medicine_id`,`exp_date`);

--
-- Indexes for table `medicine_categories`
--
ALTER TABLE `medicine_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `medicine_categories_name_unique` (`name`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patients_patient_code_unique` (`patient_code`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_unique` (`name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prescriptions_prescription_code_unique` (`prescription_code`),
  ADD KEY `prescriptions_patient_id_foreign` (`patient_id`),
  ADD KEY `prescriptions_doctor_id_foreign` (`doctor_id`),
  ADD KEY `prescriptions_appointment_id_foreign` (`appointment_id`);

--
-- Indexes for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescription_items_prescription_id_foreign` (`prescription_id`),
  ADD KEY `prescription_items_medicine_id_foreign` (`medicine_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_orders_po_number_unique` (`po_number`),
  ADD KEY `purchase_orders_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchase_orders_medicine_id_foreign` (`medicine_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `role_permissions_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_employee_code_unique` (`employee_code`),
  ADD KEY `staff_user_id_foreign` (`user_id`),
  ADD KEY `staff_department_id_foreign` (`department_id`);

--
-- Indexes for table `stock_condemnations`
--
ALTER TABLE `stock_condemnations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_condemnations_condemnation_code_unique` (`condemnation_code`),
  ADD KEY `stock_condemnations_batch_id_foreign` (`batch_id`),
  ADD KEY `stock_condemnations_condemned_by_user_id_foreign` (`condemned_by_user_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suppliers_supplier_code_unique` (`supplier_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_inventory_insights`
--
ALTER TABLE `ai_inventory_insights`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ai_symptom_triage_logs`
--
ALTER TABLE `ai_symptom_triage_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `cold_chain_logs`
--
ALTER TABLE `cold_chain_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `icd_codes`
--
ALTER TABLE `icd_codes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `medicine_batches`
--
ALTER TABLE `medicine_batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `medicine_categories`
--
ALTER TABLE `medicine_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `prescription_items`
--
ALTER TABLE `prescription_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock_condemnations`
--
ALTER TABLE `stock_condemnations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_inventory_insights`
--
ALTER TABLE `ai_inventory_insights`
  ADD CONSTRAINT `ai_inventory_insights_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `medicine_batches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ai_inventory_insights_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_symptom_triage_logs`
--
ALTER TABLE `ai_symptom_triage_logs`
  ADD CONSTRAINT `ai_symptom_triage_logs_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cold_chain_logs`
--
ALTER TABLE `cold_chain_logs`
  ADD CONSTRAINT `cold_chain_logs_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `medicine_batches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD CONSTRAINT `inventory_transactions_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `medicine_batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medicines`
--
ALTER TABLE `medicines`
  ADD CONSTRAINT `medicines_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `medicine_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medicine_batches`
--
ALTER TABLE `medicine_batches`
  ADD CONSTRAINT `medicine_batches_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medicine_batches_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `prescriptions_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prescriptions_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD CONSTRAINT `prescription_items_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prescription_items_prescription_id_foreign` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `staff_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_condemnations`
--
ALTER TABLE `stock_condemnations`
  ADD CONSTRAINT `stock_condemnations_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `medicine_batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_condemnations_condemned_by_user_id_foreign` FOREIGN KEY (`condemned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
