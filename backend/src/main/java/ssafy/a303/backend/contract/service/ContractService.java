package ssafy.a303.backend.contract.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.id.IntegralDataTypeHolder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.finance.SSAFYAPI;
import ssafy.a303.backend.common.finance.SSAFYHeaderDTO;
import ssafy.a303.backend.common.finance.SSAFYHeaderDTOHelper;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.contract.dto.response.CreateVirtualAccountResponseDto;
import ssafy.a303.backend.contract.entity.Contract;
import ssafy.a303.backend.contract.entity.VirtualAccount;
import ssafy.a303.backend.contract.enums.VirtualAccountStatus;
import ssafy.a303.backend.contract.repository.ContractRepository;
import ssafy.a303.backend.contract.repository.VirtualAccountRepository;

import java.util.HashMap;
import java.util.Map;

@Value("${ssafy.api.account-type-unique-no}")
private String accountTypeUniqueNo;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final VirtualAccountRepository virtualAccountRepository;
    private final SSAFYAPI ssafyapi;

    public CreateVirtualAccountResponseDto startContractAndCreateVA(Integer contractSeq, String userKey) {

        /** 1. 계약 조회 */
        Contract contract = contractRepository.findById(contractSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND));

        /** 2. SSAFY Header DTO 생성 */
        SSAFYHeaderDTO headerDto = SSAFYHeaderDTOHelper.buildHeader(
                "createDemandDepositAccount",
                userKey
        );

//        /** 3. HeaderDTO -> Map<String, Object> 변환 */
//        Map<String, Object> headerMap = new HashMap<>();
//        headerMap.put("apiName", headerDto.getApiName());
//        headerMap.put("transmissionDate", headerDto.getTransmissionDate());
//        headerMap.put("transmissionTime", headerDto.getTransmissionTime());
//        headerMap.put("institutionCode", headerDto.getInstitutionCode());
//        headerMap.put("fintechAppNo", headerDto.getFintechAppNo());
//        headerMap.put("apiServiceCode", headerDto.getApiServiceCode());
//        headerMap.put("institutionTransactionUniqueNo", headerDto.getInstitutionTransactionUniqueNo());
//        headerMap.put("apiKey", headerDto.getApiKey());
//        headerMap.put("userKey", headerDto.getUserKey());

        /** 3. SSAFYAPI에 보낼 body 구성 */
        Map<String, Object> body = new HashMap<>();
        body.put("Header", headerDto);
        body.put("accountTypeUniqueNo", accountTypeUniqueNo);

        /** 4. SSAFY OpenAPI 호출 */
        Map<String, Object> response = ssafyapi.post(
                "/demandDeposit/createDemandDepositAccount",
                null,
                body
        );

        /** 5. 응답 파싱 */
        Map<String, Object> rec = (Map<String, Object>) response.get("REC");
        if (rec == null) {
            throw new CustomException(ErrorCode.REC_ERROR, "SSAFY 계좌 생성 응답에 REC 필드가 없습니다: " + response);
        }

        String bankCode = (String) rec.get("bankCode");
        String accountNo = (String) rec.get("accountNo");

        if(accountNo == null) {
            throw new CustomException(ErrorCode.SSAFY_RESPONSE_ERROR, "SSAFY 계좌 생성 응답에 accountNo가 없습니다: " + response);
        }

        /** 6. 가상계좌 엔티티 저장 */
        VirtualAccount virtualAccount = VirtualAccount.builder()
                .contractSeq(contractSeq)
                .accountNo(accountNo)
                .bankNm("ZIPON_OFFICIAL_BANK")
                .targetAmount(contract.getAucMnRent())
                .currentAmount(0)
                .status(VirtualAccountStatus.ACTIVE)
                .expiredAt(null)
                .build();


    }

}
