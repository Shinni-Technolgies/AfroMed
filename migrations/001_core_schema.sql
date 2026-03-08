-- ============================================================================
-- AfroMed Database Migration 001: Core Schema
-- Creates: organizations, departments, roles, users, user_roles
-- ============================================================================

-- Create schemas for logical grouping
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS patient;
CREATE SCHEMA IF NOT EXISTS clinical;
CREATE SCHEMA IF NOT EXISTS pharmacy;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS lab;
CREATE SCHEMA IF NOT EXISTS audit;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Organizations (top-level tenant)
-- ============================================================================
CREATE TABLE core.organizations (
    org_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'Nigeria',
    postal_code     VARCHAR(20),
    phone           VARCHAR(30),
    email           VARCHAR(255),
    website         VARCHAR(255),
    logo_url        VARCHAR(500),
    license_number  VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Departments
-- ============================================================================
CREATE TABLE core.departments (
    department_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    phone           VARCHAR(30),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, name)
);

-- ============================================================================
-- Roles
-- ============================================================================
CREATE TABLE core.roles (
    role_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, name)
);

-- ============================================================================
-- Users (people using the app)
-- ============================================================================
CREATE TABLE core.users (
    user_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID NOT NULL REFERENCES core.organizations(org_id) ON DELETE CASCADE,
    department_id   UUID REFERENCES core.departments(department_id) ON DELETE SET NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(30),
    avatar_url      VARCHAR(500),
    job_title       VARCHAR(150),
    license_number  VARCHAR(100),
    specialization  VARCHAR(150),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (org_id, email)
);

-- ============================================================================
-- User-Role junction table
-- ============================================================================
CREATE TABLE core.user_roles (
    user_id         UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES core.roles(role_id) ON DELETE CASCADE,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- ============================================================================
-- Auto-update updated_at trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION core.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to core tables
CREATE TRIGGER trg_organizations_updated_at
    BEFORE UPDATE ON core.organizations
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_departments_updated_at
    BEFORE UPDATE ON core.departments
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_roles_updated_at
    BEFORE UPDATE ON core.roles
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON core.users
    FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
