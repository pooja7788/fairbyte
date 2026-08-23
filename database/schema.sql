-- =============================================================================
-- RestoX Database Schema  (Run this in Supabase SQL Editor)
-- https://supabase.com/dashboard/project/mtffyaqvvuuuahctbpnl/sql
--
-- TABLE HIERARCHY (as per user requirement)
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. user_credentials  →  Login records (email + Supabase Auth user_id)
--                          Password is NEVER stored here — handled by Supabase Auth
-- 2. user_info         →  User profile details (name, email, phone, location)
--
-- Supabase Auth (auth.users) stores the hashed password automatically.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLE 1: user_credentials
-- Stores login records: which email logged in, when, and the Supabase user ID.
-- Linked to: Supabase auth.users via user_id
-- Passwords are NEVER stored here — Supabase Auth handles bcrypt hashing.
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_credentials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE,          -- FK to Supabase auth.users.id
    email           VARCHAR(255) NOT NULL UNIQUE,  -- login email address
    account_type    VARCHAR(30) DEFAULT 'email',   -- 'email' | 'google' | 'phone'
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id   ON user_credentials (user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_email     ON user_credentials (email);
CREATE INDEX IF NOT EXISTS idx_user_credentials_last_login ON user_credentials (last_login_at DESC);

-- =============================================================================
-- TABLE 2: user_info
-- Stores user profile details: name, email, phone, location.
-- Linked to user_credentials via user_id (same Supabase Auth user_id).
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_info (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE,          -- FK to Supabase auth.users.id
    full_name       VARCHAR(255) NOT NULL,          -- entered during signup
    email           VARCHAR(255) NOT NULL,          -- copy of login email for quick access
    phone           VARCHAR(30),                   -- optional phone number
    location        TEXT,                          -- delivery location / address text
    lat             DECIMAL(10, 7),                -- GPS latitude
    lng             DECIMAL(10, 7),                -- GPS longitude
    avatar_url      TEXT,                          -- profile picture URL
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_info_user_id ON user_info (user_id);
CREATE INDEX IF NOT EXISTS idx_user_info_email   ON user_info (email);

-- Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_user_info_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_info_updated_at ON user_info;
CREATE TRIGGER trg_user_info_updated_at
    BEFORE UPDATE ON user_info
    FOR EACH ROW
    EXECUTE FUNCTION update_user_info_timestamp();


-- =============================================================================
-- (Existing tables kept for backward compatibility)
-- =============================================================================

-- user_emails: tracks every email seen at login/signup
CREATE TABLE IF NOT EXISTS user_emails (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(255) NOT NULL UNIQUE,
    first_seen_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_seen_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    login_count    INTEGER DEFAULT 1 NOT NULL,
    source         VARCHAR(50) DEFAULT 'login' NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_emails_email     ON user_emails (email);
CREATE INDEX IF NOT EXISTS idx_user_emails_last_seen ON user_emails (last_seen_at DESC);

-- user_signups: form capture before OTP verification
CREATE TABLE IF NOT EXISTS user_signups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(30),
    raw_input       VARCHAR(255) NOT NULL,
    accepted_terms  BOOLEAN DEFAULT TRUE NOT NULL,
    signed_up_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    otp_verified    BOOLEAN DEFAULT FALSE NOT NULL,
    verified_at     TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_signups_email ON user_signups (email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_signups_phone        ON user_signups (phone) WHERE phone IS NOT NULL;


-- =============================================================================
-- HOW SIGNUP WORKS (code flow summary)
-- =============================================================================
-- 1. User fills form: Full Name, Email, Password
-- 2. signUpUser() calls supabase.auth.signUp({ email, password })
--    → Supabase stores HASHED password in auth.users (never accessible)
--    → Returns user_id (UUID)
-- 3. We INSERT into user_credentials: { user_id, email, account_type, created_at }
-- 4. We INSERT into user_info: { user_id, full_name, email, phone, ... }
-- 5. Done — user is logged in

-- =============================================================================
-- HOW LOGIN WORKS
-- =============================================================================
-- 1. User enters Email + Password
-- 2. signInUser() calls supabase.auth.signInWithPassword({ email, password })
--    → Supabase verifies hash — NEVER exposes password
-- 3. On success: UPDATE user_credentials SET last_login_at = NOW()
-- 4. Fetch profile from user_info
-- 5. Done — session token stored in browser

-- =============================================================================
-- HOW LOGOUT WORKS
-- =============================================================================
-- 1. signOutUser() calls supabase.auth.signOut()
-- 2. Browser session cleared — user is logged out
-- 3. App state reset to logged-out state

-- =============================================================================
-- EXAMPLE: Query a user's full profile
-- =============================================================================
-- SELECT
--     uc.email,
--     uc.last_login_at,
--     ui.full_name,
--     ui.phone,
--     ui.location
-- FROM user_credentials uc
-- JOIN user_info ui ON uc.user_id = ui.user_id
-- WHERE uc.email = 'pooja@example.com';
