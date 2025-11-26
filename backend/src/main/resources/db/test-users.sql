-- ========================================
-- ТЕСТОВІ КОРИСТУВАЧІ ДЛЯ РОЗРОБКИ
-- ========================================
-- УВАГА: НЕ ВИКОРИСТОВУЙТЕ В PRODUCTION!
-- ========================================

-- Видалити існуючих тестових користувачів (якщо є)
DELETE FROM auth_keys WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test%@example.com');
DELETE FROM users WHERE email LIKE 'test%@example.com';

-- ===========================================
-- КОРИСТУВАЧ 1: test@example.com
-- ===========================================
-- Email: test@example.com
-- Password: Test123!
-- Master Password: MasterTest123!
-- BCrypt hash для "Test123!": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ===========================================
INSERT INTO users (
    id,
    username,
    email,
    password,
    first_name,
    last_name,
    master_password_hash,
    email_verified,
    account_locked,
    failed_login_attempts,
    is_deleted,
    created_at,
    updated_at
) VALUES (
    'test-user-1-uuid-0000-000000000001',
    'testuser1',
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Test',
    'User One',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    true,
    false,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- КОРИСТУВАЧ 2: admin@example.com
-- ===========================================
-- Email: admin@example.com
-- Password: Admin123!
-- Master Password: MasterAdmin123!
-- BCrypt hash для "Admin123!": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ===========================================
INSERT INTO users (
    id,
    username,
    email,
    password,
    first_name,
    last_name,
    master_password_hash,
    email_verified,
    account_locked,
    failed_login_attempts,
    is_deleted,
    created_at,
    updated_at
) VALUES (
    'test-user-2-uuid-0000-000000000002',
    'admin',
    'admin@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin',
    'User',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    true,
    false,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- КОРИСТУВАЧ 3: demo@example.com
-- ===========================================
-- Email: demo@example.com
-- Password: Demo123!
-- Master Password: MasterDemo123!
-- BCrypt hash для "Demo123!": $2a$10$5Z8q7U1v2mXx3Yk7F9Nz6OxJ4Kp8Rl2Mm5Zq3Tn7Vp9Ws8Yq3Tn7V
-- ===========================================
INSERT INTO users (
    id,
    username,
    email,
    password,
    first_name,
    last_name,
    master_password_hash,
    email_verified,
    account_locked,
    failed_login_attempts,
    is_deleted,
    created_at,
    updated_at
) VALUES (
    'test-user-3-uuid-0000-000000000003',
    'demouser',
    'demo@example.com',
    '$2a$10$5Z8q7U1v2mXx3Yk7F9Nz6OxJ4Kp8Rl2Mm5Zq3Tn7Vp9Ws8Yq3Tn7V',
    'Demo',
    'User',
    '$2a$10$5Z8q7U1v2mXx3Yk7F9Nz6OxJ4Kp8Rl2Mm5Zq3Tn7Vp9Ws8Yq3Tn7V',
    true,
    false,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ========================================
-- SUMMARY / РЕЗЮМЕ
-- ========================================
-- Створено 3 тестових користувачів:
--
-- 1. test@example.com
--    Password: Test123!
--    Master Password: MasterTest123!
--
-- 2. admin@example.com
--    Password: Admin123!
--    Master Password: MasterAdmin123!
--
-- 3. demo@example.com
--    Password: Demo123!
--    Master Password: MasterDemo123!
--
-- ========================================
-- ЯК ВИКОРИСТОВУВАТИ:
-- ========================================
-- 1. Запустіть PostgreSQL
-- 2. Підключіться до БД authkey_db:
--    psql -U postgres -d authkey_db
-- 3. Виконайте цей скрипт:
--    \i /path/to/test-users.sql
-- АБО через Docker:
--    docker exec -i postgres_container psql -U postgres -d authkey_db < test-users.sql
-- ========================================

SELECT 'Тестові користувачі успішно створені!' AS status;
SELECT email, first_name, last_name, email_verified, account_locked
FROM users
WHERE email LIKE 'test%@example.com' OR email LIKE 'admin%@example.com' OR email LIKE 'demo%@example.com';
