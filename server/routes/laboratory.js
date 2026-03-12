const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

// ============================================================================
// Lab Tests (Catalog)
// ============================================================================

function mapLabTest(row) {
  return {
    id: row.test_id,
    name: row.name,
    category: row.category,
    description: row.description,
    normalRange: row.normal_range,
    unit: row.unit,
    cost: row.cost ? parseFloat(row.cost) : null,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/laboratory/tests
router.get('/tests', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT * FROM lab.lab_tests ORDER BY created_at DESC`
    );
    res.json({ data: result.rows.map(mapLabTest), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/laboratory/tests/:id
router.get('/tests/:id', async (req, res) => {
  try {
    const result = await orgQuery(req.orgId, 'SELECT * FROM lab.lab_tests WHERE test_id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lab test not found' });
    res.json(mapLabTest(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/laboratory/tests
router.post('/tests', async (req, res) => {
  try {
    const { name, category, description, normalRange, unit, cost, isActive } = req.body;
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO lab.lab_tests (org_id, name, category, description, normal_range, unit, cost, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, TRUE))
       RETURNING *`,
      [req.orgId, name, category, description, normalRange, unit, cost, isActive]
    );
    res.status(201).json(mapLabTest(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/laboratory/tests/:id
router.put('/tests/:id', async (req, res) => {
  try {
    const { name, category, description, normalRange, unit, cost, isActive } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE lab.lab_tests
       SET name = COALESCE($1, name), category = COALESCE($2, category),
           description = COALESCE($3, description), normal_range = COALESCE($4, normal_range),
           unit = COALESCE($5, unit), cost = COALESCE($6, cost),
           is_active = COALESCE($7, is_active)
       WHERE test_id = $8
       RETURNING *`,
      [name, category, description, normalRange, unit, cost, isActive, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lab test not found' });
    res.json(mapLabTest(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Lab Orders
// ============================================================================

function mapLabOrder(row) {
  return {
    id: row.order_id,
    patientId: row.patient_id,
    patientName: row.patient_name ?? null,
    orderedBy: row.ordered_by,
    orderedByName: row.ordered_by_name ?? null,
    appointmentId: row.appointment_id,
    testId: row.test_id,
    testName: row.test_name ?? null,
    status: row.status,
    priority: row.priority,
    notes: row.notes,
    orderedAt: row.ordered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const ORDER_QUERY = `
  SELECT o.*,
         CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
         CONCAT(u.first_name, ' ', u.last_name) AS ordered_by_name,
         t.name AS test_name
  FROM lab.lab_orders o
  JOIN patient.patients p ON p.patient_id = o.patient_id
  JOIN core.users u ON u.user_id = o.ordered_by
  JOIN lab.lab_tests t ON t.test_id = o.test_id
`;

// GET /api/laboratory/orders
router.get('/orders', async (req, res) => {
  try {
    const result = await orgQuery(req.orgId, `${ORDER_QUERY} ORDER BY o.ordered_at DESC`);
    res.json({ data: result.rows.map(mapLabOrder), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/laboratory/orders/:id
router.get('/orders/:id', async (req, res) => {
  try {
    const result = await orgQuery(req.orgId, `${ORDER_QUERY} WHERE o.order_id = $1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lab order not found' });
    res.json(mapLabOrder(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/laboratory/orders
router.post('/orders', async (req, res) => {
  try {
    const { patientId, orderedBy, appointmentId, testId, priority, notes } = req.body;
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO lab.lab_orders (org_id, patient_id, ordered_by, appointment_id, test_id, priority, notes)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'normal'), $7)
       RETURNING *`,
      [req.orgId, patientId, orderedBy, appointmentId, testId, priority, notes]
    );
    // Re-fetch with joins
    const full = await orgQuery(req.orgId, `${ORDER_QUERY} WHERE o.order_id = $1`, [result.rows[0].order_id]);
    res.status(201).json(mapLabOrder(full.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/laboratory/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['ordered', 'collected', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const result = await orgQuery(
      req.orgId,
      `UPDATE lab.lab_orders SET status = $1 WHERE order_id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lab order not found' });
    const full = await orgQuery(req.orgId, `${ORDER_QUERY} WHERE o.order_id = $1`, [req.params.id]);
    res.json(mapLabOrder(full.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Lab Results
// ============================================================================

function mapLabResult(row) {
  return {
    id: row.result_id,
    orderId: row.order_id,
    patientName: row.patient_name ?? null,
    testName: row.test_name ?? null,
    resultValue: row.result_value,
    unit: row.unit,
    referenceRange: row.reference_range,
    isAbnormal: row.is_abnormal,
    performedBy: row.performed_by,
    performedByName: row.performed_by_name ?? null,
    verifiedBy: row.verified_by,
    verifiedByName: row.verified_by_name ?? null,
    notes: row.notes,
    resultedAt: row.resulted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const RESULT_QUERY = `
  SELECT r.*,
         CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
         t.name AS test_name,
         CONCAT(perf.first_name, ' ', perf.last_name) AS performed_by_name,
         CONCAT(ver.first_name, ' ', ver.last_name) AS verified_by_name
  FROM lab.lab_results r
  JOIN lab.lab_orders o ON o.order_id = r.order_id
  JOIN patient.patients p ON p.patient_id = o.patient_id
  JOIN lab.lab_tests t ON t.test_id = o.test_id
  LEFT JOIN core.users perf ON perf.user_id = r.performed_by
  LEFT JOIN core.users ver ON ver.user_id = r.verified_by
`;

// GET /api/laboratory/results
router.get('/results', async (req, res) => {
  try {
    const result = await orgQuery(req.orgId, `${RESULT_QUERY} ORDER BY r.resulted_at DESC`);
    res.json({ data: result.rows.map(mapLabResult), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/laboratory/results/:id
router.get('/results/:id', async (req, res) => {
  try {
    const result = await orgQuery(req.orgId, `${RESULT_QUERY} WHERE r.result_id = $1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lab result not found' });
    res.json(mapLabResult(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/laboratory/results
router.post('/results', async (req, res) => {
  try {
    const { orderId, resultValue, unit, referenceRange, isAbnormal, performedBy, verifiedBy, notes } = req.body;
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO lab.lab_results (order_id, org_id, result_value, unit, reference_range, is_abnormal, performed_by, verified_by, notes)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, FALSE), $7, $8, $9)
       RETURNING *`,
      [orderId, req.orgId, resultValue, unit, referenceRange, isAbnormal, performedBy, verifiedBy, notes]
    );
    // Also mark the order as completed
    await orgQuery(req.orgId, `UPDATE lab.lab_orders SET status = 'completed' WHERE order_id = $1`, [orderId]);
    // Re-fetch with joins
    const full = await orgQuery(req.orgId, `${RESULT_QUERY} WHERE r.result_id = $1`, [result.rows[0].result_id]);
    res.status(201).json(mapLabResult(full.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/laboratory/results/:id
router.put('/results/:id', async (req, res) => {
  try {
    const { resultValue, unit, referenceRange, isAbnormal, performedBy, verifiedBy, notes } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE lab.lab_results
       SET result_value = COALESCE($1, result_value), unit = COALESCE($2, unit),
           reference_range = COALESCE($3, reference_range), is_abnormal = COALESCE($4, is_abnormal),
           performed_by = COALESCE($5, performed_by), verified_by = COALESCE($6, verified_by),
           notes = COALESCE($7, notes)
       WHERE result_id = $8
       RETURNING *`,
      [resultValue, unit, referenceRange, isAbnormal, performedBy, verifiedBy, notes, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lab result not found' });
    const full = await orgQuery(req.orgId, `${RESULT_QUERY} WHERE r.result_id = $1`, [req.params.id]);
    res.json(mapLabResult(full.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Stats
// ============================================================================

// GET /api/laboratory/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalTests, totalOrders, pending, completed] = await Promise.all([
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM lab.lab_tests WHERE is_active = TRUE'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM lab.lab_orders'),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM lab.lab_orders WHERE status IN ('ordered', 'collected', 'in_progress')"),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM lab.lab_orders WHERE status = 'completed'")
    ]);
    res.json({
      totalTests: parseInt(totalTests.rows[0].count, 10),
      totalOrders: parseInt(totalOrders.rows[0].count, 10),
      pending: parseInt(pending.rows[0].count, 10),
      completed: parseInt(completed.rows[0].count, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
