package com.authkey.storage.service;

import com.authkey.storage.dto.request.ChangePasswordRequest;
import com.authkey.storage.dto.response.UserResponse;
import com.authkey.storage.entity.User;

/**
 * Service interface for user management operations
 */
public interface UserService {

    /**
     * Get user by ID
     * @param userId the user ID
     * @return the user entity
     */
    User getUserById(Long userId);

    /**
     * Get user by username
     * @param username the username
     * @return the user entity
     */
    User getUserByUsername(String username);

    /**
     * Get user by email
     * @param email the email address
     * @return the user entity
     */
    User getUserByEmail(String email);

    /**
     * Get user response by ID
     * @param userId the user ID
     * @return the user response DTO
     */
    UserResponse getUserResponseById(Long userId);

    /**
     * Update user profile
     * @param userId the user ID
     * @param firstName the first name
     * @param lastName the last name
     * @return the updated user response
     */
    UserResponse updateProfile(Long userId, String firstName, String lastName);

    /**
     * Change user password
     * @param userId the user ID
     * @param request the change password request
     */
    void changePassword(Long userId, ChangePasswordRequest request);

    /**
     * Delete user account
     * @param userId the user ID
     */
    void deleteAccount(Long userId);

    /**
     * Verify email with token
     * @param token the verification token
     */
    void verifyEmail(String token);

    /**
     * Resend email verification
     * @param userId the user ID
     */
    void resendVerificationEmail(Long userId);

    /**
     * Convert User entity to UserResponse DTO
     * @param user the user entity
     * @return the user response DTO
     */
    UserResponse convertToResponse(User user);
}
