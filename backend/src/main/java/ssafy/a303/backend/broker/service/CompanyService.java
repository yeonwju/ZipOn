package ssafy.a303.backend.broker.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ssafy.a303.backend.broker.dto.request.CompanyStatusRequest;
import ssafy.a303.backend.broker.dto.response.BiznoResponse;
import ssafy.a303.backend.broker.dto.response.CompanyStatusResponse;
import ssafy.a303.backend.broker.entity.Company;
import ssafy.a303.backend.broker.repository.CompanyRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final WebClient gWebClient;
    private final WebClient bWebClient;
    @Value("${gov.api.key}")
    private String serviceKey;
    @Value("${bizno.key}")
    private String biznoKey;

    public CompanyService(
            CompanyRepository companyRepository,
            @Qualifier("govWebClient") WebClient gWebClient,
            @Qualifier("biznoWebClient") WebClient bWebClient
    ) {
        this.companyRepository = companyRepository;
        this.gWebClient = gWebClient;
        this.bWebClient = bWebClient;
    }

    public boolean cmpStatus(String bNo) {
        Optional<Company> opt = companyRepository.findCompanyByTaxSeq(bNo);
        ZoneId zone = ZoneId.of("Asia/Seoul");
        LocalDate today = LocalDate.now(zone);

        // 오늘 이미 검색 된 경우

        if (opt.isPresent()) {
            Company company = opt.get();
            if (company.getCheckAt().equals(today)) {
                return company.getStatus();
            }
        }

        // 검사
        CompanyStatusRequest request = new CompanyStatusRequest(List.of(bNo));
        CompanyStatusResponse response = gWebClient.post()
                .uri(uri -> uri
                        .path("/status")
                        .queryParam("serviceKey", serviceKey)
                        .build())
                .bodyValue(request)
                .retrieve()
                .bodyToMono(CompanyStatusResponse.class)
                .block();
        boolean result = response != null && response.isValid();
        if (opt.isPresent()) {
            // 갱신
            Company company = opt.get();
            company.setStatus(result);
            companyRepository.save(company);
        } else if (result) {
            // 새로 등록
            Company company = bizno(bNo);
            company.setCheckAt(today);
            companyRepository.save(company);
        }
        return result;
    }

    public Company bizno(String bNo) {
        BiznoResponse response = bWebClient.get()
                .uri(uri -> uri
                        .path("/api/fapi")
                        .queryParam("key", biznoKey)
                        .queryParam("gb", 1)
                        .queryParam("type", "json")
                        .queryParam("q", bNo)
                        .build())
                .retrieve()
                .bodyToMono(BiznoResponse.class)
                .block();

        if (response == null) throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);

        int resultCode = response.resultCode();
        switch (resultCode) {
            case 0:
                break;
            case -3:
                throw new CustomException(ErrorCode.EXTERNAL_API_LIMIT);
            default:
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);
        }
        BiznoResponse.Result item = response.items().get(0);
        return Company
                .builder()
                .name(item.company())
                .taxSeq(item.bno().replaceAll("-",""))
                .status("01".equals(item.bsttcd()))
                .build();
    }
}
