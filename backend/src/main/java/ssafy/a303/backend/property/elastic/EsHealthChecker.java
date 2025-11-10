package ssafy.a303.backend.property.elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EsHealthChecker implements CommandLineRunner {

    private final ElasticsearchClient es;

    @Override
    public void run(String... args) throws Exception {
        // ES 서버의 기본 정보 반환
        var info = es.info();

        System.out.println("===============================================");
        System.out.println("✅ Elasticsearch 연결 성공!");
        System.out.println("📦 Cluster Name : " + info.clusterName());
        System.out.println("🧩 Node Name    : " + info.name());
        System.out.println("🔢 Version      : " + info.version().number());
        System.out.println("===============================================");
    }
}
