package ssafy.a303.backend.property.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.transform.ElasticsearchTransformAsyncClient;
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

    @Bean
    public ElasticsearchClient esClient(@Value("${elasticsearch.uris:https://localhost:9200}") String uris) {
        //yml 파일의 elasticsearch uris 값 불러오기

        /**
         * 저수준 client
         * ES 서버와 실제 HTTP 통신을 담당하는 기본 객체
         */
        RestClient low = RestClient
                .builder(HttpHost.create(uris))
                .build();

        /**
         * 전송 계층
         * restclient 위에 json 직렬화 기능을 입힌 중간 계층
         */
        ElasticsearchTransport transport = new RestClientTransport(low, new JacksonJsonpMapper());

        /**
         * Elasticsearch Java API Client의 핵심 클래스
         * 실제로 사용하는 고수준 api 클라이언트
         */
        return new ElasticsearchClient(transport);


    }
}
