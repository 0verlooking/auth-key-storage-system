package com.authkey.storage.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger Configuration
 * Configures API documentation with Swagger UI
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Auth Key Storage System API",
                version = "1.0.0",
                description = "REST API for secure authentication key storage and management system. " +
                        "This API provides endpoints for managing authentication keys, folders, tags, " +
                        "share links, and user profiles with enterprise-grade security.",
                contact = @Contact(
                        name = "Auth Key Storage Team",
                        email = "support@authkeystorage.com",
                        url = "https://github.com/authkeystorage"
                ),
                license = @License(
                        name = "MIT License",
                        url = "https://opensource.org/licenses/MIT"
                )
        ),
        servers = {
                @Server(
                        url = "http://localhost:8080",
                        description = "Local Development Server"
                ),
                @Server(
                        url = "https://api.authkeystorage.com",
                        description = "Production Server"
                ),
                @Server(
                        url = "https://staging-api.authkeystorage.com",
                        description = "Staging Server"
                )
        }
)
@SecurityScheme(
        name = "Bearer Authentication",
        description = "JWT authentication with Bearer token. " +
                "To authenticate, use the /api/v1/auth/login endpoint to obtain a JWT token, " +
                "then include it in the Authorization header as 'Bearer {token}'.",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
    // Configuration is done via annotations
}
