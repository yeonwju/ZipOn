package ssafy.a303.backend.contract.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

public class FinanceClientConfig {

    @Bean
    public WebClient FinanceWebClient(
            @Value("${ssafy.api.url}") String baseUrl
    ) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
