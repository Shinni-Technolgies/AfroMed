-- ============================================================
-- AfroMed Hospital Management System — Seed Data
-- ============================================================
-- This file contains the database schema and seed data for the
-- AfroMed medical dashboard. Run this against a PostgreSQL
-- database to populate the system with sample data.
--
-- Usage:
--   psql -U <user> -d <database> -f seed.sql
-- ============================================================

-- ============================================================
-- SCHEMA
-- ============================================================

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id          VARCHAR(20) PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    age         INTEGER NOT NULL,
    gender      VARCHAR(10) NOT NULL,
    contact     VARCHAR(30) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'Active',  -- Active | Discharged | Critical
    last_visit  DATE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
    id          VARCHAR(20) PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    specialty   VARCHAR(40) NOT NULL,
    contact     VARCHAR(30) NOT NULL,
    experience  INTEGER NOT NULL DEFAULT 0,             -- years of experience
    status      VARCHAR(20) NOT NULL DEFAULT 'Available', -- Available | On Duty | On Leave
    rating      NUMERIC(2,1) NOT NULL DEFAULT 0.0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id            VARCHAR(20) PRIMARY KEY,
    patient_name  VARCHAR(120) NOT NULL,
    doctor        VARCHAR(120) NOT NULL,
    department    VARCHAR(40) NOT NULL,
    date_time     TIMESTAMP NOT NULL,
    type          VARCHAR(20) NOT NULL,                 -- Checkup | Follow-up | Emergency | Consultation
    status        VARCHAR(20) NOT NULL DEFAULT 'Scheduled', -- Scheduled | Completed | Cancelled | In Progress
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications (Pharmacy)
CREATE TABLE IF NOT EXISTS medications (
    id          VARCHAR(20) PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    category    VARCHAR(40) NOT NULL,                   -- Antibiotic | Analgesic | Antiviral | Supplement | Antidiabetic
    stock_qty   INTEGER NOT NULL DEFAULT 0,
    unit_price  NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    supplier    VARCHAR(120) NOT NULL,
    expiry_date DATE NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'In Stock', -- In Stock | Low Stock | Out of Stock
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Records
CREATE TABLE IF NOT EXISTS health_records (
    id            VARCHAR(20) PRIMARY KEY,
    patient_name  VARCHAR(120) NOT NULL,
    record_type   VARCHAR(30) NOT NULL,                 -- Lab Result | Prescription | Medical Report | Imaging | Discharge Summary
    doctor        VARCHAR(120) NOT NULL,
    date_created  DATE NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'Active', -- Active | Archived
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- SEED DATA — Patients
-- ============================================================
INSERT INTO patients (id, name, age, gender, contact, status, last_visit) VALUES
  ('PT-1001', 'Amina Okafor',      34, 'Female', '+234 801 234 5678', 'Active',     '2024-12-15'),
  ('PT-1002', 'Kwame Mensah',      52, 'Male',   '+233 244 567 890',  'Critical',   '2024-12-18'),
  ('PT-1003', 'Fatima Diallo',     28, 'Female', '+221 77 345 6789',  'Active',     '2024-12-10'),
  ('PT-1004', 'Tendai Moyo',       45, 'Male',   '+263 71 234 5678',  'Discharged', '2024-11-28'),
  ('PT-1005', 'Ngozi Eze',         61, 'Female', '+234 803 456 7890', 'Active',     '2024-12-17'),
  ('PT-1006', 'Ousmane Ba',        39, 'Male',   '+221 78 901 2345',  'Critical',   '2024-12-19'),
  ('PT-1007', 'Aisha Mohammed',    23, 'Female', '+234 805 678 9012', 'Active',     '2024-12-14'),
  ('PT-1008', 'Kofi Asante',       70, 'Male',   '+233 209 876 543',  'Discharged', '2024-11-20'),
  ('PT-1009', 'Zainab Traore',     41, 'Female', '+223 76 543 2109',  'Active',     '2024-12-12'),
  ('PT-1010', 'Chinedu Nwosu',     56, 'Male',   '+234 807 890 1234', 'Discharged', '2024-12-01');


-- ============================================================
-- SEED DATA — Doctors
-- ============================================================
INSERT INTO doctors (id, name, specialty, contact, experience, status, rating) VALUES
  ('DR-2001', 'Dr. Amara Osei',       'Cardiology',       '+233 244 100 2001', 14, 'On Duty',   4.8),
  ('DR-2002', 'Dr. Emeka Nwankwo',    'Neurology',        '+234 801 200 3002', 20, 'Available', 4.9),
  ('DR-2003', 'Dr. Fatoumata Camara', 'Pediatrics',       '+224 622 300 4003',  9, 'On Duty',   4.7),
  ('DR-2004', 'Dr. Thabo Ndlovu',     'Orthopedics',      '+27 82 400 5004',   16, 'Available', 4.6),
  ('DR-2005', 'Dr. Halima Yusuf',     'Dermatology',      '+254 722 500 6005',  7, 'On Leave',  4.5),
  ('DR-2006', 'Dr. Kwabena Adjei',    'Oncology',         '+233 209 600 7006', 22, 'On Duty',   4.9),
  ('DR-2007', 'Dr. Nneka Obiora',     'General Medicine', '+234 803 700 8007', 11, 'Available', 4.4),
  ('DR-2008', 'Dr. Moussa Diop',      'Ophthalmology',    '+221 77 800 9008',  18, 'On Duty',   4.8),
  ('DR-2009', 'Dr. Chidinma Eke',     'Cardiology',       '+234 805 900 1009', 13, 'Available', 4.7),
  ('DR-2010', 'Dr. Sekou Touré',      'Neurology',        '+223 76 100 2010',  25, 'On Leave',  4.6);


-- ============================================================
-- SEED DATA — Appointments
-- ============================================================
INSERT INTO appointments (id, patient_name, doctor, department, date_time, type, status) VALUES
  ('APT-2001', 'Amina Okafor',    'Dr. Emeka Obi',        'Cardiology',   '2024-12-20 09:00', 'Checkup',      'Scheduled'),
  ('APT-2002', 'Kwame Mensah',    'Dr. Ama Serwaa',       'Neurology',    '2024-12-20 09:30', 'Follow-up',    'In Progress'),
  ('APT-2003', 'Fatima Diallo',   'Dr. Ibrahima Ndiaye',  'Obstetrics',   '2024-12-20 10:00', 'Consultation', 'Scheduled'),
  ('APT-2004', 'Tendai Moyo',     'Dr. Chipo Nyathi',     'Orthopedics',  '2024-12-19 14:00', 'Follow-up',    'Completed'),
  ('APT-2005', 'Ngozi Eze',       'Dr. Emeka Obi',        'Cardiology',   '2024-12-20 11:00', 'Emergency',    'Scheduled'),
  ('APT-2006', 'Ousmane Ba',      'Dr. Mariama Camara',   'Dermatology',  '2024-12-18 15:30', 'Checkup',      'Completed'),
  ('APT-2007', 'Aisha Mohammed',  'Dr. Yusuf Abdullahi',  'Pediatrics',   '2024-12-20 13:00', 'Consultation', 'Scheduled'),
  ('APT-2008', 'Kofi Asante',     'Dr. Ama Serwaa',       'Neurology',    '2024-12-17 10:30', 'Follow-up',    'Cancelled'),
  ('APT-2009', 'Zainab Traore',   'Dr. Ibrahima Ndiaye',  'Obstetrics',   '2024-12-20 14:30', 'Checkup',      'Scheduled'),
  ('APT-2010', 'Chinedu Nwosu',   'Dr. Chipo Nyathi',     'Orthopedics',  '2024-12-19 09:00', 'Emergency',    'Completed'),
  ('APT-2011', 'Halima Bello',    'Dr. Yusuf Abdullahi',  'Pediatrics',   '2024-12-16 11:00', 'Checkup',      'Cancelled'),
  ('APT-2012', 'Sekou Konate',    'Dr. Mariama Camara',   'Dermatology',  '2024-12-20 15:00', 'Consultation', 'In Progress');


-- ============================================================
-- SEED DATA — Medications (Pharmacy)
-- ============================================================
INSERT INTO medications (id, name, category, stock_qty, unit_price, supplier, expiry_date, status) VALUES
  ('MED-2001', 'Amoxicillin 500mg',      'Antibiotic',    1240,  3.50, 'PharmaCare Ltd',    '2026-03-15', 'In Stock'),
  ('MED-2002', 'Ibuprofen 400mg',        'Analgesic',      860,  2.10, 'MedSource Africa',  '2025-11-20', 'In Stock'),
  ('MED-2003', 'Metformin 850mg',        'Antidiabetic',    25,  4.75, 'GlobalMed Inc',     '2025-08-10', 'Low Stock'),
  ('MED-2004', 'Oseltamivir 75mg',       'Antiviral',        0, 12.30, 'ViralShield Corp',  '2025-06-01', 'Out of Stock'),
  ('MED-2005', 'Paracetamol 500mg',      'Analgesic',     2100,  1.20, 'PharmaCare Ltd',    '2026-09-30', 'In Stock'),
  ('MED-2006', 'Vitamin D3 1000IU',      'Supplement',      15,  5.60, 'NutriHealth SA',    '2025-12-25', 'Low Stock'),
  ('MED-2007', 'Ciprofloxacin 250mg',    'Antibiotic',     430,  4.00, 'MedSource Africa',  '2026-01-18', 'In Stock'),
  ('MED-2008', 'Acyclovir 200mg',        'Antiviral',        0,  8.90, 'ViralShield Corp',  '2025-04-12', 'Out of Stock'),
  ('MED-2009', 'Glibenclamide 5mg',      'Antidiabetic',   380,  3.25, 'GlobalMed Inc',     '2026-07-08', 'In Stock'),
  ('MED-2010', 'Iron Supplement 325mg',  'Supplement',      18,  2.80, 'NutriHealth SA',    '2025-10-05', 'Low Stock'),
  ('MED-2011', 'Azithromycin 500mg',     'Antibiotic',     590,  6.40, 'PharmaCare Ltd',    '2026-05-22', 'In Stock'),
  ('MED-2012', 'Diclofenac 50mg',        'Analgesic',        0,  1.95, 'MedSource Africa',  '2025-02-28', 'Out of Stock');


-- ============================================================
-- SEED DATA — Health Records
-- ============================================================
INSERT INTO health_records (id, patient_name, record_type, doctor, date_created, status) VALUES
  ('HR-2001', 'Amina Okafor',    'Lab Result',         'Dr. Emeka Obi',    '2024-12-18', 'Active'),
  ('HR-2002', 'Kwame Mensah',    'Prescription',       'Dr. Ama Boateng',  '2024-12-17', 'Active'),
  ('HR-2003', 'Fatima Diallo',   'Medical Report',     'Dr. Ibrahima Sow', '2024-12-15', 'Archived'),
  ('HR-2004', 'Tendai Moyo',     'Imaging',            'Dr. Chipo Banda',  '2024-12-14', 'Active'),
  ('HR-2005', 'Ngozi Eze',       'Discharge Summary',  'Dr. Emeka Obi',    '2024-12-12', 'Archived'),
  ('HR-2006', 'Ousmane Ba',      'Lab Result',         'Dr. Mariama Bah',  '2024-12-10', 'Active'),
  ('HR-2007', 'Aisha Mohammed',  'Prescription',       'Dr. Ama Boateng',  '2024-12-09', 'Active'),
  ('HR-2008', 'Kofi Asante',     'Medical Report',     'Dr. Chipo Banda',  '2024-12-07', 'Archived'),
  ('HR-2009', 'Zainab Traore',   'Lab Result',         'Dr. Ibrahima Sow', '2024-12-05', 'Active'),
  ('HR-2010', 'Chinedu Nwosu',   'Prescription',       'Dr. Mariama Bah',  '2024-12-03', 'Active');
