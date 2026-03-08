const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

function mapAppointment(row) {
  return {
    id: row.appointment_id,
    patientName: row.patient_name,
    doctor: row.provider_name,
    department: row.department_name || null,
    dateTime: row.scheduled_at,
    durationMin: row.duration_min,
    type: row.visit_type,
    status: row.status,
    reason: row.reason,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

const LIST_QUERY = `
  SELECT a.*,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    CONCAT(u.first_name, ' ', u.last_name) AS provider_name,
    d.name AS department_name
  FROM clinical.appointments a
  JOIN patient.patients p ON p.patient_id = a.patient_id
  JOIN core.users u ON u.user_id = a.provider_id
  LEFT JOIN core.departments d ON d.department_id = a.department_id
`;

// GET /api/appointments
router.get('/', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${LIST_QUERY} ORDER BY a.scheduled_at DESC`
    );
    res.json({ data: result.rows.map(mapAppointment), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments/stats
router.get('/stats', async (req, res) => {
  try {
    const [today, upcoming, completed, cancelled] = await Promise.all([
      orgQuery(req.orgId, "SELECT COUNT(*) FROM clinical.appointments WHERE scheduled_at::date = CURRENT_DATE"),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM clinical.appointments WHERE status = 'scheduled' AND scheduled_at > NOW()"),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM clinical.appointments WHERE status = 'completed'"),
      orgQuery(req.orgId, "SELECT COUNT(*) FROM clinical.appointments WHERE status = 'cancelled'"),
    ]);
    res.json({
      todayAppointments: parseInt(today.rows[0].count, 10),
      upcoming: parseInt(upcoming.rows[0].count, 10),
      completed: parseInt(completed.rows[0].count, 10),
      cancelled: parseInt(cancelled.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${LIST_QUERY} WHERE a.appointment_id = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json(mapAppointment(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
