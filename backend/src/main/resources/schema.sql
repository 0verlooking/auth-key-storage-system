-- ============================================================================
-- Database Schema for Auth Key Storage System
-- ============================================================================
-- This script creates all necessary tables for the application
-- Run this BEFORE loading test data if tables don't exist
-- ============================================================================

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS share_links CASCADE;
DROP TABLE IF EXISTS auth_key_tags CASCADE;
DROP TABLE IF EXISTS auth_keys CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_token_expires_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_token_expires_at TIMESTAMP,
    is_two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    account_locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for users table
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_username ON users(username);

-- ============================================================================
-- FOLDERS TABLE
-- ============================================================================
CREATE TABLE folders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    color VARCHAR(7),
    icon VARCHAR(50),
    user_id BIGINT NOT NULL,
    parent_folder_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Indexes for folders table
CREATE INDEX idx_folder_user ON folders(user_id);
CREATE INDEX idx_folder_parent ON folders(parent_folder_id);

-- ============================================================================
-- TAGS TABLE
-- ============================================================================
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for tags table
CREATE INDEX idx_tag_user ON tags(user_id);
CREATE INDEX idx_tag_name ON tags(name);

-- ============================================================================
-- AUTH_KEYS TABLE
-- ============================================================================
CREATE TABLE auth_keys (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    key_type VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255),
    encrypted_value TEXT NOT NULL,
    encryption_iv VARCHAR(255),
    encryption_salt VARCHAR(255),
    url VARCHAR(500),
    notes VARCHAR(1000),
    is_favorite BOOLEAN DEFAULT FALSE,
    last_accessed_at TIMESTAMP,
    access_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    password_strength INTEGER,
    user_id BIGINT NOT NULL,
    folder_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

-- Indexes for auth_keys table
CREATE INDEX idx_authkey_user ON auth_keys(user_id);
CREATE INDEX idx_authkey_folder ON auth_keys(folder_id);
CREATE INDEX idx_authkey_type ON auth_keys(key_type);

-- ============================================================================
-- AUTH_KEY_TAGS TABLE (Join Table)
-- ============================================================================
CREATE TABLE auth_key_tags (
    auth_key_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (auth_key_id, tag_id),
    FOREIGN KEY (auth_key_id) REFERENCES auth_keys(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ============================================================================
-- SHARE_LINKS TABLE
-- ============================================================================
CREATE TABLE share_links (
    id BIGSERIAL PRIMARY KEY,
    share_token VARCHAR(255) NOT NULL UNIQUE,
    encrypted_key TEXT NOT NULL,
    access_password_hash VARCHAR(255),
    max_access_count INTEGER,
    current_access_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    allow_download BOOLEAN DEFAULT FALSE,
    auth_key_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (auth_key_id) REFERENCES auth_keys(id) ON DELETE CASCADE
);

-- Indexes for share_links table
CREATE INDEX idx_sharelink_token ON share_links(share_token);
CREATE INDEX idx_sharelink_authkey ON share_links(auth_key_id);

-- ============================================================================
-- AUDIT_LOGS TABLE
-- ============================================================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_successful BOOLEAN DEFAULT TRUE,
    error_message VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for audit_logs table
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);

-- ============================================================================
-- Schema creation complete
-- ============================================================================
