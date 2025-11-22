package com.authkey.storage.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Share Link entity for secure sharing of authentication keys
 */
@Entity
@Table(name = "share_links", indexes = {
        @Index(name = "idx_sharelink_token", columnList = "share_token"),
        @Index(name = "idx_sharelink_authkey", columnList = "auth_key_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShareLink extends BaseEntity {

    @Column(name = "share_token", nullable = false, unique = true, length = 255)
    private String shareToken;

    @Column(name = "encrypted_key", columnDefinition = "TEXT", nullable = false)
    private String encryptedKey;

    @Column(name = "access_password_hash", length = 255)
    private String accessPasswordHash;

    @Column(name = "max_access_count")
    private Integer maxAccessCount;

    @Column(name = "current_access_count")
    @Builder.Default
    private Integer currentAccessCount = 0;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "allow_download")
    @Builder.Default
    private Boolean allowDownload = false;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_key_id", nullable = false)
    private AuthKey authKey;

    @PrePersist
    protected void onCreate() {
        if (shareToken == null) {
            shareToken = UUID.randomUUID().toString();
        }
    }

    // Helper methods
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isMaxAccessReached() {
        return maxAccessCount != null && currentAccessCount >= maxAccessCount;
    }

    public boolean canAccess() {
        return isActive && !isExpired() && !isMaxAccessReached();
    }

    public void incrementAccessCount() {
        this.currentAccessCount++;
        if (isMaxAccessReached()) {
            this.isActive = false;
        }
    }
}
