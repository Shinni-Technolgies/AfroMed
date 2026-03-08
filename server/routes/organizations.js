const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/organizations — list all active organizations (no RLS, public list)
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT org_id, name, slug, city, state, country, logo_url FROM core.organizations WHERE is_active = true ORDER BY name'
    );
    res.json({ data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
