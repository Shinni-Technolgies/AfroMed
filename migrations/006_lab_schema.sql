-- ============================================================================
-- AfroMed Database Migration 006: Lab Schema
-- Creates: lab_tests, lab_orders, lab_results
-- ============================================================================

-- ============================================================================
-- Lab Test Catalog
-- ============================================================================
CREATE TABLE lab.lab_tests (
    test_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    category        VARCHAR(100),
    description     TEXT,
    normal_range    VARCHAR(100),
    unit            VARCHAR(50),
    cost            NUMERIC(10,2),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, name)
);

-- ============================================================================
-- Lab Orders
-- ============================================================================
CREATE TABLE lab.lab_orders (
    order_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    ordered_by      UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    appointment_id  UUID REFERENCES clinical.appointments(appointment_id) ON DELETE SET NULL,
    test_id         UUID NOT NULL REFERENCES lab.lab_tests(test_id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'ordered'
                    CHECK (status IN ('ordered', 'collected', 'in_progress', 'completed', 'cancelled')),
    priority        VARCHAR(10) NOT NULL DEFAULT 'normal'
                    CHECK (priority IN ('normal', 'urgent', 'stat')),
    notes           TEXT,
    ordered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Lab Results
-- ============================================================================
CREATE TABLE lab.lab_results (
    result_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES lab.lab_orders(order_id) ON DELETE CASCADE,
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    result_value    TEXT NOT NULL,
    unit            VARCHAR(50),
    reference_range VARCHAR(100),
    is_abnormal     BOOLEAN NOT NULL DEFAULT FALSE,
    performed_by    UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    verified_by     UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    notes           TEXT,
    resulted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER trg_lab_tests_updated_at
    BEFORE UPDATE ON lab.lab_tests
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_lab_orders_updated_at
    BEFORE UPDATE ON lab.lab_orders
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_lab_results_updated_at
    BEFORE UPDATE ON lab.lab_results
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
