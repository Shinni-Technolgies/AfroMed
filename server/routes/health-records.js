const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

function mapRecord(row) {
  return {
    id: row.record_id,
    patientName: row.patient_name,
    providerName: row.provider_name,
    chiefComplaint: row.chief_complaint,
    historyOfPresentIllness: row.history_of_present_illness,
    examinationFindings: row.examination_findings,
    treatmentPlan: row.treatment_plan,
    notes: row.notes,
    appointmentId: row.appointment_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const RECORD_QUERY = `
  SELECT mr.*,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    CONCAT(u.first_name, ' ', u.last_name) AS provider_name
  FROM clinical.medical_records mr
  JOIN patient.patients p ON p.patient_id = mr.patient_id
  JOIN core.users u ON u.user_id = mr.provider_id
`;

// GET /api/health-records
router.get('/', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${RECORD_QUERY} ORDER BY mr.created_at DESC`
    );
    res.json({ data: result.rows.map(mapRecord), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/health-records/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalRecords, totalDiagnoses, totalVitals, totalPrescriptions] = await Promise.all([
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM clinical.medical_records'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM clinical.diagnoses'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM clinical.vitals'),
      orgQuery(req.orgId, 'SELECT COUNT(*) FROM pharmacy.prescriptions'),
    ]);
    res.json({
      totalRecords: parseInt(totalRecords.rows[0].count, 10),
      diagnoses: parseInt(totalDiagnoses.rows[0].count, 10),
      vitals: parseInt(totalVitals.rows[0].count, 10),
      prescriptions: parseInt(totalPrescriptions.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/health-records/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${RECORD_QUERY} WHERE mr.record_id = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Health record not found' });
    res.json(mapRecord(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
