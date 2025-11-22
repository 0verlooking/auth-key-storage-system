package com.authkey.storage.enums;

/**
 * Authentication key types
 */
public enum AuthKeyType {
    PASSWORD,           // Login password
    API_KEY,           // API key
    SSH_KEY,           // SSH key
    PRIVATE_KEY,       // Private key
    CERTIFICATE,       // Certificate
    TOKEN,             // Token
    TWO_FA_SECRET,     // 2FA secret
    RECOVERY_CODE,     // Recovery code
    OTHER              // Other type
}
