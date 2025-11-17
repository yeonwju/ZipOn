package ssafy.a303.backend.notice.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ssafy.a303.backend.notice.entity.NotificationHistory;

import java.util.Optional;

public interface NotificationHistoryRepository extends JpaRepository<NotificationHistory, Long> {

    @Query("""
        select h
        from NotificationHistory h
        where h.user.userSeq = :userSeq
          and (:cursor is null or h.historySeq < :cursor)
        order by h.historySeq desc
    """)
    Slice<NotificationHistory> findSlice(
            @Param("userSeq") int userSeq,
            @Param("cursor") Long cursor,
            Pageable pageable
    );

    Optional<NotificationHistory> findByHistorySeqAndUser_UserSeq(Long historySeq, int userSeq);
}
