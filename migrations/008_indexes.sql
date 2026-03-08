-- ============================================================================
-- AfroMed Database Migration 008: Indexes
-- Creates performance indexes for frequently queried columns
-- ============================================================================

-- Core indexes
CREATE INDEX idx_departments_org ON core.departments(org_id);
CREATE INDEX idx_roles_org ON core.roles(org_id);
CREATE INDEX idx_users_org ON core.users(org_id);
CREATE INDEX idx_users_department ON core.users(department_id);
CREATE INDEX idx_users_org_email ON core.users(org_id, email);

-- Patient indexes
CREATE INDEX idx_patients_org ON patient.patients(org_id);
CREATE INDEX idx_patients_department ON patient.patients(department_id);
CREATE INDEX idx_patients_name ON patient.patients(org_id, last_name, first_name);
CREATE INDEX idx_patients_mrn ON patient.patients(org_id, medical_record_number);
CREATE INDEX idx_patient_insurance_patient ON patient.patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_org ON patient.patient_insurance(org_id);

-- Clinical indexes
CREATE INDEX idx_appointments_org ON clinical.appointments(org_id);
CREATE INDEX idx_appointments_patient ON clinical.appointments(patient_id);
CREATE INDEX idx_appointments_provider ON clinical.appointments(provider_id);
CREATE INDEX idx_appointments_department ON clinical.appointments(department_id);
CREATE INDEX idx_appointments_scheduled ON clinical.appointments(org_id, scheduled_at);
CREATE INDEX idx_appointments_status ON clinical.appointments(org_id, status);
CREATE INDEX idx_medical_records_org ON clinical.medical_records(org_id);
CREATE INDEX idx_medical_records_patient ON clinical.medical_records(patient_id);
CREATE INDEX idx_vitals_patient ON clinical.vitals(patient_id);
CREATE INDEX idx_vitals_org ON clinical.vitals(org_id);
CREATE INDEX idx_diagnoses_patient ON clinical.diagnoses(patient_id);
CREATE INDEX idx_diagnoses_org ON clinical.diagnoses(org_id);
CREATE INDEX idx_diagnoses_icd ON clinical.diagnoses(icd_code);

-- Pharmacy indexes
CREATE INDEX idx_medications_org ON pharmacy.medications(org_id);
CREATE INDEX idx_prescriptions_org ON pharmacy.prescriptions(org_id);
CREATE INDEX idx_prescriptions_patient ON pharmacy.prescriptions(patient_id);
CREATE INDEX idx_prescription_items_prescription ON pharmacy.prescription_items(prescription_id);
CREATE INDEX idx_inventory_org ON pharmacy.inventory(org_id);
CREATE INDEX idx_inventory_medication ON pharmacy.inventory(medication_id);
CREATE INDEX idx_inventory_expiry ON pharmacy.inventory(expiry_date);

-- Billing indexes
CREATE INDEX idx_invoices_org ON billing.invoices(org_id);
CREATE INDEX idx_invoices_patient ON billing.invoices(patient_id);
CREATE INDEX idx_invoices_department ON billing.invoices(department_id);
CREATE INDEX idx_invoices_status ON billing.invoices(org_id, status);
CREATE INDEX idx_invoices_number ON billing.invoices(org_id, invoice_number);
CREATE INDEX idx_invoice_items_invoice ON billing.invoice_items(invoice_id);
CREATE INDEX idx_payments_org ON billing.payments(org_id);
CREATE INDEX idx_payments_invoice ON billing.payments(invoice_id);

-- Lab indexes
CREATE INDEX idx_lab_tests_org ON lab.lab_tests(org_id);
CREATE INDEX idx_lab_orders_org ON lab.lab_orders(org_id);
CREATE INDEX idx_lab_orders_patient ON lab.lab_orders(patient_id);
CREATE INDEX idx_lab_orders_status ON lab.lab_orders(org_id, status);
CREATE INDEX idx_lab_results_order ON lab.lab_results(order_id);
CREATE INDEX idx_lab_results_org ON lab.lab_results(org_id);

-- Audit log indexes
CREATE INDEX idx_audit_log_org ON audit.audit_log(org_id);
CREATE INDEX idx_audit_log_user ON audit.audit_log(user_id);
CREATE INDEX idx_audit_log_table ON audit.audit_log(table_schema, table_name);
CREATE INDEX idx_audit_log_created ON audit.audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit.audit_log(action);
