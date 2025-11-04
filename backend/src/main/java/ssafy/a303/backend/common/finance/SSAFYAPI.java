package ssafy.a303.backend.common.finance;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Component
public class SSAFYAPI {

    private final WebClient client;

    SSAFYAPI(@Value("${ssafy.api.url}") String baseUrl) {
        this.client = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    private Map<String, Object> send(
            HttpMethod method, String path,
            Map<String, Object> header,
            Map<String, Object> body
    ) {
        Map<String, Object> request = new HashMap<>();
        if (header != null) request.put("header", header);
        if (body != null) request.putAll(body);

        return client.method(method)
                .uri(path)
                .bodyValue(request)
                .exchangeToMono(resp -> resp.bodyToMono(new ParameterizedTypeReference<Map<String, Object>>(){}))
                .block();
    }


    public Map<String, Object> get(String path, Map<String, Object> header) {
        return send(HttpMethod.GET, path, header, null);
    }

    public Map<String, Object> post(String path, Map<String, Object> header, Map<String, Object> body) {
        return send(HttpMethod.POST, path, header, body);
    }

    public Map<String, Object> patch(String path, Map<String, Object> header, Map<String, Object> body) {
        return send(HttpMethod.PATCH, path, header, body);
    }

    public Map<String, Object> delete(String path, Map<String, Object> header) {
        return send(HttpMethod.DELETE, path, header, null);
    }

}
