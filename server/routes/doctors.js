const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

function mapDoctor(row) {
  return {
    id: row.user_id,
    name: `${row.first_name} ${row.last_name}`,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    specialty: row.specialization || 'General Medicine',
    jobTitle: row.job_title,
    licenseNumber: row.license_number,
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
    departmentId: row.department_id,
    departmentName: row.department_name || null,
    createdAt: row.created_at,
  };
}

// Doctors are core.users who have a role containing 'doctor' (case-insensitive)
const DOCTOR_BASE_QUERY = `
  SELECT DISTINCT u.*, d.name AS department_name
  FROM core.users u
  JOIN core.user_roles ur ON ur.user_id = u.user_id
  JOIN core.roles r ON r.role_id = ur.role_id
  LEFT JOIN core.departments d ON d.department_id = u.department_id
  WHERE LOWER(r.name) LIKE '%doctor%' OR LOWER(r.name) LIKE '%physician%'
`;

// GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${DOCTOR_BASE_QUERY} ORDER BY u.created_at DESC`
    );
    res.json({ data: result.rows.map(mapDoctor), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/stats
router.get('/stats', async (req, res) => {
  try {
    const [total, active, inactive, specialists] = await Promise.all([
      orgQuery(req.orgId, `SELECT COUNT(DISTINCT u.user_id) FROM core.users u JOIN core.user_roles ur ON ur.user_id = u.user_id JOIN core.roles r ON r.role_id = ur.role_id WHERE LOWER(r.name) LIKE '%doctor%' OR LOWER(r.name) LIKE '%physician%'`),
      orgQuery(req.orgId, `SELECT COUNT(DISTINCT u.user_id) FROM core.users u JOIN core.user_roles ur ON ur.user_id = u.user_id JOIN core.roles r ON r.role_id = ur.role_id WHERE (LOWER(r.name) LIKE '%doctor%' OR LOWER(r.name) LIKE '%physician%') AND u.is_active = true`),
      orgQuery(req.orgId, `SELECT COUNT(DISTINCT u.user_id) FROM core.users u JOIN core.user_roles ur ON ur.user_id = u.user_id JOIN core.roles r ON r.role_id = ur.role_id WHERE (LOWER(r.name) LIKE '%doctor%' OR LOWER(r.name) LIKE '%physician%') AND u.is_active = false`),
      orgQuery(req.orgId, `SELECT COUNT(DISTINCT u.user_id) FROM core.users u JOIN core.user_roles ur ON ur.user_id = u.user_id JOIN core.roles r ON r.role_id = ur.role_id WHERE (LOWER(r.name) LIKE '%doctor%' OR LOWER(r.name) LIKE '%physician%') AND u.specialization IS NOT NULL AND u.specialization != 'General Medicine'`),
    ]);
    res.json({
      totalDoctors: parseInt(total.rows[0].count, 10),
      onDuty: parseInt(active.rows[0].count, 10),
      onLeave: parseInt(inactive.rows[0].count, 10),
      specialists: parseInt(specialists.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `${DOCTOR_BASE_QUERY} AND u.user_id = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(mapDoctor(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
