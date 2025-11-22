package com.authkey.storage.service.impl;

import com.authkey.storage.dto.request.CreateFolderRequest;
import com.authkey.storage.dto.request.UpdateFolderRequest;
import com.authkey.storage.dto.response.FolderResponse;
import com.authkey.storage.entity.Folder;
import com.authkey.storage.entity.User;
import com.authkey.storage.exception.BadRequestException;
import com.authkey.storage.exception.ResourceNotFoundException;
import com.authkey.storage.repository.FolderRepository;
import com.authkey.storage.service.FolderService;
import com.authkey.storage.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of FolderService interface
 * Handles folder management operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;
    private final UserService userService;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public FolderResponse createFolder(Long userId, CreateFolderRequest request) {
        log.info("Creating folder for user ID: {}", userId);

        User user = userService.getUserById(userId);

        // Build folder
        Folder folder = Folder.builder()
                .name(request.getName())
                .description(request.getDescription())
                .color(request.getColor())
                .icon(request.getIcon())
                .user(user)
                .build();

        // Set parent folder if provided
        if (request.getParentFolderId() != null) {
            Folder parentFolder = folderRepository.findByIdAndUserId(request.getParentFolderId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found with ID: " + request.getParentFolderId()));
            folder.setParentFolder(parentFolder);
        }

        folder = folderRepository.save(folder);

        log.info("Folder created successfully with ID: {}", folder.getId());
        return convertToResponse(folder, false);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public FolderResponse getFolderById(Long userId, Long folderId) {
        log.debug("Fetching folder ID: {} for user ID: {}", folderId, userId);

        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + folderId));

        return convertToResponse(folder, true);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<FolderResponse> getAllFolders(Long userId) {
        log.debug("Fetching all folders for user ID: {}", userId);

        List<Folder> folders = folderRepository.findByUserId(userId);
        return folders.stream()
                .map(folder -> convertToResponse(folder, false))
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<FolderResponse> getRootFolders(Long userId) {
        log.debug("Fetching root folders for user ID: {}", userId);

        List<Folder> folders = folderRepository.findByUserIdAndParentFolderIsNull(userId);
        return folders.stream()
                .map(folder -> convertToResponse(folder, true))
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<FolderResponse> getSubFolders(Long userId, Long parentFolderId) {
        log.debug("Fetching subfolders for folder ID: {} and user ID: {}", parentFolderId, userId);

        List<Folder> folders = folderRepository.findByUserIdAndParentFolderId(userId, parentFolderId);
        return folders.stream()
                .map(folder -> convertToResponse(folder, false))
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public FolderResponse updateFolder(Long userId, Long folderId, UpdateFolderRequest request) {
        log.info("Updating folder ID: {} for user ID: {}", folderId, userId);

        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + folderId));

        // Update fields if provided
        if (request.getName() != null) {
            folder.setName(request.getName());
        }
        if (request.getDescription() != null) {
            folder.setDescription(request.getDescription());
        }
        if (request.getColor() != null) {
            folder.setColor(request.getColor());
        }
        if (request.getIcon() != null) {
            folder.setIcon(request.getIcon());
        }

        // Update parent folder if provided
        if (request.getParentFolderId() != null) {
            // Check for circular reference
            if (request.getParentFolderId().equals(folderId)) {
                throw new BadRequestException("Folder cannot be its own parent");
            }

            Folder parentFolder = folderRepository.findByIdAndUserId(request.getParentFolderId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found with ID: " + request.getParentFolderId()));

            // Check if parent folder is a descendant of current folder
            if (isDescendant(folder, parentFolder)) {
                throw new BadRequestException("Cannot move folder to its own descendant");
            }

            folder.setParentFolder(parentFolder);
        }

        folder.setUpdatedAt(LocalDateTime.now());
        folder = folderRepository.save(folder);

        log.info("Folder updated successfully with ID: {}", folderId);
        return convertToResponse(folder, false);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteFolder(Long userId, Long folderId) {
        log.info("Deleting folder ID: {} for user ID: {}", folderId, userId);

        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + folderId));

        // Soft delete
        folder.setIsDeleted(true);
        folder.setUpdatedAt(LocalDateTime.now());
        folderRepository.save(folder);

        log.info("Folder deleted successfully with ID: {}", folderId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public FolderResponse moveFolder(Long userId, Long folderId, Long newParentFolderId) {
        log.info("Moving folder ID: {} to parent folder ID: {}", folderId, newParentFolderId);

        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + folderId));

        if (newParentFolderId != null) {
            // Check for circular reference
            if (newParentFolderId.equals(folderId)) {
                throw new BadRequestException("Folder cannot be its own parent");
            }

            Folder newParentFolder = folderRepository.findByIdAndUserId(newParentFolderId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found with ID: " + newParentFolderId));

            // Check if new parent folder is a descendant of current folder
            if (isDescendant(folder, newParentFolder)) {
                throw new BadRequestException("Cannot move folder to its own descendant");
            }

            folder.setParentFolder(newParentFolder);
        } else {
            folder.setParentFolder(null);
        }

        folder.setUpdatedAt(LocalDateTime.now());
        folder = folderRepository.save(folder);

        log.info("Folder moved successfully with ID: {}", folderId);
        return convertToResponse(folder, false);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public FolderResponse convertToResponse(Folder folder) {
        return convertToResponse(folder, false);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public FolderResponse convertToResponse(Folder folder, boolean includeSubFolders) {
        FolderResponse.FolderResponseBuilder builder = FolderResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .description(folder.getDescription())
                .color(folder.getColor())
                .icon(folder.getIcon())
                .parentFolderId(folder.getParentFolder() != null ? folder.getParentFolder().getId() : null)
                .authKeysCount(folder.getAuthKeys() != null ? folder.getAuthKeys().size() : 0)
                .isRoot(folder.isRootFolder())
                .depth(folder.getDepth())
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt());

        if (includeSubFolders && folder.getSubFolders() != null) {
            builder.subFolders(folder.getSubFolders().stream()
                    .map(subFolder -> convertToResponse(subFolder, false))
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }

    /**
     * Check if a folder is a descendant of another folder
     */
    private boolean isDescendant(Folder ancestor, Folder potentialDescendant) {
        Folder current = potentialDescendant.getParentFolder();
        while (current != null) {
            if (current.getId().equals(ancestor.getId())) {
                return true;
            }
            current = current.getParentFolder();
        }
        return false;
    }
}
