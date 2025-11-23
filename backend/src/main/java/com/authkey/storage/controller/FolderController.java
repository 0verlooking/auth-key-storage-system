package com.authkey.storage.controller;

import com.authkey.storage.dto.request.CreateFolderRequest;
import com.authkey.storage.dto.request.UpdateFolderRequest;
import com.authkey.storage.dto.response.FolderResponse;
import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.entity.User;
import com.authkey.storage.service.FolderService;
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
 * REST Controller for folder management
 * Handles folder CRUD operations and hierarchical folder organization
 */
@Slf4j
@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
@Tag(name = "Folders", description = "Folder management APIs for organizing authentication keys")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FolderController {

    private final FolderService folderService;

    /**
     * Create a new folder
     *
     * @param authentication the authenticated user
     * @param request        the create folder request
     * @return created folder
     */
    @Operation(
            summary = "Create folder",
            description = "Creates a new folder for organizing authentication keys"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Folder created successfully",
                    content = @Content(schema = @Schema(implementation = FolderResponse.class))
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
    public ResponseEntity<FolderResponse> createFolder(
            Authentication authentication,
            @Valid @RequestBody CreateFolderRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.info("Creating folder for user ID: {}", userId);
        FolderResponse response = folderService.createFolder(userId, request);
        log.info("Folder created successfully with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all folders for current user
     *
     * @param authentication the authenticated user
     * @return list of all folders
     */
    @Operation(
            summary = "Get all folders",
            description = "Retrieves all folders for the current user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Folders retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FolderResponse>> getAllFolders(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.info("Fetching all folders for user ID: {}", userId);
        List<FolderResponse> response = folderService.getAllFolders(userId);
        log.info("Retrieved {} folders for user ID: {}", response.size(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get root folders (folders without parent)
     *
     * @param authentication the authenticated user
     * @return list of root folders
     */
    @Operation(
            summary = "Get root folders",
            description = "Retrieves all root-level folders (folders without a parent)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Root folders retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @GetMapping("/root")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FolderResponse>> getRootFolders(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.info("Fetching root folders for user ID: {}", userId);
        List<FolderResponse> response = folderService.getRootFolders(userId);
        log.info("Retrieved {} root folders for user ID: {}", response.size(), userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get folder by ID
     *
     * @param authentication the authenticated user
     * @param id             the folder ID
     * @return folder details
     */
    @Operation(
            summary = "Get folder by ID",
            description = "Retrieves a specific folder by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Folder retrieved successfully",
                    content = @Content(schema = @Schema(implementation = FolderResponse.class))
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
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FolderResponse> getFolderById(
            Authentication authentication,
            @Parameter(description = "Folder ID", required = true)
            @PathVariable Long id
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.info("Fetching folder ID: {} for user ID: {}", id, userId);
        FolderResponse response = folderService.getFolderById(userId, id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update folder
     *
     * @param authentication the authenticated user
     * @param id             the folder ID
     * @param request        the update folder request
     * @return updated folder
     */
    @Operation(
            summary = "Update folder",
            description = "Updates an existing folder"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Folder updated successfully",
                    content = @Content(schema = @Schema(implementation = FolderResponse.class))
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
                    description = "Folder not found",
                    content = @Content
            )
    })
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FolderResponse> updateFolder(
            Authentication authentication,
            @Parameter(description = "Folder ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody UpdateFolderRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.info("Updating folder ID: {} for user ID: {}", id, userId);
        FolderResponse response = folderService.updateFolder(userId, id, request);
        log.info("Folder updated successfully: {}", id);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete folder
     *
     * @param authentication the authenticated user
     * @param id             the folder ID
     * @return success message
     */
    @Operation(
            summary = "Delete folder",
            description = "Permanently deletes a folder. All authentication keys in this folder will be moved to root."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Folder deleted successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
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
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteFolder(
            Authentication authentication,
            @Parameter(description = "Folder ID", required = true)
            @PathVariable Long id
    ) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        log.warn("Deleting folder ID: {} for user ID: {}", id, userId);
        folderService.deleteFolder(userId, id);
        log.info("Folder deleted successfully: {}", id);
        return ResponseEntity.ok(new MessageResponse("Folder deleted successfully"));
    }
}
