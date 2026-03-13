require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./openapi');

const organizationsRouter = require('./routes/organizations');
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const pharmacyRouter = require('./routes/pharmacy');
const healthRecordsRouter = require('./routes/health-records');
const laboratoryRouter = require('./routes/laboratory');
const billingRouter = require('./routes/billing');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8080;

// Allow cross-origin requests from the Vite dev server (and any configured origin)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-org-id'],
  })
);

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Organizations — public, no org_id required
app.use('/api/organizations', organizationsRouter);

// Middleware: require x-org-id header and validate UUID format for tenant-scoped routes
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
app.use('/api/patients', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, patientsRouter);
app.use('/api/doctors', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, doctorsRouter);
app.use('/api/appointments', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, appointmentsRouter);
app.use('/api/pharmacy', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, pharmacyRouter);
app.use('/api/health-records', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, healthRecordsRouter);
app.use('/api/laboratory', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, laboratoryRouter);
app.use('/api/billing', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, billingRouter);
app.use('/api/admin', (req, res, next) => { if (!UUID_RE.test(req.headers['x-org-id'])) return res.status(400).json({ error: 'Missing or invalid x-org-id header' }); req.orgId = req.headers['x-org-id']; next(); }, adminRouter);

// API docs — available at http://localhost:8080/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'AfroMed API Docs',
  swaggerOptions: { defaultModelsExpandDepth: 1 },
}));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`AfroMed API server running on http://localhost:${PORT}`);
  console.log(`API docs:          http://localhost:${PORT}/api-docs`);
  console.log(`Database: ${process.env.DATABASE_URI?.replace(/:\/\/.*@/, '://<credentials>@')}`);
});
