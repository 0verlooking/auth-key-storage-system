package com.authkey.storage.config;

import com.authkey.storage.entity.User;
import com.authkey.storage.enums.UserRole;
import com.authkey.storage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Database Seeder - Creates test users on application startup
 * This ensures test users are always available for development/testing
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Hash password using SHA-256 and base64 encoding (matches frontend hashing)
     */
    private String hashPasswordForFrontend(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash password", e);
        }
    }

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            log.info("🌱 Database Seeder: Checking for test users...");

            // Check if users already exist
            long userCount = userRepository.count();
            if (userCount > 0) {
                log.info("✅ Database already has {} users, skipping seed", userCount);
                return;
            }

            log.info("📝 No users found. Creating test users...");

            // Create Test User
            createTestUser(
                    "testuser",
                    "test@example.com",
                    "Test123!",
                    "Test",
                    "User",
                    UserRole.USER
            );

            // Create Admin User
            createTestUser(
                    "admin",
                    "admin@example.com",
                    "Admin123!",
                    "Admin",
                    "User",
                    UserRole.ADMIN
            );

            log.info("✅ Database seeding completed successfully!");
            log.info("📋 Test Users Created:");
            log.info("   • test@example.com  / Test123!");
            log.info("   • admin@example.com / Admin123!");
        };
    }

    private void createTestUser(
            String username,
            String email,
            String rawPassword,
            String firstName,
            String lastName,
            UserRole role
    ) {
        try {
            // Hash password the same way frontend does (SHA-256 + base64)
            String frontendHashedPassword = hashPasswordForFrontend(rawPassword);

            // Then BCrypt encode it for storage (what backend expects)
            String bcryptPassword = passwordEncoder.encode(frontendHashedPassword);

            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(bcryptPassword)
                    .firstName(firstName)
                    .lastName(lastName)
                    .role(role)
                    .emailVerified(true)
                    .accountLocked(false)
                    .failedLoginAttempts(0)
                    .deleted(false)
                    .build();

            userRepository.save(user);
            log.info("✅ Created user: {} ({})", email, role);

        } catch (Exception e) {
            log.error("❌ Failed to create user: {}", email, e);
        }
    }
}
