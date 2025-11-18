package ssafy.a303.backend.contract.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.finance.SSAFYAPI;
import ssafy.a303.backend.common.finance.SSAFYHeaderDTO;
import ssafy.a303.backend.common.finance.SSAFYHeaderDTOHelper;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.contract.dto.response.CreateVirtualAccountResponseDto;
import ssafy.a303.backend.contract.entity.Contract;
import ssafy.a303.backend.contract.entity.UserAccount;
import ssafy.a303.backend.contract.entity.VirtualAccount;
import ssafy.a303.backend.contract.enums.ContractStatus;
import ssafy.a303.backend.contract.enums.VirtualAccountStatus;
import ssafy.a303.backend.contract.repository.ContractRepository;
import ssafy.a303.backend.contract.repository.UserAccountRepository;
import ssafy.a303.backend.contract.repository.VirtualAccountRepository;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContractService {

    @Value("${ssafy.api.account-type-unique-no}")
    private String accountTypeUniqueNo;

    private final ContractRepository contractRepository;
    private final VirtualAccountRepository virtualAccountRepository;
    private final UserRepository userRepository;
    private final UserAccountRepository userAccountRepository;

    private final SSAFYAPI ssafyapi;
    private final SSAFYHeaderDTOHelper ssafyHeaderDTOHelper;

    /**
     * 계약 진행 단계로 넘어감
     * 가상계좌 생성
     * @param contractSeq
     * @param userSeq
     * @return
     */
    @Transactional
    public CreateVirtualAccountResponseDto startContractAndCreateVA(Integer contractSeq, Integer userSeq) {

        // userSeq로 ssafy api의 userKey 가져오기
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String userKey = user.getFinanceKey();
        if (userKey == null || userKey.isBlank()) {
            throw new CustomException(ErrorCode.FINANCE_KEY_NOT_FOUND);
        }

        /** 1. 계약 조회 */
        Contract contract = contractRepository.findById(contractSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        /** 해당 계약의 임차인인지 확인 */
        if(!contract.getLesseeSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.ONLY_IN_CHARGE);
        }

        /** 해당 계약에 대한 가상계좌는 1개만 만들어질 수 있음.
         *  이미 가상계좌가 존재하는 지 체크
         */
        if(virtualAccountRepository.findByContractSeq(contractSeq).isPresent()) {
            throw new CustomException(ErrorCode.VIRTUAL_ACCOUNT_ALREADY_EXISTS);
        }

        /** 2. SSAFY Header DTO 생성 */
        SSAFYHeaderDTO headerDto = ssafyHeaderDTOHelper.buildHeader(
                "createDemandDepositAccount",
                userKey
        );

        /** 3. HeaderDTO -> Map<String, Object> 변환 */
        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put("apiName", headerDto.getApiName());
        headerMap.put("transmissionDate", headerDto.getTransmissionDate());
        headerMap.put("transmissionTime", headerDto.getTransmissionTime());
        headerMap.put("institutionCode", headerDto.getInstitutionCode());
        headerMap.put("fintechAppNo", headerDto.getFintechAppNo());
        headerMap.put("apiServiceCode", headerDto.getApiServiceCode());
        headerMap.put("institutionTransactionUniqueNo", headerDto.getInstitutionTransactionUniqueNo());
        headerMap.put("apiKey", headerDto.getApiKey());
        headerMap.put("userKey", headerDto.getUserKey());

        /** 3. SSAFYAPI에 보낼 body 구성 */
        Map<String, Object> body = new HashMap<>();
        body.put("Header", headerMap);
        body.put("accountTypeUniqueNo", accountTypeUniqueNo);

        /** 4. SSAFY OpenAPI 호출 */
        Map<String, Object> response = ssafyapi.post(
                "/edu/demandDeposit/createDemandDepositAccount",
                null,
                body
        );

        //디버깅
        @SuppressWarnings("unchecked")
        Map<String, Object> resHeader = (Map<String, Object>) response.get("Header");

        if (resHeader == null) {
            throw new IllegalStateException("SSAFY 응답에 Header가 없습니다: " + response);
        }

        String responseCode = (String) resHeader.get("responseCode");
        String responseMessage = (String) resHeader.get("responseMessage");

        if (!"H0000".equals(responseCode)) {
            // SSAFY가 보낸 에러 코드 그대로 보고
            throw new IllegalStateException("SSAFY 계좌 생성 실패: " + responseCode + " - " + responseMessage);
        }

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

        virtualAccountRepository.save(virtualAccount);

        /** 7. 계약 상태를 "진행중"으로 변경 */
        contract.updateStatus(ContractStatus.WAITING_FIRST_RENT);
        contractRepository.save(contract);

        /** 8. 프론트에 정보 반환 */
        return new CreateVirtualAccountResponseDto(
                bankCode,
                accountNo,
                contract.getAucMnRent()
        );
    }

    /**
     * 계좌이체
     * @param userKey 이체를 수행하는 사용자 ssafy userKey
     * @param withdrawalAccountNo 출금 계좌번호 (임차인 메인 계좌)
     * @param depositAccountNo 입금 계좌번호 (가상계좌)
     * @param amount 이체 금액 (첫달 월세)
     */
    @Transactional
    public void transferRent(String userKey, String withdrawalAccountNo, String depositAccountNo, int amount) {

        // 1. 헤더 생성
        SSAFYHeaderDTO headerDto = ssafyHeaderDTOHelper.buildHeader(
                "updateDemandDepositAccountTransfer",
                userKey
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
        headerMap.put("userKey", headerDto.getUserKey());

        // 2. 요청 Body 구성
        Map<String, Object> body = new HashMap<>();
        body.put("Header", headerMap);
        body.put("depositAccountNo", depositAccountNo);
        body.put("depositTransactionSummary", "(수시입출금) : 입금(이체)");
        body.put("transactionBalance", String.valueOf(amount));
        body.put("withdrawalAccountNo", withdrawalAccountNo);
        body.put("withdrawalTransactionSummary", "(수시입출금) : 출금(이체)");

        // 3. SSAFY API 호출
        Map<String, Object> response = ssafyapi.post(
                "/edu/demandDeposit/updateDemandDepositAccountTransfer",
                null,
                body
        );

        // 4. Header 응답 확인
        @SuppressWarnings("unchecked")
        Map<String, Object> resHeader = (Map<String, Object>) response.get("Header");
        if (resHeader == null) {
            throw new CustomException(ErrorCode.SSAFY_RESPONSE_ERROR, "SSAFY 이체 응답에 Header가 없습니다: " + response);
        }

        String responseCode = (String) resHeader.get("responseCode");
        String responseMessage = (String) resHeader.get("responseMessage");

        if (!"H0000".equals(responseCode)) {
            throw new CustomException(ErrorCode.SSAFY_RESPONSE_ERROR, "SSAFY 이체 실패: " + responseCode + " - " + responseMessage);
        }

    }

    /**
     * 첫 월세 임차인이 납부
     * @param contractSeq
     * @param userSeq
     */
    @Transactional
    public void payFirstRent(Integer contractSeq, Integer userSeq) {

        Contract contract = contractRepository.findById(contractSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        /**
         * 이미 해당 계약에 대한 첫월세를 입금했을 경우.
         */
        if(Boolean.TRUE.equals(contract.getIsFirstPaid())) {
            throw new CustomException(ErrorCode.RENT_ALREADY_PAID);
        }

        /** 해당 계약의 임차인만 월세 납부할 수 있음 */
        if (!contract.getLesseeSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.ONLY_LESSEE);
        }

        User lessee = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String userKey = lessee.getFinanceKey();
        if (userKey == null || userKey.isBlank()) {
            throw new CustomException(ErrorCode.FINANCE_KEY_NOT_FOUND);
        }

        UserAccount account = userAccountRepository.findByUserSeq(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_ACCOUNT_NOT_FOUND));

        String withdrawalAccountNo = account.getAccountNo();

        VirtualAccount va = virtualAccountRepository.findByContractSeq(contractSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND));

        String depositAccountNo = va.getAccountNo();

        /** 가상계좌 목표 금액 달성 여부 */
        int current = (va.getCurrentAmount() == null ? 0 : va.getCurrentAmount());
        int target = (va.getTargetAmount() == null ? 0 : va.getTargetAmount());

        int amount = contract.getAucMnRent();

        // targetAmount를 초과하는 납부 방지
        if (current + amount > target) {
            throw new CustomException(ErrorCode.VIRTUAL_ACCOUNT_AMOUNT_EXCEED);
        }

        transferRent(
                userKey,
                withdrawalAccountNo,
                depositAccountNo,
                amount
        );

        // 가상계좌 현재 금액 업데이트
        va.setCurrentAmount(current + amount);
        // targetAmount와 같아지면 상태 변경
        if(current + amount == target) {
            va.setStatus(VirtualAccountStatus.PAID);
            contract.setIsFirstPaid(true);
        }
    }

    /**
     * 계약 확정 되면 가상계좌에서 임대인에게 월세 전달
     */
    @Transactional
    public void acceptContractAndSettle(Integer contractSeq, Integer userSeq) {

        //1. 계약 조회
        Contract contract = contractRepository.findById(contractSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        /**
         * 이미 완료된 계약 예외처리
         */
        if(contract.getContractStatus() == ContractStatus.COMPLETED || Boolean.TRUE.equals(contract.getIsReceived())) {
            throw new CustomException(ErrorCode.CONTRACT_ALREADY_COMPLETED);
        }

        // 2. 임차인이 맞는지 확인
        if(!contract.getLesseeSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.ONLY_IN_CHARGE);
        }
        //3. 입금이 되었는지 체크
        if(contract.getIsFirstPaid() == null || !contract.getIsFirstPaid()) {
            throw new CustomException(ErrorCode.RENT_PAID_YET);
        }
        //4. 해당 계약의 가상계좌 조회 (출급 계좌)
        VirtualAccount va = virtualAccountRepository.findByContractSeq(contractSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND, "해당 계약에 연결된 가상계좌가 없습니다."));
        String withdrawalAccountNo = va.getAccountNo();
        //5. 임대인 대표 계좌 조회 (입금 계좌)
        UserAccount lessorAccount = userAccountRepository.findByUserSeq(contract.getLessorSeq())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_ACCOUNT_NOT_FOUND));

        String depositAccountNo = lessorAccount.getAccountNo();

        //6. 이체 금액 = 낙찰 월세
        int amount = contract.getAucMnRent();

        //7. 이체를 수행할 userKey (가상계좌 소유자 기준)
        Integer lesseeSeq = contract.getLesseeSeq();
        User lessee = userRepository.findById(lesseeSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String lesseeUserKey = lessee.getFinanceKey();

        // 8. 계좌 이체 API 호출
        transferRent(
                lesseeUserKey,
                withdrawalAccountNo,
                depositAccountNo,
                amount
        );

        // 9. 이체 성공 시 상태 업데이터
        va.setCurrentAmount(0);
        va.setStatus(VirtualAccountStatus.CLOSED);

        // 계약 상태 : 임대인 수령 완료 + 상태 완료
        contract.setIsReceived(true);
        contract.setContractStatus(ContractStatus.COMPLETED);

    }

}
