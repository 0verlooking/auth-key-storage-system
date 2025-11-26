-- ============================================================================
-- Test Data for Auth Key Storage System
-- ============================================================================
-- This script adds sample auth keys for testing
-- User: test@example.com (ID: 1)
-- Admin: admin@example.com (ID: 2)
-- ============================================================================

-- Sample Folders for test user
INSERT INTO folders (name, description, color, icon, user_id, created_at, updated_at, is_deleted)
VALUES
    ('Work', 'Work-related credentials', '#2196F3', 'work', 1, NOW(), NOW(), false),
    ('Personal', 'Personal accounts', '#4CAF50', 'person', 1, NOW(), NOW(), false),
    ('Development', 'Dev tools and API keys', '#FF9800', 'code', 1, NOW(), NOW(), false)
ON CONFLICT DO NOTHING;

-- Sample Tags for test user
INSERT INTO tags (name, color, user_id, created_at, updated_at, is_deleted)
VALUES
    ('Important', '#F44336', 1, NOW(), NOW(), false),
    ('Shared', '#9C27B0', 1, NOW(), NOW(), false),
    ('Development', '#00BCD4', 1, NOW(), NOW(), false)
ON CONFLICT DO NOTHING;

-- Sample Auth Keys for test user (ID: 1)
-- NOTE: These are EXAMPLE encrypted values. In real use, they would be encrypted with user's master password.
INSERT INTO auth_keys (
    title, description, key_type, username, email,
    encrypted_value, encryption_iv, encryption_salt,
    url, notes, is_favorite, access_count, password_strength,
    user_id, folder_id, created_at, updated_at, is_deleted
)
VALUES
    -- Work folder keys
    (
        'GitHub Account',
        'Main GitHub account for work projects',
        'PASSWORD',
        'john.doe',
        'john.doe@company.com',
        'U2FsdGVkX19JkzL5K9vZxE8nQ2bR3mN5pQ7sT1uV4wX=', -- Example encrypted value
        'YWJjZGVmZ2hpamts', -- Example IV (base64)
        'bW5vcHFyc3R1dnd4', -- Example salt (base64)
        'https://github.com',
        'Use 2FA when logging in from new devices',
        true,
        15,
        85,
        1, -- test user
        (SELECT id FROM folders WHERE name = 'Work' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),
    (
        'Company VPN',
        'VPN access for remote work',
        'PASSWORD',
        'john.doe',
        NULL,
        'U2FsdGVkX1+qW3rY8pL9mN4oK5bC2nX7sR1tT6uY3wV=',
        'eXl6YWJjZGVmZ2hp',
        'aWprbG1ub3BxcnN0',
        'https://vpn.company.com',
        'Connect before accessing internal resources',
        false,
        42,
        90,
        1,
        (SELECT id FROM folders WHERE name = 'Work' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),
    (
        'Jira',
        'Project management tool',
        'PASSWORD',
        'j.doe@company.com',
        'j.doe@company.com',
        'U2FsdGVkX1/pL9mN4oK5bC2nX7sR1tT6uY3wV8qW3rY=',
        'ZGVmZ2hpamtsbW5v',
        'cHFyc3R1dnd4eXph',
        'https://company.atlassian.net',
        'Used for sprint planning and bug tracking',
        false,
        28,
        78,
        1,
        (SELECT id FROM folders WHERE name = 'Work' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),

    -- Personal folder keys
    (
        'Gmail',
        'Personal email account',
        'PASSWORD',
        'john.personal@gmail.com',
        'john.personal@gmail.com',
        'U2FsdGVkX1+mN4oK5bC2nX7sR1tT6uY3wV8qW3rYpL9=',
        'aWprbG1ub3BxcnN0',
        'dXZ3eHl6YWJjZGVm',
        'https://mail.google.com',
        'Recovery email: backup@email.com',
        true,
        67,
        92,
        1,
        (SELECT id FROM folders WHERE name = 'Personal' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),
    (
        'Amazon',
        'Online shopping account',
        'PASSWORD',
        'john.personal@gmail.com',
        'john.personal@gmail.com',
        'U2FsdGVkX19oK5bC2nX7sR1tT6uY3wV8qW3rYpL9mN4=',
        'bW5vcHFyc3R1dnd4',
        'eXphYmNkZWZnaGlq',
        'https://amazon.com',
        'Prime membership active',
        false,
        12,
        75,
        1,
        (SELECT id FROM folders WHERE name = 'Personal' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),

    -- Development folder keys
    (
        'AWS API Key',
        'AWS production environment access',
        'API_KEY',
        NULL,
        NULL,
        'U2FsdGVkX1/C2nX7sR1tT6uY3wV8qW3rYpL9mN4oK5b=',
        'cHFyc3R1dnd4eXph',
        'YmNkZWZnaGlqa2xt',
        'https://console.aws.amazon.com',
        'Use for production deployments only. Expires: 2025-12-31',
        true,
        8,
        NULL,
        1,
        (SELECT id FROM folders WHERE name = 'Development' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),
    (
        'OpenAI API Key',
        'API key for GPT integration',
        'API_KEY',
        NULL,
        NULL,
        'U2FsdGVkX19X7sR1tT6uY3wV8qW3rYpL9mN4oK5bC2n=',
        'c3R1dnd4eXphYmNk',
        'ZWZnaGlqa2xtbm9w',
        'https://platform.openai.com',
        'Monthly quota: $100. Used for chatbot feature.',
        false,
        25,
        NULL,
        1,
        (SELECT id FROM folders WHERE name = 'Development' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),
    (
        'GitHub Personal Access Token',
        'PAT for CI/CD pipelines',
        'TOKEN',
        NULL,
        NULL,
        'U2FsdGVkX1+R1tT6uY3wV8qW3rYpL9mN4oK5bC2nX7s=',
        'dXZ3eHl6YWJjZGVm',
        'Z2hpamtsbW5vcHFy',
        'https://github.com/settings/tokens',
        'Permissions: repo, workflow, read:packages',
        false,
        18,
        NULL,
        1,
        (SELECT id FROM folders WHERE name = 'Development' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),
    (
        'SSH Key - Production Server',
        'SSH private key for production',
        'SSH_KEY',
        'deploy',
        NULL,
        'U2FsdGVkX18T6uY3wV8qW3rYpL9mN4oK5bC2nX7sR1t=',
        'Z2hpamtsbW5vcHFy',
        'c3R1dnd4eXphYmNk',
        'ssh://prod-server-01.company.com',
        'RSA 4096-bit key. Fingerprint: SHA256:abc123...',
        false,
        5,
        NULL,
        1,
        (SELECT id FROM folders WHERE name = 'Development' AND user_id = 1 LIMIT 1),
        NOW(),
        NOW(),
        false
    ),

    -- Keys without folder
    (
        'Google Authenticator Backup',
        'Recovery codes for 2FA',
        'RECOVERY_CODE',
        NULL,
        NULL,
        'U2FsdGVkX1+Y3wV8qW3rYpL9mN4oK5bC2nX7sR1tT6u=',
        'aWprbG1ub3BxcnN0',
        'dXZ3eHl6YWJjZGVm',
        NULL,
        'Store in safe place. Used if phone is lost.',
        true,
        0,
        NULL,
        1,
        NULL,
        NOW(),
        NOW(),
        false
    );

-- Sample Auth Keys for admin user (ID: 2)
INSERT INTO auth_keys (
    title, description, key_type, username, email,
    encrypted_value, encryption_iv, encryption_salt,
    url, notes, is_favorite, access_count, password_strength,
    user_id, created_at, updated_at, is_deleted
)
VALUES
    (
        'System Admin Panel',
        'Admin access to system dashboard',
        'PASSWORD',
        'admin',
        'admin@example.com',
        'U2FsdGVkX19wV8qW3rYpL9mN4oK5bC2nX7sR1tT6uY3=',
        'bm9wcHFyc3R1dnd4',
        'eXphYmNkZWZnaGlq',
        'https://admin.system.com',
        'Full system access. Use with caution.',
        true,
        125,
        95,
        2,
        NOW(),
        NOW(),
        false
    ),
    (
        'Database Root Password',
        'PostgreSQL superuser password',
        'PASSWORD',
        'postgres',
        NULL,
        'U2FsdGVkX1/qW3rYpL9mN4oK5bC2nX7sR1tT6uY3wV8=',
        'cHFyc3R1dnd4eXph',
        'YmNkZWZnaGlqa2xt',
        'postgresql://db.system.com:5432',
        'Production database. Backup before any changes!',
        true,
        45,
        98,
        2,
        NOW(),
        NOW(),
        false
    ),
    (
        'SSL Certificate Private Key',
        'Wildcard SSL cert for *.system.com',
        'CERTIFICATE',
        NULL,
        NULL,
        'U2FsdGVkX1+3rYpL9mN4oK5bC2nX7sR1tT6uY3wV8qW=',
        'c3R1dnd4eXphYmNk',
        'ZWZnaGlqa2xtbm9w',
        NULL,
        'Expires: 2026-06-15. Renew 30 days before expiration.',
        false,
        3,
        NULL,
        2,
        NOW(),
        NOW(),
        false
    ),
    (
        'Monitoring API Token',
        'Grafana admin API token',
        'TOKEN',
        NULL,
        NULL,
        'U2FsdGVkX19pL9mN4oK5bC2nX7sR1tT6uY3wV8qW3rY=',
        'dXZ3eHl6YWJjZGVm',
        'Z2hpamtsbW5vcHFy',
        'https://monitoring.system.com',
        'Full access to all dashboards and alerts',
        false,
        67,
        NULL,
        2,
        NOW(),
        NOW(),
        false
    );

-- Link tags to auth keys (for test user)
INSERT INTO auth_key_tags (auth_key_id, tag_id)
SELECT ak.id, t.id
FROM auth_keys ak
CROSS JOIN tags t
WHERE ak.user_id = 1
  AND t.user_id = 1
  AND (
    (ak.title = 'GitHub Account' AND t.name = 'Important') OR
    (ak.title = 'AWS API Key' AND t.name = 'Important') OR
    (ak.title = 'AWS API Key' AND t.name = 'Development') OR
    (ak.title = 'OpenAI API Key' AND t.name = 'Development') OR
    (ak.title = 'GitHub Personal Access Token' AND t.name = 'Development')
  )
ON CONFLICT DO NOTHING;

-- Add audit log entries for some actions
INSERT INTO audit_logs (
    user_id, auth_key_id, action, ip_address, user_agent, metadata,
    created_at
)
VALUES
    (1, (SELECT id FROM auth_keys WHERE title = 'GitHub Account' AND user_id = 1 LIMIT 1),
     'AUTH_KEY_CREATED', '192.168.1.100', 'Mozilla/5.0...', '{"folder": "Work"}', NOW() - INTERVAL '5 days'),
    (1, (SELECT id FROM auth_keys WHERE title = 'GitHub Account' AND user_id = 1 LIMIT 1),
     'AUTH_KEY_ACCESSED', '192.168.1.100', 'Mozilla/5.0...', '{}', NOW() - INTERVAL '2 days'),
    (1, (SELECT id FROM auth_keys WHERE title = 'AWS API Key' AND user_id = 1 LIMIT 1),
     'AUTH_KEY_CREATED', '192.168.1.100', 'Mozilla/5.0...', '{"folder": "Development"}', NOW() - INTERVAL '10 days'),
    (2, (SELECT id FROM auth_keys WHERE title = 'System Admin Panel' AND user_id = 2 LIMIT 1),
     'AUTH_KEY_ACCESSED', '10.0.0.50', 'Mozilla/5.0...', '{}', NOW() - INTERVAL '1 hour');
