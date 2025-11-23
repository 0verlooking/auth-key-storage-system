package com.authkey.storage.controller;

import com.authkey.storage.dto.request.CreateTagRequest;
import com.authkey.storage.dto.request.UpdateTagRequest;
import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.dto.response.TagResponse;
import com.authkey.storage.service.TagService;
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
 * REST Controller for tag management
 * Handles tag CRUD operations for categorizing authentication keys
 */
@Slf4j
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "Tag management APIs for categorizing authentication keys")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TagController {

    private final TagService tagService;

    /**
     * Create a new tag
     *
     * @param authentication the authenticated user
     * @param request        the create tag request
     * @return created tag
     */
    @Operation(
            summary = "Create tag",
            description = "Creates a new tag for categorizing authentication keys"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Tag created successfully",
                    content = @Content(schema = @Schema(implementation = TagResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or tag already exists",
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
    public ResponseEntity<TagResponse> createTag(
            Authentication authentication,
            @Valid @RequestBody CreateTagRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Creating tag '{}' for user ID: {}", request.getName(), userId);
        TagResponse response = tagService.createTag(userId, request);
        log.info("Tag created successfully with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all tags for current user
     *
     * @param authentication the authenticated user
     * @return list of all tags
     */
    @Operation(
            summary = "Get all tags",
            description = "Retrieves all tags for the current user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tags retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TagResponse>> getAllTags(
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching all tags for user ID: {}", userId);
        List<TagResponse> response = tagService.getAllTags(userId);
        log.info("Retrieved {} tags for user ID: {}", response.size(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get tag by ID
     *
     * @param authentication the authenticated user
     * @param id             the tag ID
     * @return tag details
     */
    @Operation(
            summary = "Get tag by ID",
            description = "Retrieves a specific tag by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tag retrieved successfully",
                    content = @Content(schema = @Schema(implementation = TagResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tag not found",
                    content = @Content
            )
    })
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TagResponse> getTagById(
            Authentication authentication,
            @Parameter(description = "Tag ID", required = true)
            @PathVariable Long id
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching tag ID: {} for user ID: {}", id, userId);
        TagResponse response = tagService.getTagById(userId, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update tag
     *
     * @param authentication the authenticated user
     * @param id             the tag ID
     * @param request        the update tag request
     * @return updated tag
     */
    @Operation(
            summary = "Update tag",
            description = "Updates an existing tag"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tag updated successfully",
                    content = @Content(schema = @Schema(implementation = TagResponse.class))
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
                    description = "Tag not found",
                    content = @Content
            )
    })
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TagResponse> updateTag(
            Authentication authentication,
            @Parameter(description = "Tag ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UpdateTagRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Updating tag ID: {} for user ID: {}", id, userId);

        // Convert UpdateTagRequest to CreateTagRequest for service compatibility
        CreateTagRequest createRequest = CreateTagRequest.builder()
                .name(request.getName())
                .color(request.getColor())
                .build();

        TagResponse response = tagService.updateTag(userId, id, createRequest);
        log.info("Tag updated successfully: {}", id);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete tag
     *
     * @param authentication the authenticated user
     * @param id             the tag ID
     * @return success message
     */
    @Operation(
            summary = "Delete tag",
            description = "Permanently deletes a tag. The tag will be removed from all authentication keys."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tag deleted successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tag not found",
                    content = @Content
            )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteTag(
            Authentication authentication,
            @Parameter(description = "Tag ID", required = true)
            @PathVariable Long id
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.warn("Deleting tag ID: {} for user ID: {}", id, userId);
        tagService.deleteTag(userId, id);
        log.info("Tag deleted successfully: {}", id);
        return ResponseEntity.ok(new MessageResponse("Tag deleted successfully"));
    }
}
