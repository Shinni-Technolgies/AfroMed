-- ============================================================================
-- AfroMed Database Migration 002: Patient Schema
-- Creates: patients, patient_contacts, patient_insurance
-- ============================================================================

-- ============================================================================
-- Patients
-- ============================================================================
CREATE TABLE patient.patients (
    patient_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    department_id   UUID REFERENCES core.departments(department_id) ON DELETE SET NULL,
    medical_record_number VARCHAR(50),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender          VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    blood_type      VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    phone           VARCHAR(30),
    email           VARCHAR(255),
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'Nigeria',
    emergency_contact_name  VARCHAR(200),
    emergency_contact_phone VARCHAR(30),
    allergies       TEXT,
    notes           TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    registered_by   UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, medical_record_number)
);

-- ============================================================================
-- Patient Insurance
-- ============================================================================
CREATE TABLE patient.patient_insurance (
    insurance_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    provider_name   VARCHAR(255) NOT NULL,
    policy_number   VARCHAR(100) NOT NULL,
    group_number    VARCHAR(100),
    coverage_type   VARCHAR(50) CHECK (coverage_type IN ('primary', 'secondary', 'tertiary')),
    valid_from      DATE,
    valid_to        DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER trg_patients_updated_at
    BEFORE UPDATE ON patient.patients
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_patient_insurance_updated_at
    BEFORE UPDATE ON patient.patient_insurance
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
