package com.authkey.storage.repository;

import com.authkey.storage.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for AuditLog entity
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

    List<AuditLog> findByUserIdAndTimestampBetweenOrderByTimestampDesc(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<AuditLog> findByUserIdAndActionOrderByTimestampDesc(Long userId, String action);

    Page<AuditLog> findByUserId(Long userId, Pageable pageable);

    Page<AuditLog> findByUserIdAndAction(Long userId, String action, Pageable pageable);

    Page<AuditLog> findByUserIdAndResourceTypeAndResourceId(Long userId, String resourceType, Long resourceId, Pageable pageable);
}
