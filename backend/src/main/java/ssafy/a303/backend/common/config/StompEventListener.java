package ssafy.a303.backend.common.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * STOMP 세션 이벤트 리스너
 * ------------------------------------------------
 * - WebSocket 연결 및 해제 이벤트를 실시간으로 추적
 * - 디버깅 및 모니터링 목적 (운영 로그)
 */
@Component
@Log4j2
public class StompEventListener {

    private final Set<String> sessions = ConcurrentHashMap.newKeySet();

    @EventListener
    public void onConnect(SessionConnectEvent event) {
        String sessionId = event.getMessage().getHeaders().get("simpSessionId").toString();
        sessions.add(sessionId);
        log.info("🔵 WebSocket 연결됨: {} (현재 세션 수: {})", sessionId, sessions.size());
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        sessions.remove(sessionId);
        log.info("🔴 WebSocket 연결 해제: {} (남은 세션 수: {})", sessionId, sessions.size());
    }
}