package com.authkey.storage.security;

import com.authkey.storage.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

/**
 * Security utility class
 * Provides helper methods for working with Spring Security context
 */
@Slf4j
public class SecurityUtils {

    /**
     * Private constructor to prevent instantiation
     */
    private SecurityUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Get the current authenticated user's ID
     *
     * @return Optional containing user ID if authenticated, empty otherwise
     */
    public static Optional<Long> getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }

            Object principal = authentication.getPrincipal();

            // If principal is a User ID string (from JWT)
            if (principal instanceof String) {
                return Optional.of(Long.parseLong((String) principal));
            }

            // If principal is UserDetails (from User entity)
            if (principal instanceof User) {
                return Optional.of(((User) principal).getId());
            }

            log.warn("Unexpected principal type: {}", principal.getClass());
            return Optional.empty();

        } catch (Exception e) {
            log.error("Error getting current user ID: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Get the current authenticated user's username
     *
     * @return Optional containing username if authenticated, empty otherwise
     */
    public static Optional<String> getCurrentUsername() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }

            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                return Optional.of(((UserDetails) principal).getUsername());
            }

            if (principal instanceof String) {
                return Optional.of((String) principal);
            }

            return Optional.empty();

        } catch (Exception e) {
            log.error("Error getting current username: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Get the current authentication object
     *
     * @return Optional containing Authentication if present, empty otherwise
     */
    public static Optional<Authentication> getCurrentAuthentication() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return Optional.ofNullable(authentication);
        } catch (Exception e) {
            log.error("Error getting current authentication: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Check if the current user is authenticated
     *
     * @return true if user is authenticated, false otherwise
     */
    public static boolean isAuthenticated() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return authentication != null &&
                    authentication.isAuthenticated() &&
                    !"anonymousUser".equals(authentication.getPrincipal());
        } catch (Exception e) {
            log.error("Error checking authentication status: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has a specific role
     *
     * @param role the role to check (without ROLE_ prefix)
     * @return true if user has the role, false otherwise
     */
    public static boolean hasRole(String role) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return false;
            }

            return authentication.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));

        } catch (Exception e) {
            log.error("Error checking role: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has any of the specified roles
     *
     * @param roles the roles to check (without ROLE_ prefix)
     * @return true if user has any of the roles, false otherwise
     */
    public static boolean hasAnyRole(String... roles) {
        try {
            for (String role : roles) {
                if (hasRole(role)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking roles: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Clear the security context
     * Useful for logout operations
     */
    public static void clearSecurityContext() {
        SecurityContextHolder.clearContext();
        log.debug("Security context cleared");
    }
}
