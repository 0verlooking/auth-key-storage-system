package com.authkey.storage.dto.request;

import com.authkey.storage.enums.AuthKeyType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Data Transfer Object for creating an authentication key
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAuthKeyRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Key type is required")
    private AuthKeyType keyType;

    @Size(max = 255, message = "Username must not exceed 255 characters")
    private String username;

    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Encrypted value is required")
    private String encryptedValue;

    @Size(max = 255, message = "Encryption IV must not exceed 255 characters")
    private String encryptionIv;

    @Size(max = 255, message = "Encryption salt must not exceed 255 characters")
    private String encryptionSalt;

    @Size(max = 500, message = "URL must not exceed 500 characters")
    private String url;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    private Long folderId;

    private Set<Long> tagIds;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;

    private Integer passwordStrength;
}
