package com.authkey.storage.controller;

import com.authkey.storage.dto.request.CreateAuthKeyRequest;
import com.authkey.storage.dto.request.UpdateAuthKeyRequest;
import com.authkey.storage.dto.response.AuthKeyResponse;
import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.service.AuthKeyService;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication key management
 * Handles CRUD operations, search, favorites, and folder organization for authentication keys
 */
@Slf4j
@RestController
@RequestMapping("/api/auth-keys")
@RequiredArgsConstructor
@Tag(name = "Authentication Keys", description = "Authentication key management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthKeyController {

    private final AuthKeyService authKeyService;

    /**
     * Create a new authentication key
     *
     * @param authentication the authenticated user
     * @param request        the create auth key request
     * @return created authentication key
     */
    @Operation(
            summary = "Create authentication key",
            description = "Creates a new authentication key with encryption"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Authentication key created successfully",
                    content = @Content(schema = @Schema(implementation = AuthKeyResponse.class))
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
            )
    })
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthKeyResponse> createAuthKey(
            Authentication authentication,
            @Valid @RequestBody CreateAuthKeyRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Creating auth key for user ID: {}", userId);
        AuthKeyResponse response = authKeyService.createAuthKey(userId, request);
        log.info("Auth key created successfully with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all authentication keys for current user with pagination
     *
     * @param authentication the authenticated user
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @param sort           sort field (default: createdAt)
     * @param direction      sort direction (default: DESC)
     * @return page of authentication keys
     */
    @Operation(
            summary = "Get all authentication keys",
            description = "Retrieves all authentication keys for the current user with pagination and sorting"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication keys retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuthKeyResponse>> getAllAuthKeys(
            Authentication authentication,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching auth keys for user ID: {} (page: {}, size: {})", userId, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<AuthKeyResponse> response = authKeyService.getAllAuthKeys(userId, pageable);
        log.info("Retrieved {} auth keys for user ID: {}", response.getTotalElements(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get authentication key by ID
     *
     * @param authentication the authenticated user
     * @param id             the auth key ID
     * @return authentication key details
     */
    @Operation(
            summary = "Get authentication key by ID",
            description = "Retrieves a specific authentication key by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication key retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AuthKeyResponse.class))
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
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthKeyResponse> getAuthKeyById(
            Authentication authentication,
            @Parameter(description = "Authentication key ID", required = true)
            @PathVariable Long id
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching auth key ID: {} for user ID: {}", id, userId);
        AuthKeyResponse response = authKeyService.getAuthKeyById(userId, id);
        authKeyService.incrementAccessCount(userId, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update authentication key
     *
     * @param authentication the authenticated user
     * @param id             the auth key ID
     * @param request        the update auth key request
     * @return updated authentication key
     */
    @Operation(
            summary = "Update authentication key",
            description = "Updates an existing authentication key"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication key updated successfully",
                    content = @Content(schema = @Schema(implementation = AuthKeyResponse.class))
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
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthKeyResponse> updateAuthKey(
            Authentication authentication,
            @Parameter(description = "Authentication key ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UpdateAuthKeyRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Updating auth key ID: {} for user ID: {}", id, userId);
        AuthKeyResponse response = authKeyService.updateAuthKey(userId, id, request);
        log.info("Auth key updated successfully: {}", id);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete authentication key
     *
     * @param authentication the authenticated user
     * @param id             the auth key ID
     * @return success message
     */
    @Operation(
            summary = "Delete authentication key",
            description = "Permanently deletes an authentication key"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication key deleted successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
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
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteAuthKey(
            Authentication authentication,
            @Parameter(description = "Authentication key ID", required = true)
            @PathVariable Long id
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.warn("Deleting auth key ID: {} for user ID: {}", id, userId);
        authKeyService.deleteAuthKey(userId, id);
        log.info("Auth key deleted successfully: {}", id);
        return ResponseEntity.ok(new MessageResponse("Authentication key deleted successfully"));
    }

    /**
     * Get authentication keys by folder
     *
     * @param authentication the authenticated user
     * @param folderId       the folder ID
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @return page of authentication keys in the folder
     */
    @Operation(
            summary = "Get authentication keys by folder",
            description = "Retrieves all authentication keys in a specific folder"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication keys retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Folder not found",
                    content = @Content
            )
    })
    @GetMapping("/folder/{folderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuthKeyResponse>> getAuthKeysByFolder(
            Authentication authentication,
            @Parameter(description = "Folder ID", required = true)
            @PathVariable Long folderId,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching auth keys for folder ID: {} and user ID: {}", folderId, userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuthKeyResponse> response = authKeyService.getAuthKeysByFolder(userId, folderId, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Get favorite authentication keys
     *
     * @param authentication the authenticated user
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @return page of favorite authentication keys
     */
    @Operation(
            summary = "Get favorite authentication keys",
            description = "Retrieves all authentication keys marked as favorites"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Favorite authentication keys retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping("/favorites")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuthKeyResponse>> getFavoriteAuthKeys(
            Authentication authentication,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching favorite auth keys for user ID: {}", userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Page<AuthKeyResponse> response = authKeyService.getFavoriteAuthKeys(userId, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Toggle favorite status for authentication key
     *
     * @param authentication the authenticated user
     * @param id             the auth key ID
     * @return updated authentication key
     */
    @Operation(
            summary = "Toggle favorite status",
            description = "Toggles the favorite status of an authentication key"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Favorite status toggled successfully",
                    content = @Content(schema = @Schema(implementation = AuthKeyResponse.class))
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
    @PostMapping("/{id}/favorite")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthKeyResponse> toggleFavorite(
            Authentication authentication,
            @Parameter(description = "Authentication key ID", required = true)
            @PathVariable Long id
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Toggling favorite status for auth key ID: {} and user ID: {}", id, userId);
        AuthKeyResponse response = authKeyService.toggleFavorite(userId, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Search authentication keys
     *
     * @param authentication the authenticated user
     * @param query          search query
     * @param page           page number (default: 0)
     * @param size           page size (default: 20)
     * @return page of matching authentication keys
     */
    @Operation(
            summary = "Search authentication keys",
            description = "Searches authentication keys by name, description, username, or notes"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Search completed successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AuthKeyResponse>> searchAuthKeys(
            Authentication authentication,
            @Parameter(description = "Search query", required = true)
            @RequestParam("q") String query,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Searching auth keys for user ID: {} with query: '{}'", userId, query);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuthKeyResponse> response = authKeyService.searchAuthKeys(userId, query, pageable);

        log.info("Found {} auth keys matching query for user ID: {}", response.getTotalElements(), userId);
        return ResponseEntity.ok(response);
    }
}
