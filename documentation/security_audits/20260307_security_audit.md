# AfroMed Security Audit Report

**Date:** 2026-03-07  
**Scope:** Full static analysis of source code, configuration files, and environment setup  
**Auditor:** GitHub Copilot (automated static analysis)  
**Classification:** CONFIDENTIAL — Internal Use Only

---

## Executive Summary

A static security audit of the AfroMed Medical Dashboard codebase identified **2 Critical**, **3 High**, **2 Medium**, and **2 Low/Informational** findings. The most urgent issues are:

1. A plaintext weak password committed in the `.env` file (though `.gitignore`-excluded, the file exists on disk).
2. Production source maps are enabled, exposing the full original TypeScript source to any client.
3. All API endpoints are completely unauthenticated — any user on the network can read or query all patient, doctor, and medical record data.

Given that AfroMed handles Protected Health Information (PHI), these findings represent significant HIPAA and data-privacy risk and should be remediated before any production deployment.

---

## Findings

### [CRITICAL-01] Plaintext Weak Default Password in `.env`

| Field      | Detail |
|------------|--------|
| **File**   | `.env` line 21 |
| **OWASP**  | A02 – Cryptographic Failures / A07 – Identification & Authentication Failures |
| **Risk**   | Critical |

**Evidence:**
```
DATABASE_URI=postgresql://postgres:password@localhost:5432/afromed
```

**Description:**  
The live `.env` file contains a real database connection string using the default PostgreSQL superuser (`postgres`) with the trivially guessable password `password`. Although `.env` is listed in `.gitignore`, the file exists on disk and could be:
- Accidentally committed if `.gitignore` is misconfigured or the file is force-added.
- Exposed if the project directory is shared, copied, or backed up without care (e.g., OneDrive sync — which is the current project location).
- Leaked through misconfigured error logging, debug endpoints, or directory traversal.

**Recommendation:**
- Use a strong, randomly generated password (≥ 24 characters, mixed charset).
- Never use the `postgres` superuser for application connections — create a least-privilege role.
- Use a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager) in staging/production.
- The `.env.example` correctly uses `DB_USER:DB_PASSWORD` placeholders — ensure the real `.env` follows this pattern and is never committed.

---

### [CRITICAL-02] Production Source Maps Enabled

| Field      | Detail |
|------------|--------|
| **File**   | `vite.config.ts` line 57 |
| **OWASP**  | A05 – Security Misconfiguration / A02 – Cryptographic Failures |
| **Risk**   | Critical |

**Evidence:**
```ts
build: {
  sourcemap: true,   // ← enables source maps unconditionally
  ...
}
```

**Description:**  
`sourcemap: true` in the Vite build config generates `.js.map` files and embeds `sourceMappingURL` references in every output bundle. This means any browser user can:
1. Open DevTools → Sources and read the full original TypeScript source code.
2. Discover internal business logic, API endpoint patterns, data structure field names, and comments.
3. Use this intelligence to craft targeted attacks against the API.

For a healthcare application this also risks inadvertently exposing PHI field names, internal IDs, or schema knowledge.

**Recommendation:**
```ts
// vite.config.ts
build: {
  sourcemap: mode !== 'production',   // only in dev/staging
  ...
}
```
Or use `hidden` source maps that are only accessible to your error-monitoring service (e.g., Sentry):
```ts
sourcemap: mode === 'production' ? 'hidden' : true,
```

---

### [HIGH-01] No Authentication or Authorization on Any API Route

| Field      | Detail |
|------------|--------|
| **Files**  | `server/routes/patients.js`, `server/routes/doctors.js`, `server/routes/appointments.js`, `server/routes/health-records.js`, `server/routes/pharmacy.js`, `server/index.js` |
| **OWASP**  | A01 – Broken Access Control / A07 – Identification & Authentication Failures |
| **Risk**   | High |

**Evidence:**  
All API routes are registered with no middleware gating:
```js
// server/index.js
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/pharmacy', pharmacyRouter);
app.use('/api/health-records', healthRecordsRouter);
```
There is no `authenticate` middleware, no JWT verification, no session check, and no role-based access control anywhere in the server codebase.

