package com.authkey.storage.service;

import com.authkey.storage.dto.request.CreateFolderRequest;
import com.authkey.storage.dto.request.UpdateFolderRequest;
import com.authkey.storage.dto.response.FolderResponse;
import com.authkey.storage.entity.Folder;

import java.util.List;

/**
 * Service interface for folder management
 */
public interface FolderService {

    /**
     * Create a new folder
     * @param userId the user ID
     * @param request the create folder request
     * @return the created folder response
     */
    FolderResponse createFolder(Long userId, CreateFolderRequest request);

    /**
     * Get folder by ID
     * @param userId the user ID
     * @param folderId the folder ID
     * @return the folder response
     */
    FolderResponse getFolderById(Long userId, Long folderId);

    /**
     * Get all folders for user
     * @param userId the user ID
     * @return list of folder responses
     */
    List<FolderResponse> getAllFolders(Long userId);

    /**
     * Get root folders (folders without parent)
     * @param userId the user ID
     * @return list of root folder responses
     */
    List<FolderResponse> getRootFolders(Long userId);

    /**
     * Get subfolders of a folder
     * @param userId the user ID
     * @param parentFolderId the parent folder ID
     * @return list of subfolder responses
     */
    List<FolderResponse> getSubFolders(Long userId, Long parentFolderId);

    /**
     * Update folder
     * @param userId the user ID
     * @param folderId the folder ID
     * @param request the update folder request
     * @return the updated folder response
     */
    FolderResponse updateFolder(Long userId, Long folderId, UpdateFolderRequest request);

    /**
     * Delete folder
     * @param userId the user ID
     * @param folderId the folder ID
     */
    void deleteFolder(Long userId, Long folderId);

    /**
     * Move folder to new parent
     * @param userId the user ID
     * @param folderId the folder ID to move
     * @param newParentFolderId the new parent folder ID (null for root)
     * @return the updated folder response
     */
    FolderResponse moveFolder(Long userId, Long folderId, Long newParentFolderId);

    /**
     * Convert Folder entity to FolderResponse DTO
     * @param folder the folder entity
     * @return the folder response DTO
     */
    FolderResponse convertToResponse(Folder folder);

    /**
     * Convert Folder entity to FolderResponse DTO with subfolders
     * @param folder the folder entity
     * @param includeSubFolders whether to include subfolders
     * @return the folder response DTO
     */
    FolderResponse convertToResponse(Folder folder, boolean includeSubFolders);
}
