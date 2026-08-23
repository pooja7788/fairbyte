-- =============================================================================
-- RestoX Database Schema
-- Two-Table Separation: User Information & Separate User IDs
-- Compatible with PostgreSQL / Supabase
-- =============================================================================

-- Enable the pgcrypto / uuid extension for non-sequential, cryptographically secure IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
