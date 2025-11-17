package ssafy.a303.backend.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * STOMP 기반 WebSocket 설정 클래스
 * ------------------------------------------------------
 * 역할:
 * - 프론트엔드와 WebSocket(STOMP) 연결 허용
 * - /pub → 메시지 발행 경로
 * - /sub → 구독 경로
 * - 클라이언트 요청 시 StompHandler로 JWT 인증 수행
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class StompWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;
    private @Value("${frontUrl}") String frontUrl;

    /**
     * [1] WebSocket 엔드포인트 등록
     * ---------------------------------------------------
     * 클라이언트(프론트)가 최초로 WebSocket 연결을 시도하는 주소를 정의한다.
     * 예:
     *    ws://localhost:8080/ws
     * SockJS:
     *    WebSocket이 막혀있는 환경(회사 네트워크 등)에서도
     *    Long-Polling 방식으로 연결 자동 대체
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                // ⚠️ 보안: 프로덕션 배포 시 반드시 실제 도메인으로 변경!
                // 개발 환경:
                .setAllowedOriginPatterns(frontUrl)
                .withSockJS(); // SockJS fallback 허용 (HTTP로 대체 연결)
    }

    /**
     * [2] STOMP 메시지 라우팅 규칙 설정
     * ---------------------------------------------------
     * 경로 체계:
     *  (1) 클라이언트 → 서버 (메시지 보낼 때)
     *      /pub/**  로 전송
     *      → @MessageMapping("...") 메서드로 라우팅됨
     *  (2) 서버 → 클라이언트 (메시지 받을 때)
     *      /sub/**  경로를 구독해야 메시지를 실시간으로 받을 수 있음
     *      → SimpleBroker가 자동으로 브로드캐스트 처리
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // 클라이언트가 메시지를 보낼 때 prefix
        // 예: client.send("/pub/chat.sendMessage", payload)
        registry.setApplicationDestinationPrefixes("/pub");

        // 서버가 메시지를 브로드캐스트 할 때 사용하는 prefix
        // 예: client.subscribe("/sub/chat/방ID")
        // 서버가 /sub 경로 구독자에게 메시지를 자동으로 push
        // 그래서 messagingTemplate.convertAndSend("/sub/...") 만 하면 실시간 전송이 되는 것
        registry.enableSimpleBroker("/sub");
    }

    /**
     * [3] STOMP 인바운드 채널 인터셉터 설정
     * ---------------------------------------------------
     * WebSocket 요청 CONNECT / SUBSCRIBE / SEND 를 서버가 처리하기 전에
     * StompHandler가 먼저 메시지를 가로채 JWT 검증 및 권한 검사를 진행한다.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }
}

