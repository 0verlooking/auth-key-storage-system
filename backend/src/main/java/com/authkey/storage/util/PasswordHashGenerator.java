package com.authkey.storage.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Utility to generate password hashes that match the frontend's hashing scheme
 * Frontend: SHA-256(password) -> base64
 * Backend: BCrypt(frontend_hash)
 */
public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

        // Test passwords
        String[] passwords = {"Test123!", "Admin123!"};

        System.out.println("=".repeat(80));
        System.out.println("PASSWORD HASH GENERATOR");
        System.out.println("=".repeat(80));
        System.out.println();

        for (String rawPassword : passwords) {
            try {
                // Step 1: SHA-256 hash (same as frontend cryptoService.hashPassword)
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hashBytes = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
                String frontendHash = Base64.getEncoder().encodeToString(hashBytes);

                // Step 2: BCrypt hash (backend storage)
                String bcryptHash = encoder.encode(frontendHash);

                System.out.println("Raw Password:     " + rawPassword);
                System.out.println("Frontend Hash:    " + frontendHash);
                System.out.println("BCrypt Hash:      " + bcryptHash);
                System.out.println("-".repeat(80));

            } catch (Exception e) {
                System.err.println("Error processing password: " + rawPassword);
                e.printStackTrace();
            }
        }

        System.out.println();
        System.out.println("SQL INSERT STATEMENTS:");
        System.out.println("=".repeat(80));
        System.out.println();
        System.out.println("Copy the BCrypt hashes above into insert-users-simple.sql");
        System.out.println();
    }
}
