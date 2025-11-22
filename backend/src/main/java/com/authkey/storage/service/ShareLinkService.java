package com.authkey.storage.service;

import com.authkey.storage.dto.request.CreateShareLinkRequest;
import com.authkey.storage.dto.response.ShareLinkResponse;
import com.authkey.storage.entity.ShareLink;

import java.util.List;

/**
 * Service interface for share link management
 */
public interface ShareLinkService {

    /**
     * Create a share link for an authentication key
     * @param userId the user ID
     * @param request the create share link request
     * @return the created share link response
     */
    ShareLinkResponse createShareLink(Long userId, CreateShareLinkRequest request);

    /**
     * Get share link by token
     * @param shareToken the share token
     * @return the share link response
     */
    ShareLinkResponse getShareLink(String shareToken);

    /**
     * Access share link (increment access count)
     * @param shareToken the share token
     * @param accessPassword the access password (if required)
     * @return the share link response with decrypted key
     */
    ShareLinkResponse accessShareLink(String shareToken, String accessPassword);

    /**
     * Get all share links for user
     * @param userId the user ID
     * @return list of share link responses
     */
    List<ShareLinkResponse> getUserShareLinks(Long userId);

    /**
     * Get share links for specific auth key
     * @param userId the user ID
     * @param authKeyId the auth key ID
     * @return list of share link responses
     */
    List<ShareLinkResponse> getAuthKeyShareLinks(Long userId, Long authKeyId);

    /**
     * Revoke share link
     * @param userId the user ID
     * @param shareLinkId the share link ID
     */
    void revokeShareLink(Long userId, Long shareLinkId);

    /**
     * Convert ShareLink entity to ShareLinkResponse DTO
     * @param shareLink the share link entity
     * @return the share link response DTO
     */
    ShareLinkResponse convertToResponse(ShareLink shareLink);
}