**Description:**  
Any unauthenticated user who can reach the backend port (8080) can:
- `GET /api/patients` — enumerate all patient records.
- `GET /api/health-records` — read all medical diagnoses, prescriptions, and lab results.
- `GET /api/appointments` — read the full appointment schedule.

This is a direct HIPAA violation if deployed in a real environment.

**Recommendation:**
- Implement authentication (e.g., JWT / OAuth 2.0) and add a `verifyToken` middleware to all sensitive routes.
- Implement role-based access control (RBAC): e.g., doctors can read their own patient records, admins can read all.
- Rate-limit `/api/` to prevent enumeration.

---

### [HIGH-02] Raw Database / Server Error Messages Leaked to Client

| Field      | Detail |
|------------|--------|
| **Files**  | All `server/routes/*.js` files |
| **OWASP**  | A05 – Security Misconfiguration / A09 – Security Logging & Monitoring Failures |
| **Risk**   | High |

**Evidence (repeated pattern in all route files):**
```js
} catch (err) {
  res.status(500).json({ error: err.message });
}
```

**Description:**  
`err.message` from a PostgreSQL error typically contains:
- The exact SQL query or table/column names that caused the error.
- Internal PostgreSQL error codes and constraint names.
- Potentially the database host/port if the connection fails.

This directly assists an attacker in mapping the database schema and crafting targeted injection or enumeration attacks.

**Recommendation:**
```js
} catch (err) {
  console.error('[route-name] DB error:', err);  // log full detail server-side only
  res.status(500).json({ error: 'An internal server error occurred.' });  // generic client message
}
```

---

### [HIGH-03] SSL Certificate Verification Disabled for Database Connections

| Field      | Detail |
|------------|--------|
| **File**   | `server/db.js` line 10 |
| **OWASP**  | A02 – Cryptographic Failures |
| **Risk**   | High |

**Evidence:**
```js
ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
```

**Description:**  
When `DATABASE_SSL=true` is set (required for cloud-hosted PostgreSQL such as Supabase, Neon, or Render), the SSL connection is established with `rejectUnauthorized: false`. This disables certificate chain validation, making the connection vulnerable to Man-in-the-Middle (MITM) attacks. An attacker on the same network could intercept all database traffic including queries and results containing PHI.

**Recommendation:**
```js
ssl: process.env.DATABASE_SSL === 'true'
  ? { rejectUnauthorized: true }   // enforce valid certificate
  : false,
```
If using a self-signed or custom CA, supply the CA certificate explicitly:
```js
ssl: process.env.DATABASE_SSL === 'true'
  ? { rejectUnauthorized: true, ca: fs.readFileSync(process.env.DATABASE_SSL_CA) }
  : false,
```

---

### [MEDIUM-01] Production Build Exposes `VITE_*` Environment Variables in Bundle

| Field      | Detail |
|------------|--------|
| **Files**  | `src/api/*.ts`, `src/routes/index.tsx`, `vite.config.ts` |
| **OWASP**  | A02 – Cryptographic Failures / A05 – Security Misconfiguration |
| **Risk**   | Medium |

**Evidence:**
```ts
// vite.config.ts — loads ALL env vars, not only VITE_ prefixed
const env = loadEnv(mode, process.cwd(), '');
```

**Description:**  
`loadEnv(mode, process.cwd(), '')` with an empty prefix string loads **every** environment variable, not just those prefixed with `VITE_`. The `env` object is then used to configure the proxy and other build settings. If any non-`VITE_` variable is accidentally referenced in a `define` block or passed to client-side code, server-side secrets (e.g., `DATABASE_URI`, `PORT`) would be embedded in the browser bundle.

Currently the risk is low because the non-`VITE_` variables (`DATABASE_URI`, `PORT`, `CORS_ORIGIN`) are only used within `vite.config.ts` server-side logic and not in `define`. However, the pattern is fragile — a future developer could accidentally expose them.

**Recommendation:**
```ts
// Load only VITE_ prefixed client variables
const env = loadEnv(mode, process.cwd());   // default prefix is 'VITE_'
// Load server/build-only vars separately if needed, and never pass them to define:
const serverEnv = loadEnv(mode, process.cwd(), '');
```

---

