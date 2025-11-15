package ssafy.a303.backend.notice.dto.response;

import lombok.Builder;
import lombok.Getter;
import ssafy.a303.backend.notice.entity.NotificationTarget;
import ssafy.a303.backend.notice.entity.NotificationType;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {
    private Long historySeq;
    private NotificationType type;
    private String title;
    private String content;

    private String linkUrl;
    private NotificationTarget targetType;
    private Long targetId;

    private boolean read;
    private LocalDateTime createdAt;
}
