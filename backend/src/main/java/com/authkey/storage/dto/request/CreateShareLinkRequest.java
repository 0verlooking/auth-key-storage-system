package com.authkey.storage.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for creating a share link
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShareLinkRequest {

    @NotNull(message = "Auth key ID is required")
    private Long authKeyId;

    @Size(min = 8, max = 100, message = "Access password must be at least 8 characters")
    private String accessPassword;

    @Min(value = 1, message = "Max access count must be at least 1")
    private Integer maxAccessCount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;

    private Boolean allowDownload;
}
