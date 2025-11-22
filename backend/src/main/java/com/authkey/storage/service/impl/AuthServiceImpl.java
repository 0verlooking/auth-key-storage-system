package com.authkey.storage.service.impl;

import com.authkey.storage.dto.request.ForgotPasswordRequest;
import com.authkey.storage.dto.request.LoginRequest;
import com.authkey.storage.dto.request.RegisterRequest;
import com.authkey.storage.dto.request.ResetPasswordRequest;
import com.authkey.storage.dto.response.AuthResponse;
import com.authkey.storage.entity.User;
import com.authkey.storage.enums.UserRole;
import com.authkey.storage.exception.BadRequestException;
import com.authkey.storage.exception.ResourceNotFoundException;
import com.authkey.storage.exception.UnauthorizedException;
import com.authkey.storage.repository.UserRepository;
import com.authkey.storage.security.JwtService;
import com.authkey.storage.service.AuthService;
import com.authkey.storage.service.EmailService;
import com.authkey.storage.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Implementation of AuthService interface
 * Handles authentication and authorization operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with username: {}", request.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new user
        String emailVerificationToken = UUID.randomUUID().toString();
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(UserRole.USER)
                .isEmailVerified(false)
                .emailVerificationToken(emailVerificationToken)
                .emailVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24))
                .isTwoFactorEnabled(false)
                .accountLocked(false)
                .failedLoginAttempts(0)
                .build();

        user = userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user, emailVerificationToken);
        emailService.sendWelcomeEmail(user);

        // Generate tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        log.info("User registered successfully: {}", user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationTime())
                .user(userService.convertToResponse(user))
                .build();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("User attempting to login: {}", request.getUsernameOrEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );

            // Get user
            User user = (User) authentication.getPrincipal();

            // Check if account is locked
            if (user.getAccountLocked()) {
                throw new UnauthorizedException("Account is locked due to multiple failed login attempts");
            }

            // Reset failed login attempts
            user.resetFailedLoginAttempts();
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            // Generate tokens
            String accessToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            log.info("User logged in successfully: {}", user.getUsername());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtService.getExpirationTime())
                    .user(userService.convertToResponse(user))
                    .build();

        } catch (AuthenticationException e) {
            log.warn("Failed login attempt for: {}", request.getUsernameOrEmail());

            // Increment failed login attempts
            userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                    .ifPresent(user -> {
                        user.incrementFailedLoginAttempts();
                        userRepository.save(user);

                        if (user.getAccountLocked()) {
                            emailService.sendAccountLockedEmail(user);
                        }
                    });

            throw new UnauthorizedException("Invalid username/email or password");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void logout(Long userId) {
        log.info("User logging out: {}", userId);
        // Token invalidation can be implemented with a token blacklist
        // For now, we just log the logout
        log.info("User logged out successfully: {}", userId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Refreshing access token");

        try {
            // Extract username from refresh token
            String username = jwtService.extractUsername(refreshToken);

            // Get user
            User user = userService.getUserByUsername(username);

            // Validate refresh token
            if (!jwtService.isTokenValid(refreshToken, user)) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            // Generate new tokens
            String newAccessToken = jwtService.generateToken(user);
            String newRefreshToken = jwtService.generateRefreshToken(user);

            log.info("Tokens refreshed successfully for user: {}", username);

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtService.getExpirationTime())
                    .user(userService.convertToResponse(user))
                    .build();

        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage());
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Forgot password request for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Generate password reset token
        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user, resetToken);

        log.info("Password reset email sent to: {}", request.getEmail());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password with token");

        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (user.getPasswordResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send notification email
        emailService.sendPasswordChangedEmail(user);

        log.info("Password reset successfully for user: {}", user.getUsername());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void verifyEmailToken(String token) {
        userService.verifyEmail(token);
    }
}
