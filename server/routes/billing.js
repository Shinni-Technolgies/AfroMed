const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

// ---- Mappers ----

function mapInvoice(row) {
  return {
    id: row.invoice_id,
    patientId: row.patient_id,
    patientName: row.patient_name ?? null,
    departmentId: row.department_id ?? null,
    departmentName: row.department_name ?? null,
    appointmentId: row.appointment_id ?? null,
    invoiceNumber: row.invoice_number,
    status: row.status,
    subtotal: parseFloat(row.subtotal),
    taxAmount: parseFloat(row.tax_amount),
    discountAmount: parseFloat(row.discount_amount),
    totalAmount: parseFloat(row.total_amount),
    amountPaid: parseFloat(row.amount_paid),
    currency: row.currency,
    dueDate: row.due_date,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInvoiceItem(row) {
  return {
    id: row.item_id,
    invoiceId: row.invoice_id,
    description: row.description,
    quantity: row.quantity,
    unitPrice: parseFloat(row.unit_price),
    totalPrice: parseFloat(row.total_price),
    itemType: row.item_type,
    createdAt: row.created_at,
  };
}

function mapPayment(row) {
  return {
    id: row.payment_id,
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoice_number ?? null,
    patientName: row.patient_name ?? null,
    amount: parseFloat(row.amount),
    paymentMethod: row.payment_method,
    referenceNumber: row.reference_number,
    status: row.status,
    receivedBy: row.received_by,
    paidAt: row.paid_at,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// ---- Invoice queries ----

const INVOICE_QUERY = `
  SELECT inv.*,
         CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
         d.name AS department_name
  FROM billing.invoices inv
  JOIN patient.patients p ON p.patient_id = inv.patient_id
  LEFT JOIN core.departments d ON d.department_id = inv.department_id
`;

// GET /api/billing/invoices
router.get('/invoices', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${INVOICE_QUERY} WHERE inv.org_id = $1 ORDER BY inv.created_at DESC`,
      [req.orgId]
    );
    res.json({ data: result.rows.map(mapInvoice), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/billing/invoices/:id
router.get('/invoices/:id', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${INVOICE_QUERY} WHERE inv.org_id = $1 AND inv.invoice_id = $2`,
      [req.orgId, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(mapInvoice(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/billing/invoices
router.post('/invoices', async (req, res) => {
  try {
    const { patientId, departmentId, appointmentId, invoiceNumber, status, subtotal, taxAmount, discountAmount, totalAmount, currency, dueDate, notes, items } = req.body;
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO billing.invoices (org_id, patient_id, department_id, appointment_id, invoice_number, status, subtotal, tax_amount, discount_amount, total_amount, currency, due_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [req.orgId, patientId, departmentId || null, appointmentId || null, invoiceNumber, status || 'draft', subtotal || 0, taxAmount || 0, discountAmount || 0, totalAmount || 0, currency || 'NGN', dueDate || null, notes || null]
    );
    const invoice = result.rows[0];

    // Insert line items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await orgQuery(
          req.orgId,
          `INSERT INTO billing.invoice_items (invoice_id, description, quantity, unit_price, total_price, item_type)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [invoice.invoice_id, item.description, item.quantity || 1, item.unitPrice, item.totalPrice || (item.quantity || 1) * item.unitPrice, item.itemType || null]
        );
      }
    }

    res.status(201).json(mapInvoice(invoice));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/billing/invoices/:id
router.put('/invoices/:id', async (req, res) => {
  try {
    const { patientId, departmentId, appointmentId, invoiceNumber, status, subtotal, taxAmount, discountAmount, totalAmount, currency, dueDate, notes } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE billing.invoices
       SET patient_id=$2, department_id=$3, appointment_id=$4, invoice_number=$5, status=$6, subtotal=$7, tax_amount=$8, discount_amount=$9, total_amount=$10, currency=$11, due_date=$12, notes=$13
       WHERE org_id=$1 AND invoice_id=$14
       RETURNING *`,
      [req.orgId, patientId, departmentId || null, appointmentId || null, invoiceNumber, status, subtotal, taxAmount, discountAmount, totalAmount, currency || 'NGN', dueDate || null, notes || null, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(mapInvoice(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/billing/invoices/:id/status
router.patch('/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE billing.invoices SET status=$1 WHERE org_id=$2 AND invoice_id=$3 RETURNING *`,
      [status, req.orgId, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(mapInvoice(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Invoice Items ----

// GET /api/billing/invoices/:id/items
router.get('/invoices/:id/items', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT ii.* FROM billing.invoice_items ii
       JOIN billing.invoices inv ON inv.invoice_id = ii.invoice_id
       WHERE inv.org_id = $1 AND ii.invoice_id = $2
       ORDER BY ii.created_at`,
      [req.orgId, req.params.id]
    );
    res.json({ data: result.rows.map(mapInvoiceItem), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Payments ----

const PAYMENT_QUERY = `
  SELECT pay.*,
         inv.invoice_number,
         CONCAT(p.first_name, ' ', p.last_name) AS patient_name
  FROM billing.payments pay
  JOIN billing.invoices inv ON inv.invoice_id = pay.invoice_id
  JOIN patient.patients p ON p.patient_id = inv.patient_id
`;

// GET /api/billing/payments
router.get('/payments', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${PAYMENT_QUERY} WHERE pay.org_id = $1 ORDER BY pay.paid_at DESC`,
      [req.orgId]
    );
    res.json({ data: result.rows.map(mapPayment), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/billing/payments
router.post('/payments', async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, referenceNumber, status, notes } = req.body;
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO billing.payments (org_id, invoice_id, amount, payment_method, reference_number, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [req.orgId, invoiceId, amount, paymentMethod, referenceNumber || null, status || 'completed', notes || null]
    );

    // Update amount_paid on the invoice
    await orgQuery(
      req.orgId,
      `UPDATE billing.invoices
       SET amount_paid = COALESCE((SELECT SUM(amount) FROM billing.payments WHERE invoice_id = $1 AND status = 'completed'), 0)
       WHERE invoice_id = $1`,
      [invoiceId]
    );

    // Auto-update invoice status based on payment
    await orgQuery(
      req.orgId,
      `UPDATE billing.invoices
       SET status = CASE
         WHEN amount_paid >= total_amount THEN 'paid'
         WHEN amount_paid > 0 THEN 'partially_paid'
         ELSE status
       END
       WHERE invoice_id = $1`,
      [invoiceId]
    );

    res.status(201).json(mapPayment(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Stats ----

// GET /api/billing/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalInvoices, totalRevenue, outstanding, overdue] = await Promise.all([
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM billing.invoices WHERE org_id = $1', [req.orgId]),
      orgQuery(req.orgId, "SELECT COALESCE(SUM(amount_paid), 0) AS total FROM billing.invoices WHERE org_id = $1 AND status IN ('paid', 'partially_paid')", [req.orgId]),
      orgQuery(req.orgId, "SELECT COALESCE(SUM(total_amount - amount_paid), 0) AS total FROM billing.invoices WHERE org_id = $1 AND status IN ('issued', 'partially_paid', 'overdue')", [req.orgId]),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM billing.invoices WHERE org_id = $1 AND status = 'overdue'", [req.orgId]),
    ]);
    res.json({
      totalInvoices: parseInt(totalInvoices.rows[0].count, 10),
      totalRevenue: parseFloat(totalRevenue.rows[0].total),
      outstanding: parseFloat(outstanding.rows[0].total),
      overdue: parseInt(overdue.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
