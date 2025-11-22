package com.authkey.storage.repository;

import com.authkey.storage.entity.AuthKey;
import com.authkey.storage.enums.AuthKeyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for AuthKey entity
 */
@Repository
public interface AuthKeyRepository extends JpaRepository<AuthKey, Long> {

    List<AuthKey> findByUserIdAndIsDeletedFalse(Long userId);

    List<AuthKey> findByUserIdAndFolderIdAndIsDeletedFalse(Long userId, Long folderId);

    List<AuthKey> findByUserIdAndFolderIsNullAndIsDeletedFalse(Long userId);

    List<AuthKey> findByUserIdAndIsFavoriteTrueAndIsDeletedFalse(Long userId);

    List<AuthKey> findByUserIdAndKeyTypeAndIsDeletedFalse(Long userId, AuthKeyType keyType);

    @Query("SELECT ak FROM AuthKey ak JOIN ak.tags t WHERE ak.user.id = :userId AND t.id = :tagId AND ak.isDeleted = false")
    List<AuthKey> findByUserIdAndTagId(@Param("userId") Long userId, @Param("tagId") Long tagId);

    @Query("SELECT ak FROM AuthKey ak WHERE ak.user.id = :userId AND " +
           "(LOWER(ak.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(ak.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(ak.url) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(ak.username) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "ak.isDeleted = false")
    List<AuthKey> searchAuthKeys(@Param("userId") Long userId, @Param("search") String search);

    List<AuthKey> findByUserIdAndExpiresAtBeforeAndIsDeletedFalse(Long userId, LocalDateTime expiresAt);

    Optional<AuthKey> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    // Pageable methods
    @Query("SELECT ak FROM AuthKey ak WHERE ak.user.id = :userId AND ak.isDeleted = false")
    Page<AuthKey> findByUserId(@Param("userId") Long userId, Pageable pageable);

    List<AuthKey> findByUserId(Long userId);

    Optional<AuthKey> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT ak FROM AuthKey ak WHERE ak.user.id = :userId AND ak.folder.id = :folderId AND ak.isDeleted = false")
    Page<AuthKey> findByUserIdAndFolderId(@Param("userId") Long userId, @Param("folderId") Long folderId, Pageable pageable);

    @Query("SELECT ak FROM AuthKey ak WHERE ak.user.id = :userId AND ak.isFavorite = true AND ak.isDeleted = false")
    Page<AuthKey> findByUserIdAndIsFavoriteTrue(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT ak FROM AuthKey ak WHERE ak.user.id = :userId AND " +
           "(LOWER(ak.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(ak.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(ak.url) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(ak.username) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "ak.isDeleted = false")
    Page<AuthKey> searchByUserIdAndQuery(@Param("userId") Long userId, @Param("query") String query, Pageable pageable);
}
