package ssafy.a303.backend.notice.entity;

public enum ReservationStatus {
    PENDING,   // 발송 대기
    SENT,      // 성공적으로 발송
    CANCELED,  // 알림받기 취소
    EXPIRED    // 만료
}
