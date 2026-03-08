-- ============================================================================
-- AfroMed Database Migration 005: Billing Schema
-- Creates: invoices, invoice_items, payments
-- ============================================================================

-- ============================================================================
-- Invoices
-- ============================================================================
CREATE TABLE billing.invoices (
    invoice_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patient.patients(patient_id) ON DELETE CASCADE,
    department_id   UUID REFERENCES core.departments(department_id) ON DELETE SET NULL,
    appointment_id  UUID REFERENCES clinical.appointments(appointment_id) ON DELETE SET NULL,
    invoice_number  VARCHAR(50) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'issued', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded')),
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount_paid     NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency        VARCHAR(3) NOT NULL DEFAULT 'NGN',
    due_date        DATE,
    notes           TEXT,
    created_by      UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, invoice_number)
);

-- ============================================================================
-- Invoice Items (line items on an invoice)
-- ============================================================================
CREATE TABLE billing.invoice_items (
    item_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id      UUID NOT NULL REFERENCES billing.invoices(invoice_id) ON DELETE CASCADE,
    description     VARCHAR(255) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1,
    unit_price      NUMERIC(10,2) NOT NULL,
    total_price     NUMERIC(12,2) NOT NULL,
    item_type       VARCHAR(30) CHECK (item_type IN ('consultation', 'procedure', 'medication', 'lab_test', 'room_charge', 'other')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Payments
-- ============================================================================
CREATE TABLE billing.payments (
    payment_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    invoice_id      UUID NOT NULL REFERENCES billing.invoices(invoice_id) ON DELETE CASCADE,
    amount          NUMERIC(12,2) NOT NULL,
    payment_method  VARCHAR(30) NOT NULL
                    CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'mobile_money', 'insurance', 'other')),
    reference_number VARCHAR(100),
    status          VARCHAR(20) NOT NULL DEFAULT 'completed'
                    CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
    received_by     UUID REFERENCES core.users(user_id) ON DELETE SET NULL,
    paid_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at triggers
CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON billing.invoices
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
