package com.authkey.storage.service.impl;

import com.authkey.storage.dto.request.CreateShareLinkRequest;
import com.authkey.storage.dto.response.ShareLinkResponse;
import com.authkey.storage.entity.AuthKey;
import com.authkey.storage.entity.ShareLink;
import com.authkey.storage.exception.BadRequestException;
import com.authkey.storage.exception.ResourceNotFoundException;
import com.authkey.storage.exception.UnauthorizedException;
import com.authkey.storage.repository.AuthKeyRepository;
import com.authkey.storage.repository.ShareLinkRepository;
import com.authkey.storage.service.ShareLinkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ShareLinkService interface
 * Handles share link management operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ShareLinkServiceImpl implements ShareLinkService {

    private final ShareLinkRepository shareLinkRepository;
    private final AuthKeyRepository authKeyRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public ShareLinkResponse createShareLink(Long userId, CreateShareLinkRequest request) {
        log.info("Creating share link for auth key ID: {} by user ID: {}", request.getAuthKeyId(), userId);

        AuthKey authKey = authKeyRepository.findByIdAndUserId(request.getAuthKeyId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + request.getAuthKeyId()));

        // Build share link
        ShareLink shareLink = ShareLink.builder()
                .authKey(authKey)
                .encryptedKey(authKey.getEncryptedValue())
                .maxAccessCount(request.getMaxAccessCount())
                .currentAccessCount(0)
                .expiresAt(request.getExpiresAt())
                .isActive(true)
                .allowDownload(request.getAllowDownload() != null ? request.getAllowDownload() : false)
                .build();

        // Set access password if provided
        if (request.getAccessPassword() != null && !request.getAccessPassword().isEmpty()) {
            shareLink.setAccessPasswordHash(passwordEncoder.encode(request.getAccessPassword()));
        }

        shareLink = shareLinkRepository.save(shareLink);

        log.info("Share link created successfully with ID: {}", shareLink.getId());
        return convertToResponse(shareLink);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public ShareLinkResponse getShareLink(String shareToken) {
        log.debug("Fetching share link with token");

        ShareLink shareLink = shareLinkRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new ResourceNotFoundException("Share link not found"));

        return convertToResponse(shareLink);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public ShareLinkResponse accessShareLink(String shareToken, String accessPassword) {
        log.info("Accessing share link with token");

        ShareLink shareLink = shareLinkRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new ResourceNotFoundException("Share link not found"));

        // Check if share link can be accessed
        if (!shareLink.canAccess()) {
            if (shareLink.isExpired()) {
                throw new BadRequestException("Share link has expired");
            }
            if (shareLink.isMaxAccessReached()) {
                throw new BadRequestException("Share link has reached maximum access count");
            }
            if (!shareLink.getIsActive()) {
                throw new BadRequestException("Share link is inactive");
            }
        }

        // Verify password if required
        if (shareLink.getAccessPasswordHash() != null) {
            if (accessPassword == null || !passwordEncoder.matches(accessPassword, shareLink.getAccessPasswordHash())) {
                throw new UnauthorizedException("Invalid access password");
            }
        }

        // Increment access count
        shareLink.incrementAccessCount();
        shareLink = shareLinkRepository.save(shareLink);

        log.info("Share link accessed successfully");
        return convertToResponse(shareLink);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<ShareLinkResponse> getUserShareLinks(Long userId) {
        log.debug("Fetching all share links for user ID: {}", userId);

        List<ShareLink> shareLinks = shareLinkRepository.findByAuthKeyUserId(userId);
        return shareLinks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<ShareLinkResponse> getAuthKeyShareLinks(Long userId, Long authKeyId) {
        log.debug("Fetching share links for auth key ID: {} and user ID: {}", authKeyId, userId);

        // Verify auth key belongs to user
        authKeyRepository.findByIdAndUserId(authKeyId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth key not found with ID: " + authKeyId));

        List<ShareLink> shareLinks = shareLinkRepository.findByAuthKeyId(authKeyId);
        return shareLinks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void revokeShareLink(Long userId, Long shareLinkId) {
        log.info("Revoking share link ID: {} by user ID: {}", shareLinkId, userId);

        ShareLink shareLink = shareLinkRepository.findById(shareLinkId)
                .orElseThrow(() -> new ResourceNotFoundException("Share link not found with ID: " + shareLinkId));

        // Verify share link belongs to user
        if (!shareLink.getAuthKey().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized to revoke this share link");
        }

        shareLink.setIsActive(false);
        shareLink.setUpdatedAt(LocalDateTime.now());
        shareLinkRepository.save(shareLink);

        log.info("Share link revoked successfully with ID: {}", shareLinkId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ShareLinkResponse convertToResponse(ShareLink shareLink) {
        String shareUrl = baseUrl + "/share/" + shareLink.getShareToken();

        return ShareLinkResponse.builder()
                .id(shareLink.getId())
                .shareToken(shareLink.getShareToken())
                .shareUrl(shareUrl)
                .encryptedKey(shareLink.getEncryptedKey())
                .hasPassword(shareLink.getAccessPasswordHash() != null)
                .maxAccessCount(shareLink.getMaxAccessCount())
                .currentAccessCount(shareLink.getCurrentAccessCount())
                .expiresAt(shareLink.getExpiresAt())
                .isActive(shareLink.getIsActive())
                .allowDownload(shareLink.getAllowDownload())
                .authKeyId(shareLink.getAuthKey().getId())
                .authKeyTitle(shareLink.getAuthKey().getTitle())
                .createdAt(shareLink.getCreatedAt())
                .isExpired(shareLink.isExpired())
                .canAccess(shareLink.canAccess())
                .build();
    }
}
