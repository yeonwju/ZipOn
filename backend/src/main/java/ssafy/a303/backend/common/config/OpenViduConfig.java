package ssafy.a303.backend.common.config;

import io.openvidu.java.client.OpenVidu;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**OpenVidu 서버에 접속하기 위한 연결 객체(OpenVidu)를 Bean으로 등록하는 설정 클래스*/
@Configuration
@Getter
public class OpenViduConfig {

    @Value("${openvidu.url}")
    private String openviduUrl;

    @Value("${openvidu.secret}")
    private String openviduSecret;

    @Bean
    public OpenVidu openVidu() {
        return new OpenVidu(openviduUrl, openviduSecret);
    }
}

