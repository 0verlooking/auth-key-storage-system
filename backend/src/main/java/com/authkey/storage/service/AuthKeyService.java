package com.authkey.storage.service;

import com.authkey.storage.dto.request.CreateAuthKeyRequest;
import com.authkey.storage.dto.request.UpdateAuthKeyRequest;
import com.authkey.storage.dto.response.AuthKeyResponse;
import com.authkey.storage.entity.AuthKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for authentication key management
 */
public interface AuthKeyService {

    /**
     * Create a new authentication key
     * @param userId the user ID
     * @param request the create auth key request
     * @return the created auth key response
     */
    AuthKeyResponse createAuthKey(Long userId, CreateAuthKeyRequest request);

    /**
     * Get authentication key by ID
     * @param userId the user ID
     * @param authKeyId the auth key ID
     * @return the auth key response
     */
    AuthKeyResponse getAuthKeyById(Long userId, Long authKeyId);

    /**
     * Get all authentication keys for user
     * @param userId the user ID
     * @param pageable the pagination information
     * @return page of auth key responses
     */
    Page<AuthKeyResponse> getAllAuthKeys(Long userId, Pageable pageable);

    /**
     * Get all authentication keys for user (without pagination)
     * @param userId the user ID
     * @return list of auth key responses
     */
    List<AuthKeyResponse> getAllAuthKeys(Long userId);

    /**
     * Get authentication keys by folder
     * @param userId the user ID
     * @param folderId the folder ID
     * @param pageable the pagination information
     * @return page of auth key responses
     */
    Page<AuthKeyResponse> getAuthKeysByFolder(Long userId, Long folderId, Pageable pageable);

    /**
     * Get favorite authentication keys
     * @param userId the user ID
     * @param pageable the pagination information
     * @return page of auth key responses
     */
    Page<AuthKeyResponse> getFavoriteAuthKeys(Long userId, Pageable pageable);

    /**
     * Update authentication key
     * @param userId the user ID
     * @param authKeyId the auth key ID
     * @param request the update auth key request
     * @return the updated auth key response
     */
    AuthKeyResponse updateAuthKey(Long userId, Long authKeyId, UpdateAuthKeyRequest request);

    /**
     * Delete authentication key
     * @param userId the user ID
     * @param authKeyId the auth key ID
     */
    void deleteAuthKey(Long userId, Long authKeyId);

    /**
     * Search authentication keys
     * @param userId the user ID
     * @param query the search query
     * @param pageable the pagination information
     * @return page of auth key responses
     */
    Page<AuthKeyResponse> searchAuthKeys(Long userId, String query, Pageable pageable);

    /**
     * Toggle favorite status
     * @param userId the user ID
     * @param authKeyId the auth key ID
     * @return the updated auth key response
     */
    AuthKeyResponse toggleFavorite(Long userId, Long authKeyId);

    /**
     * Increment access count
     * @param userId the user ID
     * @param authKeyId the auth key ID
     */
    void incrementAccessCount(Long userId, Long authKeyId);

    /**
     * Convert AuthKey entity to AuthKeyResponse DTO
     * @param authKey the auth key entity
     * @return the auth key response DTO
     */
    AuthKeyResponse convertToResponse(AuthKey authKey);
}
