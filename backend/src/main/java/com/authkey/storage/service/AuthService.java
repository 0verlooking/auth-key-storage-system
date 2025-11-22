package com.authkey.storage.service;

import com.authkey.storage.dto.request.ForgotPasswordRequest;
import com.authkey.storage.dto.request.LoginRequest;
import com.authkey.storage.dto.request.RegisterRequest;
import com.authkey.storage.dto.request.ResetPasswordRequest;
import com.authkey.storage.dto.response.AuthResponse;

/**
 * Service interface for authentication operations
 */
public interface AuthService {

    /**
     * Register a new user
     * @param request the registration request
     * @return the authentication response with tokens
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate user and generate tokens
     * @param request the login request
     * @return the authentication response with tokens
     */
    AuthResponse login(LoginRequest request);

    /**
     * Logout user (invalidate tokens)
     * @param userId the user ID
     */
    void logout(Long userId);

    /**
     * Refresh access token
     * @param refreshToken the refresh token
     * @return the new authentication response with tokens
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * Initiate forgot password process
     * @param request the forgot password request
     */
    void forgotPassword(ForgotPasswordRequest request);

    /**
     * Reset password with token
     * @param request the reset password request
     */
    void resetPassword(ResetPasswordRequest request);

    /**
     * Verify email token
     * @param token the verification token
     */
    void verifyEmailToken(String token);
}
