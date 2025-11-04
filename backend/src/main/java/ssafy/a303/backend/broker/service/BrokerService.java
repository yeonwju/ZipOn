package ssafy.a303.backend.broker.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.broker.entity.Broker;
import ssafy.a303.backend.broker.entity.Company;
import ssafy.a303.backend.broker.repository.BrokerRepository;
import ssafy.a303.backend.broker.repository.CompanyRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BrokerService {

    private final CompanyService companyService;
    private final BrokerRepository brokerRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean regist(int userSeq, String taxSeq) {
        Company company = companyService.checkCompany(taxSeq); // 사업체 확인 또는 등록
        if(!company.getStatus()) throw new CustomException(ErrorCode.INVALID_TAX_SEQ);
        User userRef = userRepository.getReferenceById(userSeq);

        // S3 key 발급 받으면 저장할 예정
        String s3Path = String.format("license/%d", userSeq);
        if(!saveLicensePdf()) throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);

        Broker broker = Broker.builder()
                .company(company)
                .user(userRef)
                .license(s3Path)
                .cncldCnt(0)
                .mediateCnt(0)
                .build();
        brokerRepository.save(broker);
        return true;
    }

    public boolean saveLicensePdf(){
        return true;
    }

}
