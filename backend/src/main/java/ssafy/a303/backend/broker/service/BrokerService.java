package ssafy.a303.backend.broker.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.broker.entity.Broker;
import ssafy.a303.backend.broker.entity.Company;
import ssafy.a303.backend.broker.repository.BrokerRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class BrokerService {

    private final CompanyService companyService;
    private final BrokerRepository brokerRepository;
    private final UserRepository userRepository;

    @Transactional
    public void regist(int userSeq, String taxSeq) {
        // 사업체 확인
        Company company = companyService.checkCompany(taxSeq);
        if (!company.getStatus()) throw new CustomException(ErrorCode.INVALID_TAX_SEQ);

        User userRef = userRepository.getReferenceById(userSeq);
        if(userRef.getName() == null) throw new CustomException(ErrorCode.USER_NOT_AUTHENTICATED);

        Broker broker = Broker.builder()
                .company(company)
                .user(userRef)
                .cncldCnt(0)
                .mediateCnt(0)
                .build();
        brokerRepository.save(broker);
    }

}
