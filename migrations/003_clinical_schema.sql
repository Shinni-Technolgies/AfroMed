-- ============================================================================
-- AfroMed Database Migration 003: Clinical Schema
-- Creates: appointments, medical_records, vitals, diagnoses
-- ============================================================================

-- ============================================================================
-- Appointments
-- ============================================================================
CREATE TABLE clinical.appointments (
    appointment_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    department_id   UUID REFERENCES core.departments(department_id) ON DELETE SET NULL,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    provider_id     UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    scheduled_at    TIMESTAMPTZ NOT NULL,
    duration_min    INTEGER DEFAULT 30,
    status          VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    visit_type      VARCHAR(50) CHECK (visit_type IN ('new_patient', 'follow_up', 'emergency', 'routine', 'consultation')),
    reason          TEXT,
    notes           TEXT,
    created_by      UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Medical Records (per encounter/visit)
-- ============================================================================
CREATE TABLE clinical.medical_records (
    record_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    appointment_id  UUID REFERENCES clinical.appointments(appointment_id) ON DELETE SET NULL,
    provider_id     UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    examination_findings TEXT,
    treatment_plan  TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Vitals
-- ============================================================================
CREATE TABLE clinical.vitals (
    vital_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    record_id       UUID REFERENCES clinical.medical_records(record_id) ON DELETE SET NULL,
    recorded_by     UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    temperature_c   NUMERIC(4,1),
    blood_pressure_systolic  INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate      INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation NUMERIC(4,1),
    weight_kg       NUMERIC(5,1),
    height_cm       NUMERIC(5,1),
    bmi             NUMERIC(4,1),
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Diagnoses
-- ============================================================================
CREATE TABLE clinical.diagnoses (
    diagnosis_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    record_id       UUID REFERENCES clinical.medical_records(record_id) ON DELETE SET NULL,
    diagnosed_by    UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    icd_code        VARCHAR(20),
    description     TEXT NOT NULL,
    severity        VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'resolved', 'chronic')),
    diagnosed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON clinical.appointments
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_medical_records_updated_at
    BEFORE UPDATE ON clinical.medical_records
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_diagnoses_updated_at
    BEFORE UPDATE ON clinical.diagnoses
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
