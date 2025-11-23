-- ============================================================================
-- INSERT TEST USERS
-- ============================================================================
-- Password for test@example.com: Test123!
-- Password for admin@example.com: Admin123!
--
-- IMPORTANT: This script matches the actual User entity structure
-- ============================================================================

-- Clean up old data (respecting foreign key constraints)
DELETE FROM auth_key_tags;
DELETE FROM auth_keys;
DELETE FROM folders;
DELETE FROM tags;
DELETE FROM share_links;
DELETE FROM audit_logs;
DELETE FROM users;

-- Reset the sequence for users table
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- ============================================================================
-- User 1: test@example.com / Test123!
-- ============================================================================
INSERT INTO users (
    username,
    email,
    password,
    first_name,
    last_name,
    role,
    is_email_verified,
    email_verification_token,
    account_locked,
    failed_login_attempts,
    is_deleted,
    created_at,
    updated_at
) VALUES (
    'testuser',
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Test',
    'User',
    'USER',
    true,
    NULL,
    false,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================================================
-- User 2: admin@example.com / Admin123!
-- ============================================================================
INSERT INTO users (
    username,
    email,
    password,
    first_name,
    last_name,
    role,
    is_email_verified,
    email_verification_token,
    account_locked,
    failed_login_attempts,
    is_deleted,
    created_at,
    updated_at
) VALUES (
    'admin',
    'admin@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin',
    'User',
    'ADMIN',
    true,
    NULL,
    false,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================================================
-- Verify inserted users
-- ============================================================================
SELECT
    id,
    username,
    email,
    first_name,
    last_name,
    role,
    is_email_verified,
    account_locked,
    created_at
FROM users
ORDER BY id;
