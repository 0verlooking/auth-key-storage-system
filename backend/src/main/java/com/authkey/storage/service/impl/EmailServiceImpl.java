package com.authkey.storage.service.impl;

import com.authkey.storage.entity.User;
import com.authkey.storage.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Implementation of EmailService interface
 * Handles email sending operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@authkey.com}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Value("${app.name:Auth Key Storage System}")
    private String appName;

    /**
     * {@inheritDoc}
     */
    @Override
    @Async
    public void sendVerificationEmail(User user, String verificationToken) {
        try {
            String verificationUrl = baseUrl + "/verify-email?token=" + verificationToken;

            String subject = "Verify Your Email - " + appName;
            String message = String.format(
                    "Hello %s,\n\n" +
                            "Thank you for registering with %s!\n\n" +
                            "Please verify your email address by clicking the link below:\n" +
                            "%s\n\n" +
                            "This link will expire in 24 hours.\n\n" +
                            "If you did not create an account, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "%s Team",
                    user.getFullName(),
                    appName,
                    verificationUrl,
                    appName
            );

            sendEmail(user.getEmail(), subject, message);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            String resetUrl = baseUrl + "/reset-password?token=" + resetToken;

            String subject = "Reset Your Password - " + appName;
            String message = String.format(
                    "Hello %s,\n\n" +
                            "We received a request to reset your password for your %s account.\n\n" +
                            "Please reset your password by clicking the link below:\n" +
                            "%s\n\n" +
                            "This link will expire in 1 hour.\n\n" +
                            "If you did not request a password reset, please ignore this email and your password will remain unchanged.\n\n" +
                            "Best regards,\n" +
                            "%s Team",
                    user.getFullName(),
                    appName,
                    resetUrl,
                    appName
            );

            sendEmail(user.getEmail(), subject, message);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Async
    public void sendWelcomeEmail(User user) {
        try {
            String subject = "Welcome to " + appName;
            String message = String.format(
                    "Hello %s,\n\n" +
                            "Welcome to %s!\n\n" +
                            "Your account has been successfully created.\n\n" +
                            "You can now start securely storing and managing your authentication keys.\n\n" +
                            "Features:\n" +
                            "- Secure encrypted storage\n" +
                            "- Organize with folders and tags\n" +
                            "- Share keys securely\n" +
                            "- Access from anywhere\n\n" +
                            "If you have any questions, feel free to contact our support team.\n\n" +
                            "Best regards,\n" +
                            "%s Team",
                    user.getFullName(),
                    appName,
                    appName
            );

            sendEmail(user.getEmail(), subject, message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Async
    public void sendPasswordChangedEmail(User user) {
        try {
            String subject = "Password Changed - " + appName;
            String message = String.format(
                    "Hello %s,\n\n" +
                            "This is to confirm that your password for %s has been successfully changed.\n\n" +
                            "If you did not make this change, please contact our support team immediately.\n\n" +
                            "Best regards,\n" +
                            "%s Team",
                    user.getFullName(),
                    appName,
                    appName
            );

            sendEmail(user.getEmail(), subject, message);
            log.info("Password changed email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password changed email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Async
    public void sendAccountLockedEmail(User user) {
        try {
            String subject = "Account Locked - " + appName;
            String message = String.format(
                    "Hello %s,\n\n" +
                            "Your account for %s has been locked due to multiple failed login attempts.\n\n" +
                            "To unlock your account, please reset your password by clicking the forgot password link on the login page.\n\n" +
                            "If you did not attempt to log in, please contact our support team immediately as your account may be compromised.\n\n" +
                            "Best regards,\n" +
                            "%s Team",
                    user.getFullName(),
                    appName,
                    appName
            );

            sendEmail(user.getEmail(), subject, message);
            log.info("Account locked email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send account locked email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    /**
     * Send email using JavaMailSender
     */
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}
