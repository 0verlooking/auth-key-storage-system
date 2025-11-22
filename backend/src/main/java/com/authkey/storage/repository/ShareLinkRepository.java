package com.authkey.storage.repository;

import com.authkey.storage.entity.ShareLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ShareLink entity
 */
@Repository
public interface ShareLinkRepository extends JpaRepository<ShareLink, Long> {

    Optional<ShareLink> findByShareToken(String shareToken);

    List<ShareLink> findByAuthKeyIdAndIsDeletedFalse(Long authKeyId);

    List<ShareLink> findByAuthKeyUserIdAndIsDeletedFalse(Long userId);

    List<ShareLink> findByAuthKeyId(Long authKeyId);

    List<ShareLink> findByAuthKeyUserId(Long userId);
}
