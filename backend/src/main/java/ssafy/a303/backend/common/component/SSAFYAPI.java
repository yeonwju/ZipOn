package ssafy.a303.backend.common.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class SSAFYAPI {

    private final RestClient client;
    SSAFYAPI(@Value("${ssafyApiUrl}") String baseUrl) {
        this.client = RestClient
                .builder()
                .baseUrl(baseUrl)
                .build();
    }
    public <R> R get(String path, Class<R> responseType) {
        return client.get()
                .uri(path)
                .retrieve()
                .body(responseType);
    }

    public <B, R> R post(String path, B body, Class<R> responseType) {
        return client.post()
                .uri(path)
                .body(body)
                .retrieve()
                .body(responseType);
    }

    public void delete(String path) {
        client.delete()
                .uri(path)
                .retrieve()
                .toBodilessEntity();
    }

    public <B, R> R patch(String path, B body, Class<R> responseType) {
        return client.patch()
                .uri(path)
                .body(body)
                .retrieve()
                .body(responseType);
    }
}
