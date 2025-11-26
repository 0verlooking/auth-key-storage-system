package com.authkey.storage.controller;

import com.authkey.storage.dto.response.MessageResponse;
import com.authkey.storage.entity.User;
import com.authkey.storage.repository.AuthKeyRepository;
import com.authkey.storage.repository.FolderRepository;
import com.authkey.storage.repository.TagRepository;
import com.authkey.storage.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST Controller for admin operations
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management APIs")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final UserRepository userRepository;
    private final AuthKeyRepository authKeyRepository;
    private final FolderRepository folderRepository;
    private final TagRepository tagRepository;

    /**
     * Get system statistics
     */
    @Operation(summary = "Get system statistics", description = "Get overall system statistics (admin only)")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        log.info("Admin {} requesting system statistics", currentUser.getEmail());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAuthKeys", authKeyRepository.count());
        stats.put("totalFolders", folderRepository.count());
        stats.put("totalTags", tagRepository.count());

        return ResponseEntity.ok(stats);
    }

    /**
     * Get all users
     */
    @Operation(summary = "Get all users", description = "Get list of all users (admin only)")
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        log.info("Admin {} requesting all users", currentUser.getEmail());

        List<User> users = userRepository.findAll();

        List<Map<String, Object>> usersData = users.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("username", user.getUsername());
            userData.put("role", user.getRole());
            userData.put("accountLocked", user.getAccountLocked());
            userData.put("isEmailVerified", user.getIsEmailVerified());
            userData.put("authKeyCount", authKeyRepository.findByUserId(user.getId()).size());
            userData.put("createdAt", user.getCreatedAt());
            userData.put("lastLoginAt", user.getLastLoginAt());
            return userData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(usersData);
    }

    /**
     * Get all auth keys metadata (without decrypted values)
     */
    @Operation(summary = "Get all auth keys", description = "Get metadata for all auth keys (admin only)")
    @GetMapping("/auth-keys")
    public ResponseEntity<List<Map<String, Object>>> getAllAuthKeys(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        log.info("Admin {} requesting all auth keys", currentUser.getEmail());

        var authKeys = authKeyRepository.findAll();

        List<Map<String, Object>> keysData = authKeys.stream().map(key -> {
            Map<String, Object> keyData = new HashMap<>();
            keyData.put("id", key.getId());
            keyData.put("title", key.getTitle());
            keyData.put("keyType", key.getKeyType());
            keyData.put("userEmail", key.getUser().getEmail());
            keyData.put("folderName", key.getFolder() != null ? key.getFolder().getName() : null);
            keyData.put("accessCount", key.getAccessCount());
            keyData.put("lastAccessedAt", key.getLastAccessedAt());
            keyData.put("isFavorite", key.getIsFavorite());
            keyData.put("createdAt", key.getCreatedAt());
            // NOTE: Do NOT include encrypted values for security
            return keyData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(keysData);
    }

    /**
     * Toggle user account status (lock/unlock)
     */
    @Operation(summary = "Toggle user status", description = "Lock or unlock user account (admin only)")
    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<MessageResponse> toggleUserStatus(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        User currentUser = (User) authentication.getPrincipal();
        log.info("Admin {} toggling status for user ID: {}", currentUser.getEmail(), userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountLocked(!user.getAccountLocked());
        userRepository.save(user);

        String action = user.getAccountLocked() ? "locked" : "unlocked";
        log.info("User {} has been {}", user.getEmail(), action);

        return ResponseEntity.ok(new MessageResponse("User " + action + " successfully"));
    }

    /**
     * Delete user (soft delete)
     */
    @Operation(summary = "Delete user", description = "Soft delete a user account (admin only)")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<MessageResponse> deleteUser(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        User currentUser = (User) authentication.getPrincipal();
        log.warn("Admin {} deleting user ID: {}", currentUser.getEmail(), userId);

        if (currentUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Cannot delete your own account"));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.softDelete();
        userRepository.save(user);

        log.info("User {} has been soft deleted", user.getEmail());
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}
