package ssafy.a303.backend.notice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.notice.dto.response.NotificationResponse;
import ssafy.a303.backend.notice.service.NotificationHistoryService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationHistoryController {

    private final NotificationHistoryService historyService;

    /**
     * 무한스크롤 알림 조회
     * 예시: GET /api/v1/notifications?cursor=123&size=10
     */
    @GetMapping
    public ResponseEntity<ResponseDTO<Slice<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal int userSeq,
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "10") int size
    ) {
        Slice<NotificationResponse> result =
                historyService.getMyNotifications(userSeq, cursor, size);

        return ResponseDTO.ok(result, "알림 조회 완료");
    }

    /**
     * 읽음 처리
     * 예: PATCH /api/v1/notifications/123/read
     */
    @PatchMapping("/{historySeq}/read")
    public ResponseEntity<ResponseDTO<Void>> markAsRead(
            @AuthenticationPrincipal int userSeq,
            @PathVariable Long historySeq
    ) {
        historyService.markAsRead(userSeq, historySeq);
        return ResponseDTO.ok(null, "읽음 처리 완료");
    }
}
