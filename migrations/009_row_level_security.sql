-- ============================================================================
-- AfroMed Database Migration 009: Row-Level Security
-- Enables RLS on key tables so data is scoped by org_id
-- ============================================================================

-- Enable RLS on all data tables
ALTER TABLE core.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies: restrict access by org_id using current_setting
-- The application must SET app.current_org_id = '<uuid>' per session/transaction
-- Uses current_setting with missing_ok=true to return NULL when not set,
-- which safely blocks access instead of raising an error.
-- ============================================================================

-- Core schema
CREATE POLICY org_isolation_departments ON core.departments
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_roles ON core.roles
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_users ON core.users
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- user_roles: join through users table to filter by org
CREATE POLICY org_isolation_user_roles ON core.user_roles
    USING (user_id IN (
        SELECT u.user_id FROM core.users u
        WHERE u.org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID
    ));

-- Patient schema
CREATE POLICY org_isolation_patients ON patient.patients
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_patient_insurance ON patient.patient_insurance
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- Clinical schema
CREATE POLICY org_isolation_appointments ON clinical.appointments
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_medical_records ON clinical.medical_records
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_vitals ON clinical.vitals
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_diagnoses ON clinical.diagnoses
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- Pharmacy schema
CREATE POLICY org_isolation_medications ON pharmacy.medications
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_prescriptions ON pharmacy.prescriptions
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- prescription_items: join through prescriptions table to filter by org
CREATE POLICY org_isolation_prescription_items ON pharmacy.prescription_items
    USING (prescription_id IN (
        SELECT p.prescription_id FROM pharmacy.prescriptions p
        WHERE p.org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID
    ));

CREATE POLICY org_isolation_inventory ON pharmacy.inventory
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- Billing schema
CREATE POLICY org_isolation_invoices ON billing.invoices
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- invoice_items: join through invoices table to filter by org
CREATE POLICY org_isolation_invoice_items ON billing.invoice_items
    USING (invoice_id IN (
        SELECT i.invoice_id FROM billing.invoices i
        WHERE i.org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID
    ));

CREATE POLICY org_isolation_payments ON billing.payments
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- Lab schema
CREATE POLICY org_isolation_lab_tests ON lab.lab_tests
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_lab_orders ON lab.lab_orders
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

CREATE POLICY org_isolation_lab_results ON lab.lab_results
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);

-- Audit schema
CREATE POLICY org_isolation_audit_log ON audit.audit_log
    USING (org_id = NULLIF(current_setting('app.current_org_id', true), '')::UUID);
