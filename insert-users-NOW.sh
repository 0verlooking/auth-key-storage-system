#!/bin/bash
echo "🔧 Вставка користувачів..."

docker exec -i auth-storage-postgres psql -U postgres -d authkey_db << 'SQL'
-- Очистити все
DELETE FROM auth_key_tags;
DELETE FROM auth_keys;
DELETE FROM folders;
DELETE FROM tags;
DELETE FROM share_links;
DELETE FROM audit_logs;
DELETE FROM users;

-- test@example.com / Test123!
INSERT INTO users (id, username, email, password, first_name, last_name, master_password_hash, email_verified, account_locked, failed_login_attempts, is_deleted, created_at, updated_at) 
VALUES (gen_random_uuid(), 'testuser', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Test', 'User', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- admin@example.com / Admin123!
INSERT INTO users (id, username, email, password, first_name, last_name, master_password_hash, email_verified, account_locked, failed_login_attempts, is_deleted, created_at, updated_at)
VALUES (gen_random_uuid(), 'admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT '✅ ГОТОВО!' as status;
SELECT email, username, first_name FROM users;
SQL

echo ""
echo "✅ Користувачі створені!"
echo ""
echo "📧 test@example.com"
echo "🔑 Password: Test123!"
echo "🔐 Master: Test123!"
echo ""
echo "📧 admin@example.com"
echo "🔑 Password: Admin123!"
echo "🔐 Master: Admin123!"