### [MEDIUM-02] Vite Preview Server Allows Parent Directory Traversal

| Field      | Detail |
|------------|--------|
| **File**   | `vite.config.ts` lines 23–27 |
| **OWASP**  | A01 – Broken Access Control |
| **Risk**   | Medium |

**Evidence:**
```ts
preview: {
  open: true,
  host: true,
  fs: {
    allow: ['..']   // ← allows serving files from parent directory
  }
},
```

**Description:**  
`fs.allow: ['..']` instructs the Vite preview server to serve files from the parent directory of the project root. Combined with `host: true` (which binds to all network interfaces, not just localhost), this means any machine on the local network could potentially request files from outside the `dist/` folder, including configuration files or other sensitive content in the parent directory.

**Recommendation:**
```ts
preview: {
  open: true,
  host: true,
  // Remove fs.allow unless specifically needed; Vite defaults to project root only
},
```

---

### [LOW-01] `PUBLIC_URL` Hardcoded to `http://localhost:3000` in `.env`

| Field      | Detail |
|------------|--------|
| **File**   | `.env` line 6 |
| **OWASP**  | A05 – Security Misconfiguration |
| **Risk**   | Low |

**Description:**  
The `PUBLIC_URL` is set to a localhost address in the committed `.env`. If this value is accidentally carried into a production build, it could cause absolute URL references to point at a non-existent or incorrect host, breaking functionality or causing information disclosure.

**Recommendation:**  
Ensure `PUBLIC_URL` is set to the correct public-facing domain in production environment config and is not sourced from the development `.env`.

---

### [LOW-02] Version Number Exposed in `VITE_APP_VERSION`

| Field      | Detail |
|------------|--------|
| **File**   | `.env` line 2 |
| **OWASP**  | A05 – Security Misconfiguration |
| **Risk**   | Low / Informational |

**Description:**  
`VITE_APP_VERSION=v1.0.0` is embedded in the client bundle. While this is a common practice for debugging, version disclosure assists attackers in identifying known vulnerabilities associated with a specific release.

**Recommendation:**  
Consider serving version info only to authenticated admin users, or omit it from public-facing builds.

---

## Summary Table

| ID           | Severity    | File(s)                                | OWASP Category                             | Status   |
|--------------|-------------|----------------------------------------|--------------------------------------------|----------|
| CRITICAL-01  | Critical    | `.env`                                 | A02, A07 – Weak Credentials                | Open     |
| CRITICAL-02  | Critical    | `vite.config.ts`                       | A05 – Source Map Exposure                  | Open     |
| HIGH-01      | High        | `server/routes/*.js`, `server/index.js`| A01, A07 – No Auth/AuthZ                   | Open     |
| HIGH-02      | High        | `server/routes/*.js`                   | A05, A09 – Error Info Leakage              | Open     |
| HIGH-03      | High        | `server/db.js`                         | A02 – Disabled TLS Cert Validation         | Open     |
| MEDIUM-01    | Medium      | `vite.config.ts`, `src/api/*.ts`       | A02, A05 – Env Var Over-exposure Risk      | Open     |
| MEDIUM-02    | Medium      | `vite.config.ts`                       | A01 – Preview Dir Traversal               | Open     |
| LOW-01       | Low         | `.env`                                 | A05 – Hardcoded Dev URL                   | Open     |
| LOW-02       | Low/Info    | `.env`                                 | A05 – Version Disclosure                  | Open     |

---

## Recommended Remediation Priority

1. **Immediate (before any deployment):**
   - Rotate the database password and assign a least-privilege DB role.
   - Disable production source maps or switch to `hidden`.
   - Add JWT authentication middleware to all API routes.
   - Replace `err.message` in HTTP responses with generic error strings.

2. **Short-Term:**
   - Fix `rejectUnauthorized: false` to `true` in `db.js`.
   - Restrict `loadEnv` to `VITE_` prefix only.
   - Remove `fs.allow: ['..']` from preview config.

3. **Ongoing:**
   - Set up a secrets manager for production credential injection.
   - Implement RBAC and audit logging for PHI access.
   - Integrate automated security scanning (e.g., `npm audit`, Snyk, OWASP ZAP) into CI/CD.

---

*End of Report*
