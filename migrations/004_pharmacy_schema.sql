-- ============================================================================
-- AfroMed Database Migration 004: Pharmacy Schema
-- Creates: medications, prescriptions, prescription_items, pharmacy_inventory
-- ============================================================================

-- ============================================================================
-- Medications (catalog of available medicines)
-- ============================================================================
CREATE TABLE pharmacy.medications (
    medication_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    generic_name    VARCHAR(255),
    category        VARCHAR(100),
    dosage_form     VARCHAR(50) CHECK (dosage_form IN ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'drops', 'inhaler', 'suppository', 'other')),
    strength        VARCHAR(50),
    manufacturer    VARCHAR(255),
    requires_prescription BOOLEAN NOT NULL DEFAULT TRUE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, name, strength)
);

-- ============================================================================
-- Prescriptions
-- ============================================================================
CREATE TABLE pharmacy.prescriptions (
    prescription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    prescribed_by   UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    appointment_id  UUID REFERENCES clinical.appointments(appointment_id) ON DELETE SET NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'dispensed', 'partially_dispensed', 'cancelled')),
    notes           TEXT,
    prescribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Prescription Items (individual medications in a prescription)
-- ============================================================================
CREATE TABLE pharmacy.prescription_items (
    item_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID NOT NULL REFERENCES pharmacy.prescriptions(prescription_id) ON DELETE CASCADE,
    medication_id   UUID NOT NULL REFERENCES pharmacy.medications(medication_id) ON DELETE CASCADE,
    dosage          VARCHAR(100) NOT NULL,
    frequency       VARCHAR(100) NOT NULL,
    duration        VARCHAR(100),
    quantity        INTEGER NOT NULL DEFAULT 1,
    instructions    TEXT,
    is_dispensed    BOOLEAN NOT NULL DEFAULT FALSE,
    dispensed_by    UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    dispensed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Pharmacy Inventory
-- ============================================================================
CREATE TABLE pharmacy.inventory (
    inventory_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    medication_id   UUID NOT NULL REFERENCES pharmacy.medications(medication_id) ON DELETE CASCADE,
    batch_number    VARCHAR(100),
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    reorder_level   INTEGER NOT NULL DEFAULT 10,
    unit_cost       NUMERIC(10,2),
    expiry_date     DATE,
    last_restocked  TIMESTAMPTZ,
    updated_by      UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER trg_medications_updated_at
    BEFORE UPDATE ON pharmacy.medications
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_prescriptions_updated_at
    BEFORE UPDATE ON pharmacy.prescriptions
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_inventory_updated_at
    BEFORE UPDATE ON pharmacy.inventory
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
