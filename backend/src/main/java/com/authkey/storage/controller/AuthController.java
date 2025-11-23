package com.authkey.storage.controller;

import com.authkey.storage.dto.request.*;
import com.authkey.storage.dto.response.AuthResponse;
import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.service.AuthService;
import com.authkey.storage.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication operations
 * Handles user registration, login, logout, token refresh, password management, and email verification
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * Register a new user account
     *
     * @param request the registration request containing username, email, and password
     * @return authentication response with access and refresh tokens
     */
    @Operation(
            summary = "Register new user",
            description = "Creates a new user account and returns authentication tokens. " +
                    "A verification email will be sent to the provided email address."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or user already exists",
                    content = @Content
            )
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Attempting to register new user with email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        log.info("User registered successfully with ID: {}", response.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate user and generate tokens
     *
     * @param request the login request containing username/email and password
     * @return authentication response with access and refresh tokens
     */
    @Operation(
            summary = "Login user",
            description = "Authenticates user credentials and returns access and refresh tokens"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "423",
                    description = "Account is locked",
                    content = @Content
            )
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login attempt for user: {}", request.getUsernameOrEmail());
        AuthResponse response = authService.login(request);
        log.info("User logged in successfully: {}", request.getUsernameOrEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * Logout user and invalidate tokens
     *
     * @param authentication the authenticated user
     * @return success message
     */
    @Operation(
            summary = "Logout user",
            description = "Invalidates the current user's refresh token"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logout successful",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Logout request for user ID: {}", userId);
        authService.logout(userId);
        log.info("User logged out successfully: {}", userId);
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    /**
     * Refresh access token using refresh token
     *
     * @param request the refresh token request
     * @return new authentication response with fresh tokens
     */
    @Operation(
            summary = "Refresh access token",
            description = "Generates a new access token using a valid refresh token"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid or expired refresh token",
                    content = @Content
            )
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        log.info("Token refresh request received");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        log.info("Token refreshed successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Initiate forgot password process
     *
     * @param request the forgot password request containing email
     * @return success message
     */
    @Operation(
            summary = "Forgot password",
            description = "Sends a password reset email to the user's registered email address"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password reset email sent",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content
            )
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        log.info("Forgot password request for email: {}", request.getEmail());
        authService.forgotPassword(request);
        log.info("Password reset email sent to: {}", request.getEmail());
        return ResponseEntity.ok(
                new MessageResponse("Password reset instructions sent to your email")
        );
    }

    /**
     * Reset password using reset token
     *
     * @param request the reset password request containing token and new password
     * @return success message
     */
    @Operation(
            summary = "Reset password",
            description = "Resets user password using the token received via email"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password reset successful",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired reset token",
                    content = @Content
            )
    })
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        log.info("Password reset request received");
        authService.resetPassword(request);
        log.info("Password reset successfully");
        return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
    }

    /**
     * Verify email using verification token
     *
     * @param token the email verification token
     * @return success message
     */
    @Operation(
            summary = "Verify email",
            description = "Verifies user email address using the token sent via email"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email verified successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired verification token",
                    content = @Content
            )
    })
    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(
            @Parameter(description = "Email verification token", required = true)
            @RequestParam("token") String token
    ) {
        log.info("Email verification request received");
        authService.verifyEmailToken(token);
        log.info("Email verified successfully");
        return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
    }

    /**
     * Resend email verification
     *
     * @param request the resend verification request containing email
     * @return success message
     */
    @Operation(
            summary = "Resend verification email",
            description = "Resends the email verification link to the user's email address"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Verification email sent",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Email already verified or user not found",
                    content = @Content
            )
    })
    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request
    ) {
        log.info("Resend verification request for email: {}", request.getEmail());
        com.authkey.storage.entity.User user = userService.getUserByEmail(request.getEmail());
        userService.resendVerificationEmail(user.getId());
        log.info("Verification email resent to: {}", request.getEmail());
        return ResponseEntity.ok(
                new MessageResponse("Verification email sent successfully")
        );
    }
}
