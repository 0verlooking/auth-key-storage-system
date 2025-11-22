package com.authkey.storage.service.impl;

import com.authkey.storage.dto.response.AuditLogResponse;
import com.authkey.storage.entity.AuditLog;
import com.authkey.storage.entity.User;
import com.authkey.storage.repository.AuditLogRepository;
import com.authkey.storage.service.AuditLogService;
import com.authkey.storage.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Implementation of AuditLogService interface
 * Handles audit logging operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserService userService;

    /**
     * {@inheritDoc}
     */
    @Override
    @Async
    @Transactional
    public void logAction(Long userId, String action, String resourceType, Long resourceId,
                          String details, String ipAddress, String userAgent,
                          Boolean isSuccessful, String errorMessage) {
        try {
            User user = userService.getUserById(userId);

            AuditLog auditLog = AuditLog.builder()
                    .user(user)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(details)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .timestamp(LocalDateTime.now())
                    .isSuccessful(isSuccessful)
                    .errorMessage(errorMessage)
                    .build();

            auditLogRepository.save(auditLog);

            log.debug("Audit log created for user ID: {} - Action: {}", userId, action);
        } catch (Exception e) {
            log.error("Failed to create audit log: {}", e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void logAction(Long userId, String action, String resourceType, Long resourceId, String details) {
        logAction(userId, action, resourceType, resourceId, details, null, null, true, null);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getUserAuditLogs(Long userId, Pageable pageable) {
        log.debug("Fetching audit logs for user ID: {}", userId);

        Page<AuditLog> auditLogs = auditLogRepository.findByUserId(userId, pageable);
        return auditLogs.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogsByAction(Long userId, String action, Pageable pageable) {
        log.debug("Fetching audit logs for user ID: {} with action: {}", userId, action);

        Page<AuditLog> auditLogs = auditLogRepository.findByUserIdAndAction(userId, action, pageable);
        return auditLogs.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogsByResource(Long userId, String resourceType,
                                                          Long resourceId, Pageable pageable) {
        log.debug("Fetching audit logs for user ID: {} with resource type: {} and ID: {}",
                userId, resourceType, resourceId);

        Page<AuditLog> auditLogs = auditLogRepository.findByUserIdAndResourceTypeAndResourceId(
                userId, resourceType, resourceId, pageable);
        return auditLogs.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AuditLogResponse convertToResponse(AuditLog auditLog) {
        return AuditLogResponse.builder()
                .id(auditLog.getId())
                .userId(auditLog.getUser().getId())
                .username(auditLog.getUser().getUsername())
                .action(auditLog.getAction())
                .resourceType(auditLog.getResourceType())
                .resourceId(auditLog.getResourceId())
                .details(auditLog.getDetails())
                .ipAddress(auditLog.getIpAddress())
                .userAgent(auditLog.getUserAgent())
                .timestamp(auditLog.getTimestamp())
                .isSuccessful(auditLog.getIsSuccessful())
                .errorMessage(auditLog.getErrorMessage())
                .build();
    }
}
