const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

function mapPatient(row) {
  return {
    id: row.patient_id,
    firstName: row.first_name,
    lastName: row.last_name,
    name: `${row.first_name} ${row.last_name}`,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    bloodType: row.blood_type,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    state: row.state,
    country: row.country,
    medicalRecordNumber: row.medical_record_number,
    emergencyContactName: row.emergency_contact_name,
    emergencyContactPhone: row.emergency_contact_phone,
    allergies: row.allergies,
    notes: row.notes,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/patients
router.get('/', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      'SELECT * FROM patient.patients ORDER BY created_at DESC'
    );
    res.json({ data: result.rows.map(mapPatient), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/stats
router.get('/stats', async (req, res) => {
  try {
    const [total, monthly, active, inactive] = await Promise.all([
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM patient.patients'),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM patient.patients WHERE created_at >= date_trunc('month', CURRENT_DATE)"),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM patient.patients WHERE is_active = true'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM patient.patients WHERE is_active = false'),
    ]);
    res.json({
      totalPatients: parseInt(total.rows[0].count, 10),
      newThisMonth: parseInt(monthly.rows[0].count, 10),
      activeCases: parseInt(active.rows[0].count, 10),
      discharged: parseInt(inactive.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      'SELECT * FROM patient.patients WHERE patient_id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(mapPatient(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
