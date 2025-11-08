package ssafy.a303.backend.search.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EsConfig {

    @Value("${elasticsearch.host:localhost}")
    private String host;

    @Value("${elasticsearch.port:9200}")
    private int port;

    /** Low-Level REST Client (http 커넥션 관리)*/
    @Bean
    public RestClient restClient() {
        // low-level REST client (기본 http 통신)
        return RestClient.builder(new HttpHost(host, port, "http")).build();
    }

    /** High-Level ES Java API Client
     * JSON 직렬화/역직렬화
     * @param restClient
     * @return
     */
    @Bean
    public ElasticsearchClient elasticsearchClient(RestClient restClient) {
        // Transport 계층 설정
        ElasticsearchTransport transport =
                new RestClientTransport(restClient, new JacksonJsonpMapper());

        // Elasticsearch 고수준 Java API Client 생성
        return new ElasticsearchClient(transport);
    }
}
