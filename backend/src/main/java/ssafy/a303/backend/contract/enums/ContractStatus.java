package ssafy.a303.backend.contract.enums;

public enum ContractStatus {
    WAITING_FIRST_RENT, // 가상계좌 생성
    WAITING_AI_REVIEW, // 입금 확인 후 계약서 검증 대기
    WAITING_LANDLORD_ACCEPT, // 임대인 최종 수락
    COMPLETED, // 계약 완료
    CANCELED, // 계약 취소
    EXPIRED // 기한 만료
}
