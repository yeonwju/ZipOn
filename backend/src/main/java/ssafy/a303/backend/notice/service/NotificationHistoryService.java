package ssafy.a303.backend.notice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.notice.dto.response.NotificationResponse;
import ssafy.a303.backend.notice.entity.NotificationHistory;
import ssafy.a303.backend.notice.repository.NotificationHistoryRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationHistoryService {

    private final NotificationHistoryRepository historyRepository;

    /**
     * 내 알림함 조회
     */
    public Slice<NotificationResponse> getMyNotifications(int userSeq, Long cursor, int size) {

        Slice<NotificationHistory> slice = historyRepository.findSlice(
                userSeq,
                cursor,
                PageRequest.of(0, size)
        );

        return slice.map(this::toDto);
    }

    private NotificationResponse toDto(NotificationHistory h) {
        return NotificationResponse.builder()
                .historySeq(h.getHistorySeq())
                .type(h.getType())
                .title(h.getTitle())
                .content(h.getContent())
                .targetType(h.getTargetType())
                .targetId(h.getTargetId())
                .linkUrl(h.getLinkUrl())
                .read(h.isRead())
                .createdAt(h.getCreatedAt())
                .build();
    }

    public void markAsRead(int userSeq, Long historySeq) {

        NotificationHistory history = historyRepository
                .findByHistorySeqAndUser_UserSeq(historySeq, userSeq)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));

        if (!history.isRead()) {
            history.setRead(true);
            history.setReadAt(LocalDateTime.now());
        }
    }
}
