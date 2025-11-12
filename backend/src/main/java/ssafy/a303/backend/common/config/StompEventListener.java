package ssafy.a303.backend.common.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ssafy.a303.backend.livestream.service.LiveService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * STOMP 세션 이벤트 리스너
 * ------------------------------------------------
 * WebSocket(STOMP) 연결/해제 이벤트를 감지하여:
 * 1) 라이브 시청자 입장/퇴장 관리
 * 2) 시청자 수 변동 시 Redis Pub/Sub 로 실시간 갱신 신호 전송
 *
 * 즉, "누가 방송 들어왔고 나갔는지" 를 자동 처리하는 관리자 역할.
 */
@Component
@Log4j2
public class StompEventListener {

    //현재 연결된 모든 WebSocket 세션 ID 목록 (단순 연결 상태 추적)
    private final Set<String> sessions = ConcurrentHashMap.newKeySet();

     /**
      * 이 세션이 어떤 라이브 방송을 보고 있는지” 저장하는 맵
      * 세션 ID → (userSeq, liveSeq) 매핑 저장
      * sessionToLiveMap = {
      * "sessionABC" → (userSeq=10, liveSeq=77),
      * "sessionXYZ" → (userSeq=5, liveSeq=77)}*/
    private final Map<String, UserLiveInfo> sessionToLiveMap = new ConcurrentHashMap<>();
    
    private final LiveService liveService;
    private final RedisTemplate<Object, Object> redisTemplate;
    private final StringRedisTemplate liveRedisTemplate;
    
    // 생성자 주입 (@Lazy로 순환 참조 해결)
    public StompEventListener(@Lazy LiveService liveService, 
                              RedisTemplate<Object, Object> redisTemplate,
                              @Qualifier("liveRedisTemplate") StringRedisTemplate liveRedisTemplate) {
        this.liveService = liveService;
        this.redisTemplate = redisTemplate;
        this.liveRedisTemplate = liveRedisTemplate;
    }

    /**
     * WebSocket 연결이 성립되었을 때 실행되는 이벤트 리스너
     * - 세션 ID 추출 및 연결 목록에 등록
     * - STOMP 헤더 검사 가능 (추가 인증/사용자정보 연동 시 활용 가능)
     */
    @EventListener
    public void onConnect(SessionConnectEvent event) {
        String sessionId = Objects.requireNonNull(event.getMessage().getHeaders().get("simpSessionId")).toString();
        sessions.add(sessionId);
        
        // STOMP 헤더에서 정보 추출 (필요 시)
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        
        log.info("🔵 WebSocket 연결됨: {} (현재 세션 수: {})", sessionId, sessions.size());
    }

    /**
     * WebSocket 연결이 끊어졌을 때 실행되는 이벤트
     * → 브라우저 닫기, 새로고침, 네트워크 끊김 모두 감지 가능
     *
     * 여기서 중요한 역할:
     * - 해당 세션이 보고 있던 라이브 방송에서 자동 퇴장 처리
     * - Redis 에서 시청자 목록 제거
     * - 실시간 시청자 수 감소 이벤트 발생
     */
    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        sessions.remove(sessionId);
        
        // 라이브 방송 시청 중이었던 사용자라면 자동 퇴장 처리
        UserLiveInfo info = sessionToLiveMap.remove(sessionId);
        if (info != null) {
            try {
                // Redis Set 에서 시청자 제거 (live:viewers:{liveSeq})
                String viewerKey = "live:viewers:" + info.liveSeq;
                redisTemplate.opsForSet().remove(viewerKey, info.userSeq);

                // 시청자 수 변경 이벤트 전송 (라이브 방송 내부 시청자용)
                long viewerCount = java.util.Optional.ofNullable(redisTemplate.opsForSet().size(viewerKey)).orElse(0L);
                liveRedisTemplate.convertAndSend(
                        "live:" + info.liveSeq,
                        "{\"type\":\"VIEWER_COUNT_UPDATE\",\"count\":" + viewerCount + "}"
                );
                
                log.info("🔴 라이브 시청자 자동 퇴장: liveSeq={}, userSeq={}, 남은 시청자={}", info.liveSeq, info.userSeq, viewerCount);
            } catch (Exception e) {
                log.error("🔴 자동 퇴장 처리 실패: {}", e.getMessage(), e);
            }
        }
        
        log.info("🔴 WebSocket 연결 해제: {} (남은 세션 수: {})", sessionId, sessions.size());
    }

    /**
     * 사용자가 라이브 방송에 입장했을 때 호출되는 메서드
     * → LiveService.startLiveToken() 에서 명시적으로 호출됨
     *
     * 이 메서드가 호출되어야 "퇴장 감지 시 어떤 방송에서 나갔는지" 알 수 있음
     */
    public void registerLiveViewer(String sessionId, Integer userSeq, Integer liveSeq) {
        sessionToLiveMap.put(sessionId, new UserLiveInfo(userSeq, liveSeq));
        log.info("📝 라이브 시청자 등록: sessionId={}, userSeq={}, liveSeq={}", sessionId, userSeq, liveSeq);
    }

    /**
     * WebSocket 세션과 사용자 정보를 묶는 간단한 DTO 역할
     */
    private static class UserLiveInfo {
        final Integer userSeq;
        final Integer liveSeq;
        
        UserLiveInfo(Integer userSeq, Integer liveSeq) {
            this.userSeq = userSeq;
            this.liveSeq = liveSeq;
        }
    }
}