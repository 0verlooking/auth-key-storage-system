package com.authkey.storage.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for audit log response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    private String username;

    private String action;

    @JsonProperty("resource_type")
    private String resourceType;

    @JsonProperty("resource_id")
    private Long resourceId;

    private String details;

    @JsonProperty("ip_address")
    private String ipAddress;

    @JsonProperty("user_agent")
    private String userAgent;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @JsonProperty("is_successful")
    private Boolean isSuccessful;

    @JsonProperty("error_message")
    private String errorMessage;
}
