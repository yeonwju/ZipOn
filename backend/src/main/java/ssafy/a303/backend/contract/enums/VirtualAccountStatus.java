package ssafy.a303.backend.contract.enums;

public enum VirtualAccountStatus {
    ACTIVE, // 입금 대기
    PAID,   // 목표 금액 임금됨
    CLOSED, // 송금 완료 후 계좌 닫힘
    EXPIRED // 기간 만료
}
