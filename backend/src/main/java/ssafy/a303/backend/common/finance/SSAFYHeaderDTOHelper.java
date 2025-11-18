package ssafy.a303.backend.common.finance;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.common.helper.KoreaClock;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * SSAFY OpenAPI 공통 헤더 유틸리티
 * - 날짜/시간/고유번호 생성
 * - Header DTO 생성
 */
@Component
public class SSAFYHeaderDTOHelper {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HHmmss");

    @Value("${ssafy.api.key}")
    private final String apiKey;

    public SSAFYHeaderDTOHelper(@Value("${ssafy.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * SSAFY OpenAPI Header 생성
     * @param apiName API 이름 (예: createDemandDeposit)
     * @param userKey 사용자 키 (선택, 없는 경우 null)
     * @return SSAFY OpenAPI Header DTO
     */
    public SSAFYHeaderDTO buildHeader(String apiName, String userKey) {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());
        String date = now.format(DATE_FORMAT);
        String time = now.format(TIME_FORMAT);
        String uniqueNo = date + time + String.format("%06d", new Random().nextInt(999999));

        return SSAFYHeaderDTO.builder()
                .apiName(apiName)
                .transmissionDate(date)
                .transmissionTime(time)
                .institutionCode("00100") // 고정
                .fintechAppNo("001") // 고정
                .apiServiceCode(apiName)
                .institutionTransactionUniqueNo(uniqueNo)
                .apiKey(apiKey)
                .userKey(userKey) // 필요 없는 API라면 null
                .build();
    }
}
