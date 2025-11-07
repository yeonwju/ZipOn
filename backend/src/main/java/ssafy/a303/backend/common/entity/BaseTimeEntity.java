package ssafy.a303.backend.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * BaseTimeEntity
 * ------------------------------------------------------------
 * 모든 엔티티에서 공통적으로 사용하는 생성/수정 시간 필드.
 * JPA Auditing 기능을 사용하지 않고 Hibernate Timestamp 기능을 이용.
 */
@Getter
@MappedSuperclass
public abstract class BaseTimeEntity {

    /** 생성 시각 */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 수정 시각 */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
