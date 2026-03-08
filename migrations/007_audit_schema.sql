-- ============================================================================
-- AfroMed Database Migration 007: Audit Schema
-- Creates: audit_log for tracking all data changes
-- ============================================================================

-- ============================================================================
-- Audit Log
-- ============================================================================
CREATE TABLE audit.audit_log (
    log_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES core.organizations(org_id) ON DELETE SET NULL,
    user_id         UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    action          VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    table_schema    VARCHAR(50) NOT NULL,
    table_name      VARCHAR(100) NOT NULL,
    record_id       UUID,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Generic audit trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION audit.log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit.audit_log (
            org_id, action, table_schema, table_name, record_id, new_values
        ) VALUES (
            NEW.org_id,
            'INSERT',
            TG_TABLE_SCHEMA,
            TG_TABLE_NAME,
            (to_jsonb(NEW) ->> (TG_TABLE_NAME || '_id'))::UUID,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.audit_log (
            org_id, action, table_schema, table_name, record_id, old_values, new_values
        ) VALUES (
            NEW.org_id,
            'UPDATE',
            TG_TABLE_SCHEMA,
            TG_TABLE_NAME,
            (to_jsonb(NEW) ->> (TG_TABLE_NAME || '_id'))::UUID,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit.audit_log (
            org_id, action, table_schema, table_name, record_id, old_values
        ) VALUES (
            OLD.org_id,
            'DELETE',
            TG_TABLE_SCHEMA,
            TG_TABLE_NAME,
            (to_jsonb(OLD) ->> (TG_TABLE_NAME || '_id'))::UUID,
            to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to key tables
CREATE TRIGGER trg_audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON patient.patients
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_appointments
    AFTER INSERT OR UPDATE OR DELETE ON clinical.appointments
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_medical_records
    AFTER INSERT OR UPDATE OR DELETE ON clinical.medical_records
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_prescriptions
    AFTER INSERT OR UPDATE OR DELETE ON pharmacy.prescriptions
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_invoices
    AFTER INSERT OR UPDATE OR DELETE ON billing.invoices
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_payments
    AFTER INSERT OR UPDATE OR DELETE ON billing.payments
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_lab_orders
    AFTER INSERT OR UPDATE OR DELETE ON lab.lab_orders
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER trg_audit_lab_results
    AFTER INSERT OR UPDATE OR DELETE ON lab.lab_results
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
