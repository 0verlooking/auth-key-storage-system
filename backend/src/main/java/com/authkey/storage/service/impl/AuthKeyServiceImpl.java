package com.authkey.storage.service.impl;

import com.authkey.storage.dto.request.CreateAuthKeyRequest;
import com.authkey.storage.dto.request.UpdateAuthKeyRequest;
import com.authkey.storage.dto.response.AuthKeyResponse;
import com.authkey.storage.entity.AuthKey;
import com.authkey.storage.entity.Folder;
import com.authkey.storage.entity.Tag;
import com.authkey.storage.entity.User;
import com.authkey.storage.exception.BadRequestException;
import com.authkey.storage.exception.ResourceNotFoundException;
import com.authkey.storage.repository.AuthKeyRepository;
import com.authkey.storage.repository.FolderRepository;
import com.authkey.storage.repository.TagRepository;
import com.authkey.storage.service.AuthKeyService;
import com.authkey.storage.service.FolderService;
import com.authkey.storage.service.TagService;
import com.authkey.storage.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of AuthKeyService interface
 * Handles authentication key management operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthKeyServiceImpl implements AuthKeyService {

    private final AuthKeyRepository authKeyRepository;
    private final FolderRepository folderRepository;
    private final TagRepository tagRepository;
    private final UserService userService;
    private final FolderService folderService;
    private final TagService tagService;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthKeyResponse createAuthKey(Long userId, CreateAuthKeyRequest request) {
        log.info("Creating auth key for user ID: {}", userId);

        User user = userService.getUserById(userId);

        // Build auth key
        AuthKey authKey = AuthKey.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .keyType(request.getKeyType())
                .username(request.getUsername())
                .email(request.getEmail())
                .encryptedValue(request.getEncryptedValue())
                .encryptionIv(request.getEncryptionIv())
                .encryptionSalt(request.getEncryptionSalt())
                .url(request.getUrl())
                .notes(request.getNotes())
                .isFavorite(false)
                .accessCount(0)
                .expiresAt(request.getExpiresAt())
                .passwordStrength(request.getPasswordStrength())
                .user(user)
                .build();

        // Set folder if provided
        if (request.getFolderId() != null) {
            Folder folder = folderRepository.findByIdAndUserId(request.getFolderId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + request.getFolderId()));
            authKey.setFolder(folder);
        }

        // Save auth key first
        authKey = authKeyRepository.save(authKey);

        // Add tags if provided
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + tagId));
                authKey.addTag(tag);
            }
            authKey = authKeyRepository.save(authKey);
        }

        log.info("Auth key created successfully with ID: {}", authKey.getId());
        return convertToResponse(authKey);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public AuthKeyResponse getAuthKeyById(Long userId, Long authKeyId) {
        log.debug("Fetching auth key ID: {} for user ID: {}", authKeyId, userId);

        AuthKey authKey = authKeyRepository.findByIdAndUserId(authKeyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + authKeyId));

        return convertToResponse(authKey);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuthKeyResponse> getAllAuthKeys(Long userId, Pageable pageable) {
        log.debug("Fetching all auth keys for user ID: {}", userId);

        Page<AuthKey> authKeys = authKeyRepository.findByUserId(userId, pageable);
        return authKeys.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<AuthKeyResponse> getAllAuthKeys(Long userId) {
        log.debug("Fetching all auth keys for user ID: {} without pagination", userId);

        List<AuthKey> authKeys = authKeyRepository.findByUserId(userId);
        return authKeys.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuthKeyResponse> getAuthKeysByFolder(Long userId, Long folderId, Pageable pageable) {
        log.debug("Fetching auth keys for folder ID: {} and user ID: {}", folderId, userId);

        Page<AuthKey> authKeys = authKeyRepository.findByUserIdAndFolderId(userId, folderId, pageable);
        return authKeys.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuthKeyResponse> getFavoriteAuthKeys(Long userId, Pageable pageable) {
        log.debug("Fetching favorite auth keys for user ID: {}", userId);

        Page<AuthKey> authKeys = authKeyRepository.findByUserIdAndIsFavoriteTrue(userId, pageable);
        return authKeys.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthKeyResponse updateAuthKey(Long userId, Long authKeyId, UpdateAuthKeyRequest request) {
        log.info("Updating auth key ID: {} for user ID: {}", authKeyId, userId);

        AuthKey authKey = authKeyRepository.findByIdAndUserId(authKeyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + authKeyId));

        // Update fields if provided
        if (request.getTitle() != null) {
            authKey.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            authKey.setDescription(request.getDescription());
        }
        if (request.getKeyType() != null) {
            authKey.setKeyType(request.getKeyType());
        }
        if (request.getUsername() != null) {
            authKey.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            authKey.setEmail(request.getEmail());
        }
        if (request.getEncryptedValue() != null) {
            authKey.setEncryptedValue(request.getEncryptedValue());
        }
        if (request.getEncryptionIv() != null) {
            authKey.setEncryptionIv(request.getEncryptionIv());
        }
        if (request.getEncryptionSalt() != null) {
            authKey.setEncryptionSalt(request.getEncryptionSalt());
        }
        if (request.getUrl() != null) {
            authKey.setUrl(request.getUrl());
        }
        if (request.getNotes() != null) {
            authKey.setNotes(request.getNotes());
        }
        if (request.getIsFavorite() != null) {
            authKey.setIsFavorite(request.getIsFavorite());
        }
        if (request.getExpiresAt() != null) {
            authKey.setExpiresAt(request.getExpiresAt());
        }
        if (request.getPasswordStrength() != null) {
            authKey.setPasswordStrength(request.getPasswordStrength());
        }

        // Update folder if provided
        if (request.getFolderId() != null) {
            Folder folder = folderRepository.findByIdAndUserId(request.getFolderId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + request.getFolderId()));
            authKey.setFolder(folder);
        }

        // Update tags if provided
        if (request.getTagIds() != null) {
            // Clear existing tags
            authKey.getTags().clear();

            // Add new tags
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag not found with ID: " + tagId));
                authKey.addTag(tag);
            }
        }

        authKey.setUpdatedAt(LocalDateTime.now());
        authKey = authKeyRepository.save(authKey);

        log.info("Auth key updated successfully with ID: {}", authKeyId);
        return convertToResponse(authKey);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteAuthKey(Long userId, Long authKeyId) {
        log.info("Deleting auth key ID: {} for user ID: {}", authKeyId, userId);

        AuthKey authKey = authKeyRepository.findByIdAndUserId(authKeyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + authKeyId));

        // Soft delete
        authKey.setIsDeleted(true);
        authKey.setUpdatedAt(LocalDateTime.now());
        authKeyRepository.save(authKey);

        log.info("Auth key deleted successfully with ID: {}", authKeyId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AuthKeyResponse> searchAuthKeys(Long userId, String query, Pageable pageable) {
        log.debug("Searching auth keys for user ID: {} with query: {}", userId, query);

        Page<AuthKey> authKeys = authKeyRepository.searchByUserIdAndQuery(userId, query, pageable);
        return authKeys.map(this::convertToResponse);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AuthKeyResponse toggleFavorite(Long userId, Long authKeyId) {
        log.info("Toggling favorite for auth key ID: {} and user ID: {}", authKeyId, userId);

        AuthKey authKey = authKeyRepository.findByIdAndUserId(authKeyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + authKeyId));

        authKey.setIsFavorite(!authKey.getIsFavorite());
        authKey.setUpdatedAt(LocalDateTime.now());
        authKey = authKeyRepository.save(authKey);

        log.info("Favorite toggled successfully for auth key ID: {}", authKeyId);
        return convertToResponse(authKey);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void incrementAccessCount(Long userId, Long authKeyId) {
        log.debug("Incrementing access count for auth key ID: {}", authKeyId);

        AuthKey authKey = authKeyRepository.findByIdAndUserId(authKeyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + authKeyId));

        authKey.incrementAccessCount();
        authKeyRepository.save(authKey);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public AuthKeyResponse convertToResponse(AuthKey authKey) {
        return AuthKeyResponse.builder()
                .id(authKey.getId())
                .title(authKey.getTitle())
                .description(authKey.getDescription())
                .keyType(authKey.getKeyType())
                .username(authKey.getUsername())
                .email(authKey.getEmail())
                .encryptedValue(authKey.getEncryptedValue())
                .encryptionIv(authKey.getEncryptionIv())
                .encryptionSalt(authKey.getEncryptionSalt())
                .url(authKey.getUrl())
                .notes(authKey.getNotes())
                .isFavorite(authKey.getIsFavorite())
                .lastAccessedAt(authKey.getLastAccessedAt())
                .accessCount(authKey.getAccessCount())
                .expiresAt(authKey.getExpiresAt())
                .passwordStrength(authKey.getPasswordStrength())
                .folder(authKey.getFolder() != null ? folderService.convertToResponse(authKey.getFolder(), false) : null)
                .tags(authKey.getTags() != null ? authKey.getTags().stream()
                        .map(tagService::convertToResponse)
                        .collect(Collectors.toList()) : new ArrayList<>())
                .createdAt(authKey.getCreatedAt())
                .updatedAt(authKey.getUpdatedAt())
                .isExpired(authKey.isExpired())
                .build();
    }
}
