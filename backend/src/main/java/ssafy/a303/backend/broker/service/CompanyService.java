package ssafy.a303.backend.broker.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ssafy.a303.backend.broker.dto.request.CompanyStatusRequest;
import ssafy.a303.backend.broker.dto.response.CompanyStatusResponse;

import java.util.List;

@Service
public class CompanyService {
    private final WebClient webClient;
    private final String serviceKey;

    public CompanyService(
            @Qualifier("govWebClient") WebClient webClient,
            @Value("${gov.api.key}") String serviceKey
    ) {
        this.webClient = webClient;   // 재사용 가능(스레드 세이프)
        this.serviceKey = serviceKey;
    }

    public boolean validateCompany(String bNo, String startDate, String ownerName) {
        CompanyStatusRequest.Business company = new CompanyStatusRequest.Business(bNo, startDate, ownerName);
        CompanyStatusRequest request = new CompanyStatusRequest(List.of(company));
        CompanyStatusResponse response = webClient.post()
                .uri(uri -> uri.path("/validate")
                        .queryParam("serviceKey", serviceKey)
                        .build())
                .bodyValue(request)
                .retrieve()
                .bodyToMono(CompanyStatusResponse.class)
                .block();
        return response != null && response.isValid();
    }
}
