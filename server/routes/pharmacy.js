const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

function mapMedication(row) {
  return {
    id: row.medication_id,
    name: row.name,
    genericName: row.generic_name,
    category: row.category,
    dosageForm: row.dosage_form,
    strength: row.strength,
    manufacturer: row.manufacturer,
    requiresPrescription: row.requires_prescription,
    isActive: row.is_active,
    // inventory fields (joined)
    stockQty: row.quantity_in_stock ?? null,
    reorderLevel: row.reorder_level ?? null,
    unitPrice: row.unit_cost ? parseFloat(row.unit_cost) : null,
    expiryDate: row.expiry_date,
    batchNumber: row.batch_number,
  };
}

const MED_QUERY = `
  SELECT m.*, i.quantity_in_stock, i.reorder_level, i.unit_cost, i.expiry_date, i.batch_number
  FROM pharmacy.medications m
  LEFT JOIN pharmacy.inventory i ON i.medication_id = m.medication_id AND i.org_id = m.org_id
`;

// GET /api/pharmacy/medications
router.get('/medications', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${MED_QUERY} ORDER BY m.created_at DESC`
    );
    res.json({ data: result.rows.map(mapMedication), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pharmacy/stats
router.get('/stats', async (req, res) => {
  try {
    const [total, inStock, lowStock, outOfStock] = await Promise.all([
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM pharmacy.medications'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM pharmacy.inventory WHERE quantity_in_stock > reorder_level'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM pharmacy.inventory WHERE quantity_in_stock > 0 AND quantity_in_stock <= reorder_level'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM pharmacy.inventory WHERE quantity_in_stock = 0'),
    ]);
    res.json({
      totalMedications: parseInt(total.rows[0].count, 10),
      inStock: parseInt(inStock.rows[0].count, 10),
      lowStock: parseInt(lowStock.rows[0].count, 10),
      outOfStock: parseInt(outOfStock.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pharmacy/prescriptions
router.get('/prescriptions', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT pr.*, CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
              CONCAT(u.first_name, ' ', u.last_name) AS prescribed_by_name
       FROM pharmacy.prescriptions pr
       JOIN patient.patients p ON p.patient_id = pr.patient_id
       JOIN core.users u ON u.user_id = pr.prescribed_by
       ORDER BY pr.prescribed_at DESC`
    );
    res.json({ data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
