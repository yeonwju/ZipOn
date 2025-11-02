package ssafy.a303.backend.broker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class BrokerConfig {

    @Value("${gov.api.url}")
    private String url;

    @Bean(name = "govWebClient")
    public WebClient govWebClient() {
        return WebClient.builder()
                .baseUrl(url)
                .build();
    }
}
