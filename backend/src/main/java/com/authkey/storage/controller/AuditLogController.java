package com.authkey.storage.controller;

import com.authkey.storage.dto.response.AuditLogResponse;
import com.authkey.storage.entity.User;
import com.authkey.storage.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for audit log management
 * Provides read-only access to user activity logs for security and compliance
 */
@Slf4j
@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Audit log APIs for tracking user activities and security events")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * Get audit logs for current user with pagination
     *
     * @param authentication the authenticated user
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @param sort           sort field (default: performedAt)
     * @param direction      sort direction (default: DESC)
     * @return page of audit logs
     */
    @Operation(
            summary = "Get audit logs",
            description = "Retrieves audit logs for the current user with pagination and sorting. " +
                    "Shows all user activities including logins, key access, modifications, and deletions."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Audit logs retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(
            Authentication authentication,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "performedAt") String sort,
            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.debug("Fetching audit logs for user ID: {} (page: {}, size: {})", userId, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<AuditLogResponse> response = auditLogService.getUserAuditLogs(userId, pageable);
        log.debug("Retrieved {} audit logs for user ID: {}", response.getTotalElements(), userId);

        return ResponseEntity.ok(response);
    }

    /**
     * Get audit logs filtered by action type
     *
     * @param authentication the authenticated user
     * @param action         the action type to filter by
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @return page of filtered audit logs
     */
    @Operation(
            summary = "Get audit logs by action",
            description = "Retrieves audit logs filtered by a specific action type " +
                    "(e.g., LOGIN, CREATE_KEY, UPDATE_KEY, DELETE_KEY)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Audit logs retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping("/action/{action}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByAction(
            Authentication authentication,
            @Parameter(description = "Action type to filter", required = true)
            @PathVariable String action,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.debug("Fetching audit logs for user ID: {} with action: {}", userId, action);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "performedAt"));
        Page<AuditLogResponse> response = auditLogService.getAuditLogsByAction(userId, action, pageable);

        log.debug("Retrieved {} audit logs with action '{}' for user ID: {}",
                response.getTotalElements(), action, userId);

        return ResponseEntity.ok(response);
    }

    /**
     * Get audit logs for a specific resource
     *
     * @param authentication the authenticated user
     * @param resourceType   the resource type (e.g., AUTH_KEY, FOLDER, TAG)
     * @param resourceId     the resource ID
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @return page of audit logs for the resource
     */
    @Operation(
            summary = "Get audit logs by resource",
            description = "Retrieves audit logs for a specific resource. " +
                    "Useful for tracking all activities related to a particular authentication key, folder, or tag."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Audit logs retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping("/resource/{resourceType}/{resourceId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByResource(
            Authentication authentication,
            @Parameter(description = "Resource type (AUTH_KEY, FOLDER, TAG)", required = true)
            @PathVariable String resourceType,
            @Parameter(description = "Resource ID", required = true)
            @PathVariable Long resourceId,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.debug("Fetching audit logs for user ID: {} with resource: {} ID: {}",
                userId, resourceType, resourceId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "performedAt"));
        Page<AuditLogResponse> response = auditLogService.getAuditLogsByResource(
                userId, resourceType, resourceId, pageable
        );

        log.debug("Retrieved {} audit logs for resource {} ID {} and user ID: {}",
                response.getTotalElements(), resourceType, resourceId, userId);

        return ResponseEntity.ok(response);
    }
}
