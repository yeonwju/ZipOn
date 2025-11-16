package ssafy.a303.backend.common.finance;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Slf4j
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
        if (header != null) request.put("header", header); /** Header로 고침 */
        if (body != null) request.putAll(body);

        log.info("[SSAFY-FINANCE] {} {} body={}", method, path, request);

        return client.method(method)
                .uri(path)
                .bodyValue(request)
                .exchangeToMono(resp -> resp.bodyToMono(String.class)
                        .doOnNext(bodyStr -> {
                            log.info("[SSAFY-RES-BODY] {}", bodyStr);
                        })
                        .map(bodyStr -> {
                            try {
                                // JSON을 Map 으로 변환
                                ObjectMapper om = new ObjectMapper();
                                return om.readValue(bodyStr, new TypeReference<Map<String, Object>>() {});
                            } catch (Exception e) {
                                log.error("[SSAFY-RES-PARSE-ERROR] bodyStr={}", bodyStr, e);
                                return Map.<String, Object>of("raw", bodyStr);
                            }
                        })
                )
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
