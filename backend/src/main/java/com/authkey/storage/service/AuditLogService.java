package com.authkey.storage.service;

import com.authkey.storage.dto.response.AuditLogResponse;
import com.authkey.storage.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for audit logging
 */
public interface AuditLogService {

    /**
     * Log an action
     * @param userId the user ID
     * @param action the action performed
     * @param resourceType the type of resource
     * @param resourceId the resource ID
     * @param details additional details
     * @param ipAddress the IP address
     * @param userAgent the user agent
     * @param isSuccessful whether the action was successful
     * @param errorMessage the error message (if any)
     */
    void logAction(Long userId, String action, String resourceType, Long resourceId,
                   String details, String ipAddress, String userAgent,
                   Boolean isSuccessful, String errorMessage);

    /**
     * Log successful action
     * @param userId the user ID
     * @param action the action performed
     * @param resourceType the type of resource
     * @param resourceId the resource ID
     * @param details additional details
     */
    void logAction(Long userId, String action, String resourceType, Long resourceId, String details);

    /**
     * Get audit logs for user
     * @param userId the user ID
     * @param pageable the pagination information
     * @return page of audit log responses
     */
    Page<AuditLogResponse> getUserAuditLogs(Long userId, Pageable pageable);

    /**
     * Get audit logs by action
     * @param userId the user ID
     * @param action the action
     * @param pageable the pagination information
     * @return page of audit log responses
     */
    Page<AuditLogResponse> getAuditLogsByAction(Long userId, String action, Pageable pageable);

    /**
     * Get audit logs by resource
     * @param userId the user ID
     * @param resourceType the resource type
     * @param resourceId the resource ID
     * @param pageable the pagination information
     * @return page of audit log responses
     */
    Page<AuditLogResponse> getAuditLogsByResource(Long userId, String resourceType,
                                                   Long resourceId, Pageable pageable);

    /**
     * Convert AuditLog entity to AuditLogResponse DTO
     * @param auditLog the audit log entity
     * @return the audit log response DTO
     */
    AuditLogResponse convertToResponse(AuditLog auditLog);
}
