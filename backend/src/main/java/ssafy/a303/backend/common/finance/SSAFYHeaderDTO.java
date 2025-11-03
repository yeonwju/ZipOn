package ssafy.a303.backend.common.finance;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * SSAFY OpenAPI 요청/응답 Header DTO
 * 모든 OpenAPI 호출에 공통으로 포함되는 데이터입니다.
 */
@Getter
@Setter
@Builder
public class SSAFYHeaderDTO {

    /** API 이름 (호출 API URI의 마지막 path명, 예: createDemandDeposit) */
    private String apiName;

    /** 전송일자 (YYYYMMDD) */
    private String transmissionDate;

    /** 전송시각 (HHMMSS) */
    private String transmissionTime;

    /** 기관코드 (고정: 00100) */
    private String institutionCode;

    /** 핀테크 앱 일련번호 (고정: 001) */
    private String fintechAppNo;

    /** API 서비스코드 (apiName과 동일) */
    private String apiServiceCode;

    /** 기관거래고유번호 (YYYYMMDDHHMMSS + 6자리 난수, 20자리) */
    private String institutionTransactionUniqueNo;

    /** OpenAPI API Key */
    private String apiKey;

    private String userKey;
}
