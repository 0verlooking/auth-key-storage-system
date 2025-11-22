#!/bin/bash

# ========================================
# Скрипт для вставки тестових користувачів
# ========================================

echo "🔧 Вставка тестових користувачів в БД..."

docker exec -i auth-storage-postgres psql -U postgres -d authkey_db <<'EOF'

-- Видалити існуючих тестових користувачів
DELETE FROM users WHERE email IN ('test@example.com', 'admin@example.com', 'demo@example.com');

-- ===========================================
-- КОРИСТУВАЧ 1: test@example.com
-- Password: Test123!
-- Master Password: Test123!
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
    gen_random_uuid(),
    'testuser',
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Test',
    'User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    true,
    false,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ===========================================
-- КОРИСТУВАЧ 2: admin@example.com
-- Password: Admin123!
-- Master Password: Admin123!
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
    gen_random_uuid(),
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
);

-- Показати створених користувачів
SELECT '✅ Користувачі створені!' as status;
SELECT email, username, first_name, last_name, email_verified FROM users WHERE email IN ('test@example.com', 'admin@example.com');

EOF

echo ""
echo "✅ Готово!"
echo ""
echo "📋 Тестові користувачі:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Email: test@example.com"
echo "   Password: Test123!"
echo "   Master Password: Test123!"
echo ""
echo "2. Email: admin@example.com"
echo "   Password: Admin123!"
echo "   Master Password: Admin123!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Тепер можете логінитись на http://localhost"
echo ""
