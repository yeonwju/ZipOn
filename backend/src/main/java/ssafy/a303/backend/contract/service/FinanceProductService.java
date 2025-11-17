package ssafy.a303.backend.contract.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.a303.backend.common.finance.SSAFYAPI;
import ssafy.a303.backend.common.finance.SSAFYHeaderDTO;
import ssafy.a303.backend.common.finance.SSAFYHeaderDTOHelper;
import ssafy.a303.backend.contract.entity.FinanceProduct;
import ssafy.a303.backend.contract.repository.FinanceProductRepository;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinanceProductService {

    private final SSAFYAPI ssafyAPI;
    private final SSAFYHeaderDTOHelper ssafyHeaderDTOHelper;
    private final FinanceProductRepository financeProductRepository;

    @Transactional
    public FinanceProduct createDemandDepositProduct(
            String bankCode,
            String accountName,
            String accountDescription
    ) {

        // 1. SSAFY Header 생성
        SSAFYHeaderDTO headerDto = ssafyHeaderDTOHelper.buildHeader(
                "createDemandDeposit",
                null   // userKey 없음
        );

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put("apiName", headerDto.getApiName());
        headerMap.put("transmissionDate", headerDto.getTransmissionDate());
        headerMap.put("transmissionTime", headerDto.getTransmissionTime());
        headerMap.put("institutionCode", headerDto.getInstitutionCode());
        headerMap.put("fintechAppNo", headerDto.getFintechAppNo());
        headerMap.put("apiServiceCode", headerDto.getApiServiceCode());
        headerMap.put("institutionTransactionUniqueNo", headerDto.getInstitutionTransactionUniqueNo());
        headerMap.put("apiKey", headerDto.getApiKey());

        // 2. SSAFY API로 보낼 body 구성
        Map<String, Object> body = new HashMap<>();
        body.put("Header", headerMap);
        body.put("bankCode", bankCode);
        body.put("accountName", accountName);
        body.put("accountDescription", accountDescription);

        // 3. SSAFY OpenAPI 호출
        Map<String, Object> response = ssafyAPI.post(
                "/edu/demandDeposit/createDemandDeposit",
                null,
                body
        );

        // 4. 응답 Header 확인
        @SuppressWarnings("unchecked")
        Map<String, Object> resHeader = (Map<String, Object>) response.get("Header");
        if (resHeader == null) {
            throw new IllegalStateException("SSAFY 상품 등록 응답에 Header가 없습니다: " + response);
        }

        String responseCode = (String) resHeader.get("responseCode");
        String responseMessage = (String) resHeader.get("responseMessage");

        if (!"H0000".equals(responseCode)) {
            throw new IllegalStateException("SSAFY 상품 등록 실패: " + responseCode + " - " + responseMessage);
        }

        // 5. REC 파싱 (상품 정보)
        @SuppressWarnings("unchecked")
        Map<String, Object> rec = (Map<String, Object>) response.get("REC");
        if (rec == null) {
            throw new IllegalStateException("SSAFY 상품 등록 응답에 REC가 없습니다: " + response);
        }

        String accountTypeUniqueNo = (String) rec.get("accountTypeUniqueNo");
        String bankName = (String) rec.get("bankName");
        String accountTypeName = (String) rec.get("accountTypeName");

        if (accountTypeUniqueNo == null) {
            throw new IllegalStateException("상품 등록 성공했지만 accountTypeUniqueNo가 없습니다: " + rec);
        }

        // 6. DB에 FinanceProduct로 저장
        FinanceProduct product = FinanceProduct.builder()
                .bankCode(bankCode)
                .bankName(bankName)
                .accountTypeUniqueNo(accountTypeUniqueNo)
                .accountTypeName(accountTypeName)
                .accountName(accountName)
                .accountDescription(accountDescription)
                .build();

        return financeProductRepository.save(product);
    }

}
