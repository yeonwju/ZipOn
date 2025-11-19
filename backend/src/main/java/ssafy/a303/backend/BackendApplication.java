package ssafy.a303.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableScheduling
@Slf4j
public class BackendApplication implements CommandLineRunner {

    @Value("${frontUrl}")
    private String frontUrl;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        log.info("🚀 FRONT_URL Loaded: {}", frontUrl);
    }
}
