package com.authkey.storage.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for share link response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareLinkResponse {

    private Long id;

    @JsonProperty("share_token")
    private String shareToken;

    @JsonProperty("share_url")
    private String shareUrl;

    @JsonProperty("encrypted_key")
    private String encryptedKey;

    @JsonProperty("has_password")
    private Boolean hasPassword;

    @JsonProperty("max_access_count")
    private Integer maxAccessCount;

    @JsonProperty("current_access_count")
    private Integer currentAccessCount;

    @JsonProperty("expires_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;

    @JsonProperty("is_active")
    private Boolean isActive;

    @JsonProperty("allow_download")
    private Boolean allowDownload;

    @JsonProperty("auth_key_id")
    private Long authKeyId;

    @JsonProperty("auth_key_title")
    private String authKeyTitle;

    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonProperty("is_expired")
    private Boolean isExpired;

    @JsonProperty("can_access")
    private Boolean canAccess;
}
