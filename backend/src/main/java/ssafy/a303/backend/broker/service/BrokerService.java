package ssafy.a303.backend.broker.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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
    public void regist(int userSeq, String taxSeq, MultipartFile licensePdf) {
        // 1) 사업체 확인
        Company company = companyService.checkCompany(taxSeq);
        if (!company.getStatus()) throw new CustomException(ErrorCode.INVALID_TAX_SEQ);

        // 2) 파일 검증
        if (licensePdf == null || licensePdf.isEmpty())
            throw new CustomException(ErrorCode.INVALID_FILE_NOTFOUND);

        // 크기 제한
        long maxBytes = 5L * 1024 * 1024;
        if (licensePdf.getSize() > maxBytes) throw new CustomException(ErrorCode.FILE_TOO_LARGE);

        User userRef = userRepository.getReferenceById(userSeq);

        // S3 key 발급 받으면 저장할 예정
        String s3Path = String.format("license/%d", userSeq);
        if (!saveLicensePdf()) throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);

        Broker broker = Broker.builder()
                .company(company)
                .user(userRef)
                .license(s3Path)
                .cncldCnt(0)
                .mediateCnt(0)
                .build();
        brokerRepository.save(broker);
    }

    public boolean saveLicensePdf() {
        return true;
    }

}
