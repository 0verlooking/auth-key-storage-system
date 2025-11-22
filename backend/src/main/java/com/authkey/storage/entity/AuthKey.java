package com.authkey.storage.entity;

import com.authkey.storage.enums.AuthKeyType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Authentication Key entity
 * Stores encrypted authentication credentials
 */
@Entity
@Table(name = "auth_keys", indexes = {
        @Index(name = "idx_authkey_user", columnList = "user_id"),
        @Index(name = "idx_authkey_folder", columnList = "folder_id"),
        @Index(name = "idx_authkey_type", columnList = "key_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthKey extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "key_type", nullable = false, length = 50)
    private AuthKeyType keyType;

    @Column(length = 255)
    private String username;

    @Column(length = 255)
    private String email;

    /**
     * Encrypted authentication value
     * This is encrypted on the client side using the user's master password
     */
    @Column(name = "encrypted_value", columnDefinition = "TEXT", nullable = false)
    private String encryptedValue;

    /**
     * Initialization vector for encryption
     */
    @Column(name = "encryption_iv", length = 255)
    private String encryptionIv;

    /**
     * Salt used for key derivation
     */
    @Column(name = "encryption_salt", length = 255)
    private String encryptionSalt;

    @Column(length = 500)
    private String url;

    @Column(length = 1000)
    private String notes;

    @Column(name = "is_favorite")
    @Builder.Default
    private Boolean isFavorite = false;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "access_count")
    @Builder.Default
    private Integer accessCount = 0;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "password_strength")
    private Integer passwordStrength;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "auth_key_tags",
            joinColumns = @JoinColumn(name = "auth_key_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private List<Tag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "authKey", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShareLink> shareLinks = new ArrayList<>();

    // Helper methods
    public void incrementAccessCount() {
        this.accessCount++;
        this.lastAccessedAt = LocalDateTime.now();
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public void addTag(Tag tag) {
        if (!tags.contains(tag)) {
            tags.add(tag);
            tag.getAuthKeys().add(this);
        }
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getAuthKeys().remove(this);
    }
}
