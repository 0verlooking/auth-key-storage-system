package com.authkey.storage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application class for Auth Key Storage System
 *
 * Design Patterns Used:
 * - Singleton Pattern (Spring Bean Management)
 * - Factory Pattern (SpringApplication factory)
 *
 * @author Auth Key Storage Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
public class AuthKeyStorageApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthKeyStorageApplication.class, args);
    }
}
