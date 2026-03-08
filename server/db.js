require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI environment variable is not set. Check your .env file.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err);
  process.exit(1);
});

/**
 * Run a query scoped to an organization.
 * Sets `app.current_org_id` on the connection so RLS policies filter rows.
 * Falls back to plain pool.query when no orgId is needed (e.g. listing orgs).
 */
async function orgQuery(orgId, text, params) {
  const client = await pool.connect();
  try {
    await client.query("SELECT set_config('app.current_org_id', $1, true)", [orgId]);
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

module.exports = pool;
module.exports.pool = pool;
module.exports.orgQuery = orgQuery;
