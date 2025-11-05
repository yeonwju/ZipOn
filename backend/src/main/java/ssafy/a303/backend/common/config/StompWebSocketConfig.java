package ssafy.a303.backend.common.config;

import lombok.RequiredArgsConstructor;
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

    /**
     * [1] WebSocket 엔드포인트 설정
     * - 클라이언트가 최초로 접속할 엔드포인트 (Socket 연결 주소)
     * - 예: ws://localhost:8080/chat 또는 ws://localhost:8080/live
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat", "/live")
                .setAllowedOriginPatterns("*") // 배포 시 도메인만 허용
                .withSockJS(); // SockJS fallback 허용 (HTTP로 대체 연결)
    }

    /**
     * [2] STOMP 메시지 라우팅 규칙
     * - 클라이언트 → 서버 전송: /pub/**  (Controller @MessageMapping)
     * - 서버 → 클라이언트 구독: /sub/** (브로커 자동 전송)
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /pub/1 형태로 메시지 발행해야 함을 설정
        registry.setApplicationDestinationPrefixes("/pub");

        // /sub/1 형태로 메시지를 수신(subscribe)해야 함을 설정
        registry.enableSimpleBroker("/sub"); // /sub/chat/1, /sub/live/2 등
    }

    /**
     * [3] 클라이언트 요청 가로채기
     * - 소켓 요청(connect, subscribe, disconnect)등의 요청시에는 http header등 http 메시지를 넣어올 수 있고
     * - 이를 interceptor를 통해 가로채 토큰등을 검증할 수 있음
     * - JWT 검증 및 채팅방 접근권한 확인을 위해 StompHandler 인터셉터 등록
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }
}

