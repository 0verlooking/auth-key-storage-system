package com.authkey.storage.service;

import com.authkey.storage.entity.User;

/**
 * Service interface for email operations
 */
public interface EmailService {

    /**
     * Send verification email to user
     * @param user the user
     * @param verificationToken the verification token
     */
    void sendVerificationEmail(User user, String verificationToken);

    /**
     * Send password reset email
     * @param user the user
     * @param resetToken the password reset token
     */
    void sendPasswordResetEmail(User user, String resetToken);

    /**
     * Send welcome email after registration
     * @param user the user
     */
    void sendWelcomeEmail(User user);

    /**
     * Send email when password is changed
     * @param user the user
     */
    void sendPasswordChangedEmail(User user);

    /**
     * Send email when account is locked
     * @param user the user
     */
    void sendAccountLockedEmail(User user);
}
