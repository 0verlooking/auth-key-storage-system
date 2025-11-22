package com.authkey.storage.controller;

import com.authkey.storage.dto.request.CreateShareLinkRequest;
import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.dto.response.ShareLinkResponse;
import com.authkey.storage.service.ShareLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for share link management
 * Handles creation, access, and revocation of share links for authentication keys
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/share-links")
@RequiredArgsConstructor
@Tag(name = "Share Links", description = "Share link management APIs for sharing authentication keys")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ShareLinkController {

    private final ShareLinkService shareLinkService;

    /**
     * Create a new share link
     *
     * @param authentication the authenticated user
     * @param request        the create share link request
     * @return created share link with token
     */
    @Operation(
            summary = "Create share link",
            description = "Creates a shareable link for an authentication key with optional expiration and password protection",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Share link created successfully",
                    content = @Content(schema = @Schema(implementation = ShareLinkResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Authentication key not found",
                    content = @Content
            )
    })
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShareLinkResponse> createShareLink(
            Authentication authentication,
            @Valid @RequestBody CreateShareLinkRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Creating share link for auth key ID: {} by user ID: {}",
                request.getAuthKeyId(), userId);
        ShareLinkResponse response = shareLinkService.createShareLink(userId, request);
        log.info("Share link created successfully with token: {}", response.getShareToken());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get share link by token (public access)
     *
     * @param token          the share token
     * @param accessPassword optional access password if link is password-protected
     * @return share link details with authentication key
     */
    @Operation(
            summary = "Access share link",
            description = "Accesses a shared authentication key using the share token. " +
                    "Password required if the link is password-protected."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Share link accessed successfully",
                    content = @Content(schema = @Schema(implementation = ShareLinkResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid password or link expired",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Share link not found",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "410",
                    description = "Share link has expired or been revoked",
                    content = @Content
            )
    })
    @GetMapping("/{token}")
    public ResponseEntity<ShareLinkResponse> getShareLink(
            @Parameter(description = "Share link token", required = true)
            @PathVariable String token,
            @Parameter(description = "Access password (if required)")
            @RequestParam(required = false) String password
    ) {
        log.info("Accessing share link with token: {}", token);
        ShareLinkResponse response = shareLinkService.accessShareLink(token, password);
        log.info("Share link accessed successfully: {}", token);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all share links created by current user
     *
     * @param authentication the authenticated user
     * @return list of user's share links
     */
    @Operation(
            summary = "Get my share links",
            description = "Retrieves all share links created by the current user",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Share links retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ShareLinkResponse>> getMyShareLinks(
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching share links for user ID: {}", userId);
        List<ShareLinkResponse> response = shareLinkService.getUserShareLinks(userId);
        log.info("Retrieved {} share links for user ID: {}", response.size(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Revoke (delete) a share link
     *
     * @param authentication the authenticated user
     * @param id             the share link ID
     * @return success message
     */
    @Operation(
            summary = "Revoke share link",
            description = "Revokes a share link, making it inaccessible. This action cannot be undone.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Share link revoked successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Share link not found",
                    content = @Content
            )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> revokeShareLink(
            Authentication authentication,
            @Parameter(description = "Share link ID", required = true)
            @PathVariable Long id
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.warn("Revoking share link ID: {} by user ID: {}", id, userId);
        shareLinkService.revokeShareLink(userId, id);
        log.info("Share link revoked successfully: {}", id);
        return ResponseEntity.ok(new MessageResponse("Share link revoked successfully"));
    }
}
