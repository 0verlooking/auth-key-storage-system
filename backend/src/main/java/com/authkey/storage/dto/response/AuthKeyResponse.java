package com.authkey.storage.dto.response;

import com.authkey.storage.enums.AuthKeyType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for authentication key response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthKeyResponse {

    private Long id;

    private String title;

    private String description;

    @JsonProperty("key_type")
    private AuthKeyType keyType;

    private String username;

    private String email;

    @JsonProperty("encrypted_value")
    private String encryptedValue;

    @JsonProperty("encryption_iv")
    private String encryptionIv;

    @JsonProperty("encryption_salt")
    private String encryptionSalt;

    private String url;

    private String notes;

    @JsonProperty("is_favorite")
    private Boolean isFavorite;

    @JsonProperty("last_accessed_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastAccessedAt;

    @JsonProperty("access_count")
    private Integer accessCount;

    @JsonProperty("expires_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;

    @JsonProperty("password_strength")
    private Integer passwordStrength;

    private FolderResponse folder;

    private List<TagResponse> tags;

    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonProperty("is_expired")
    private Boolean isExpired;
}
