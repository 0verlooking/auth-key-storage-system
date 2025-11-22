package com.authkey.storage.repository;

import com.authkey.storage.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Folder entity
 */
@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findByUserIdAndIsDeletedFalse(Long userId);

    List<Folder> findByUserIdAndParentFolderIsNullAndIsDeletedFalse(Long userId);

    List<Folder> findByUserIdAndParentFolderIdAndIsDeletedFalse(Long userId, Long parentFolderId);

    Optional<Folder> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    List<Folder> findByUserId(Long userId);

    Optional<Folder> findByIdAndUserId(Long id, Long userId);

    List<Folder> findByUserIdAndParentFolderIsNull(Long userId);

    List<Folder> findByUserIdAndParentFolderId(Long userId, Long parentFolderId);
}
