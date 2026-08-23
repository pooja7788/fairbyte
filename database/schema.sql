-- =============================================================================
-- RestoX Database Schema
-- Tables: user_signups, user_emails, user_information, user_ids
-- Compatible with PostgreSQL / Supabase
-- =============================================================================

-- Enable the pgcrypto / uuid extension for non-sequential, cryptographically secure IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Table 0: user_signups  ← PRIMARY SIGNUP DATA CAPTURE TABLE
-- Stores every "Create Account" form submission in clear, structured format.
-- Captured fields: Full Name, Email, Phone
-- NOT stored: Password, OTP, any authentication secret
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_signups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),   -- unique record ID
    full_name       VARCHAR(255) NOT NULL,                        -- from "Full Name" field
    email           VARCHAR(255),                                 -- if user typed email
    phone           VARCHAR(30),                                  -- if user typed mobile number
    raw_input       VARCHAR(255) NOT NULL,                        -- original "Email or Mobile" value (as typed)
    accepted_terms  BOOLEAN DEFAULT TRUE NOT NULL,                -- checkbox: "I agree to Terms"
    signed_up_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    otp_verified    BOOLEAN DEFAULT FALSE NOT NULL,               -- true after OTP confirmation
    verified_at     TIMESTAMP WITH TIME ZONE                      -- when OTP was verified
);

-- Indexes for user_signups
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_signups_email ON user_signups (email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_signups_phone ON user_signups (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_signups_signed_up_at ON user_signups (signed_up_at DESC);



-- =============================================================================
-- Table 3: user_emails
-- Captures every unique email entered by users during login/signup
-- This is the primary email collection table.
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_emails (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(255) NOT NULL UNIQUE,
    first_seen_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_seen_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    login_count    INTEGER DEFAULT 1 NOT NULL,
    source         VARCHAR(50) DEFAULT 'login' NOT NULL  -- 'login' | 'signup' | 'guest'
);

-- Indexes for user_emails
CREATE INDEX IF NOT EXISTS idx_user_emails_email ON user_emails (email);
CREATE INDEX IF NOT EXISTS idx_user_emails_last_seen ON user_emails (last_seen_at DESC);

-- =============================================================================
-- SQL: Upsert pattern for user_emails
-- Insert the email if new, or update last_seen_at and increment login_count if it already exists
-- =============================================================================
-- INSERT INTO user_emails (email, source)
-- VALUES ('pooja.reddy@example.com', 'login')
-- ON CONFLICT (email) DO UPDATE
--   SET last_seen_at = CURRENT_TIMESTAMP,
--       login_count  = user_emails.login_count + 1;



-- =============================================================================
-- Table 1: user_information
-- Stores core customer profile information without authentication secrets
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_information (
    user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    phone       VARCHAR(20),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for user_information
CREATE INDEX IF NOT EXISTS idx_user_information_email ON user_information (email);
CREATE INDEX IF NOT EXISTS idx_user_information_created_at ON user_information (created_at DESC);

-- =============================================================================
-- Table 2: user_ids
-- Stores non-sequential, randomly generated external identifiers separately
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_ids (
    id_record_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL,
    external_id   VARCHAR(64) NOT NULL UNIQUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign Key establishing the relationship to user_information
    CONSTRAINT fk_user_ids_user_information
        FOREIGN KEY (user_id)
        REFERENCES user_information(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Indexes for user_ids
CREATE INDEX IF NOT EXISTS idx_user_ids_user_id ON user_ids (user_id);
CREATE INDEX IF NOT EXISTS idx_user_ids_external_id ON user_ids (external_id);

-- =============================================================================
-- Optional Trigger: Automatically update updated_at on user_information modification
-- =============================================================================
CREATE OR REPLACE FUNCTION update_user_information_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_information_updated_at ON user_information;
CREATE TRIGGER trg_user_information_updated_at
    BEFORE UPDATE ON user_information
    FOR EACH ROW
    EXECUTE FUNCTION update_user_information_timestamp();

-- =============================================================================
-- Example 1: Inserting a New User & Associated External ID (Atomic Transaction)
-- Generates a random non-sequential user_id and random external identifier
-- =============================================================================
WITH new_user AS (
    INSERT INTO user_information (
        user_id,
        name,
        email,
        phone
    ) VALUES (
        gen_random_uuid(),
        'Pooja Reddy',
        'pooja.reddy@example.com',
        '+91 98450 12345'
    )
    RETURNING user_id
)
INSERT INTO user_ids (
    id_record_id,
    user_id,
    external_id
)
SELECT 
    gen_random_uuid(),
    user_id,
    'usr_' || encode(gen_random_bytes(12), 'hex') -- Random 24-character hex ID (e.g., usr_a3f89b1c4e7208d4e5f67a91)
FROM new_user
RETURNING id_record_id, user_id, external_id;

-- =============================================================================
-- Example 2: Querying User Profile with Joined External ID
-- =============================================================================
SELECT 
    ui.user_id,
    ui.name,
    ui.email,
    ui.phone,
    u_ids.external_id,
    ui.created_at,
    ui.updated_at
FROM user_information ui
INNER JOIN user_ids u_ids ON ui.user_id = u_ids.user_id
WHERE ui.email = 'pooja.reddy@example.com';
