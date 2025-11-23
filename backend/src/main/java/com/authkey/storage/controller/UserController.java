package com.authkey.storage.controller;

import com.authkey.storage.dto.request.ChangePasswordRequest;
import com.authkey.storage.dto.request.UpdateUserRequest;
import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.dto.response.UserResponse;
import com.authkey.storage.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for user profile management
 * Handles user profile operations, password changes, and account deletion
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    /**
     * Get current authenticated user's profile
     *
     * @param authentication the authenticated user
     * @return user profile information
     */
    @Operation(
            summary = "Get current user profile",
            description = "Retrieves the profile information of the currently authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - invalid or missing token",
                    content = @Content
            )
    })
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Fetching profile for user ID: {}", userId);
        UserResponse response = userService.getUserResponseById(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user's profile
     *
     * @param authentication the authenticated user
     * @param request        the update user request
     * @return updated user profile information
     */
    @Operation(
            summary = "Update user profile",
            description = "Updates the profile information of the currently authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile updated successfully",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
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
                    responseCode = "409",
                    description = "Username or email already exists",
                    content = @Content
            )
    })
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Updating profile for user ID: {}", userId);
        UserResponse response = userService.updateProfile(
                userId,
                request.getFirstName(),
                request.getLastName()
        );
        log.info("Profile updated successfully for user ID: {}", userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Change user's password
     *
     * @param authentication the authenticated user
     * @param request        the change password request
     * @return success message
     */
    @Operation(
            summary = "Change password",
            description = "Changes the password for the currently authenticated user. " +
                    "Requires the current password for verification."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Password changed successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid current password or password validation failed",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Password change request for user ID: {}", userId);
        userService.changePassword(userId, request);
        log.info("Password changed successfully for user ID: {}", userId);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    /**
     * Delete current user's account
     *
     * @param authentication the authenticated user
     * @return success message
     */
    @Operation(
            summary = "Delete user account",
            description = "Permanently deletes the currently authenticated user's account. " +
                    "This action cannot be undone. All associated data will be removed."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Account deleted successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteAccount(
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.warn("Account deletion request for user ID: {}", userId);
        userService.deleteAccount(userId);
        log.warn("Account deleted successfully for user ID: {}", userId);
        return ResponseEntity.ok(
                new MessageResponse("Account deleted successfully")
        );
    }
}
