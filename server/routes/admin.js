const express = require('express');
const { orgQuery } = require('../db');

const router = express.Router();

// ============================================================================
// Users
// ============================================================================

function mapUser(row) {
  return {
    id: row.user_id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    name: `${row.first_name} ${row.last_name}`,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    jobTitle: row.job_title,
    licenseNumber: row.license_number,
    specialization: row.specialization,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    departmentId: row.department_id,
    departmentName: row.department_name || null,
    roles: row.roles || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT u.*,
              d.name AS department_name,
              COALESCE(
                json_agg(
                  json_build_object('roleId', r.role_id, 'roleName', r.name)
                ) FILTER (WHERE r.role_id IS NOT NULL),
                '[]'
              ) AS roles
       FROM core.users u
       LEFT JOIN core.departments d ON d.department_id = u.department_id
       LEFT JOIN core.user_roles ur ON ur.user_id = u.user_id
       LEFT JOIN core.roles r ON r.role_id = ur.role_id
       WHERE u.org_id = $1
       GROUP BY u.user_id, d.name
       ORDER BY u.created_at DESC`,
      [req.orgId]
    );
    res.json({ data: result.rows.map(mapUser), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT u.*,
              d.name AS department_name,
              COALESCE(
                json_agg(
                  json_build_object('roleId', r.role_id, 'roleName', r.name)
                ) FILTER (WHERE r.role_id IS NOT NULL),
                '[]'
              ) AS roles
       FROM core.users u
       LEFT JOIN core.departments d ON d.department_id = u.department_id
       LEFT JOIN core.user_roles ur ON ur.user_id = u.user_id
       LEFT JOIN core.roles r ON r.role_id = ur.role_id
       WHERE u.org_id = $1 AND u.user_id = $2
       GROUP BY u.user_id, d.name`,
      [req.orgId, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(mapUser(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users
router.post('/users', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, jobTitle, licenseNumber, specialization, departmentId, roleIds } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'email, password, firstName and lastName are required' });
    }
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO core.users (org_id, email, password_hash, first_name, last_name, phone, job_title, license_number, specialization, department_id)
       VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.orgId, email, password, firstName, lastName, phone || null, jobTitle || null, licenseNumber || null, specialization || null, departmentId || null]
    );
    const user = result.rows[0];

    // Assign roles if provided
    if (Array.isArray(roleIds) && roleIds.length > 0) {
      const values = roleIds.map((rid, i) => `($1, $${i + 2})`).join(', ');
      await orgQuery(req.orgId, `INSERT INTO core.user_roles (user_id, role_id) VALUES ${values}`, [user.user_id, ...roleIds]);
    }

    res.status(201).json({ id: user.user_id });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A user with this email already exists in the organization' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, jobTitle, licenseNumber, specialization, departmentId, isActive, roleIds } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE core.users
       SET email = COALESCE($3, email),
           first_name = COALESCE($4, first_name),
           last_name = COALESCE($5, last_name),
           phone = $6,
           job_title = $7,
           license_number = $8,
           specialization = $9,
           department_id = $10,
           is_active = COALESCE($11, is_active)
       WHERE org_id = $1 AND user_id = $2
       RETURNING *`,
      [req.orgId, req.params.id, email, firstName, lastName, phone || null, jobTitle || null, licenseNumber || null, specialization || null, departmentId || null, isActive]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    // Update roles if provided
    if (Array.isArray(roleIds)) {
      await orgQuery(req.orgId, 'DELETE FROM core.user_roles WHERE user_id = $1', [req.params.id]);
      if (roleIds.length > 0) {
        const values = roleIds.map((rid, i) => `($1, $${i + 2})`).join(', ');
        await orgQuery(req.orgId, `INSERT INTO core.user_roles (user_id, role_id) VALUES ${values}`, [req.params.id, ...roleIds]);
      }
    }

    res.json({ id: result.rows[0].user_id });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A user with this email already exists in the organization' });
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Roles
// ============================================================================

function mapRole(row) {
  return {
    id: row.role_id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
    userCount: parseInt(row.user_count, 10) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/admin/roles
router.get('/roles', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT r.*, COUNT(ur.user_id) AS user_count
       FROM core.roles r
       LEFT JOIN core.user_roles ur ON ur.role_id = r.role_id
       WHERE r.org_id = $1
       GROUP BY r.role_id
       ORDER BY r.created_at DESC`,
      [req.orgId]
    );
    res.json({ data: result.rows.map(mapRole), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/roles
router.post('/roles', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO core.roles (org_id, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [req.orgId, name, description || null]
    );
    res.status(201).json({ id: result.rows[0].role_id });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A role with this name already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/roles/:id
router.put('/roles/:id', async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE core.roles
       SET name = COALESCE($3, name),
           description = $4,
           is_active = COALESCE($5, is_active)
       WHERE org_id = $1 AND role_id = $2
       RETURNING *`,
      [req.orgId, req.params.id, name, description !== undefined ? description : null, isActive]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Role not found' });
    res.json({ id: result.rows[0].role_id });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A role with this name already exists' });
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Departments
// ============================================================================

function mapDepartment(row) {
  return {
    id: row.department_id,
    name: row.name,
    description: row.description,
    phone: row.phone,
    isActive: row.is_active,
    userCount: parseInt(row.user_count, 10) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/admin/departments
router.get('/departments', async (req, res) => {
  try {
    const result = await orgQuery(
      req.orgId,
      `SELECT d.*, COUNT(u.user_id) AS user_count
       FROM core.departments d
       LEFT JOIN core.users u ON u.department_id = d.department_id
       WHERE d.org_id = $1
       GROUP BY d.department_id
       ORDER BY d.created_at DESC`,
      [req.orgId]
    );
    res.json({ data: result.rows.map(mapDepartment), total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/departments
router.post('/departments', async (req, res) => {
  try {
    const { name, description, phone } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const result = await orgQuery(
      req.orgId,
      `INSERT INTO core.departments (org_id, name, description, phone) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.orgId, name, description || null, phone || null]
    );
    res.status(201).json({ id: result.rows[0].department_id });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A department with this name already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/departments/:id
router.put('/departments/:id', async (req, res) => {
  try {
    const { name, description, phone, isActive } = req.body;
    const result = await orgQuery(
      req.orgId,
      `UPDATE core.departments
       SET name = COALESCE($3, name),
           description = $4,
           phone = $5,
           is_active = COALESCE($6, is_active)
       WHERE org_id = $1 AND department_id = $2
       RETURNING *`,
      [req.orgId, req.params.id, name, description !== undefined ? description : null, phone || null, isActive]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Department not found' });
    res.json({ id: result.rows[0].department_id });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A department with this name already exists' });
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Admin Stats
// ============================================================================

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const usersResult = await orgQuery(
      req.orgId,
      `SELECT
         COUNT(*) AS total_users,
         COUNT(*) FILTER (WHERE is_active = true) AS active_users,
         COUNT(*) FILTER (WHERE is_active = false) AS inactive_users,
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS new_this_month
       FROM core.users WHERE org_id = $1`,
      [req.orgId]
    );
    const rolesResult = await orgQuery(
      req.orgId,
      `SELECT COUNT(*) AS total_roles FROM core.roles WHERE org_id = $1`,
      [req.orgId]
    );
    const deptsResult = await orgQuery(
      req.orgId,
      `SELECT COUNT(*) AS total_departments FROM core.departments WHERE org_id = $1`,
      [req.orgId]
    );

    const u = usersResult.rows[0];
    res.json({
      totalUsers: parseInt(u.total_users, 10),
      activeUsers: parseInt(u.active_users, 10),
      inactiveUsers: parseInt(u.inactive_users, 10),
      newThisMonth: parseInt(u.new_this_month, 10),
      totalRoles: parseInt(rolesResult.rows[0].total_roles, 10),
      totalDepartments: parseInt(deptsResult.rows[0].total_departments, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
