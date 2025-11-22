package com.authkey.storage.repository;

import com.authkey.storage.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Tag entity
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByUserIdAndIsDeletedFalse(Long userId);

    Optional<Tag> findByIdAndUserIdAndIsDeletedFalse(Long id, Long userId);

    Optional<Tag> findByUserIdAndNameAndIsDeletedFalse(Long userId, String name);

    List<Tag> findByUserId(Long userId);

    Optional<Tag> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndName(Long userId, String name);
}
