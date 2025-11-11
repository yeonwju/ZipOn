package ssafy.a303.backend.common.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ssafy.a303.backend.livestream.dto.response.LiveStatsUpdateDto;
import ssafy.a303.backend.livestream.service.LiveService;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * STOMP 세션 이벤트 리스너
 * ------------------------------------------------
 * - WebSocket 연결 및 해제 이벤트를 실시간으로 추적
 * - 라이브 방송 퇴장 시 자동으로 시청자 수 감소 처리
 */
@Component
@Log4j2
public class StompEventListener {

    private final Set<String> sessions = ConcurrentHashMap.newKeySet();
    // 세션 ID → (userSeq, liveSeq) 매핑 저장
    private final Map<String, UserLiveInfo> sessionToLiveMap = new ConcurrentHashMap<>();
    
    private final LiveService liveService;
    private final RedisTemplate<Object, Object> redisTemplate;
    
    // 생성자 주입 (@Lazy로 순환 참조 해결)
    public StompEventListener(@Lazy LiveService liveService, 
                              RedisTemplate<Object, Object> redisTemplate) {
        this.liveService = liveService;
        this.redisTemplate = redisTemplate;
    }

    @EventListener
    public void onConnect(SessionConnectEvent event) {
        String sessionId = event.getMessage().getHeaders().get("simpSessionId").toString();
        sessions.add(sessionId);
        
        // STOMP 헤더에서 정보 추출 (필요 시)
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        
        log.info("🔵 WebSocket 연결됨: {} (현재 세션 수: {})", sessionId, sessions.size());
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        sessions.remove(sessionId);
        
        // ⭐ 라이브 방송 시청 중이었던 사용자라면 자동 퇴장 처리
        UserLiveInfo info = sessionToLiveMap.remove(sessionId);
        if (info != null) {
            try {
                // Redis에서 시청자 제거
                String viewerKey = "live:viewers:" + info.liveSeq;
                redisTemplate.opsForSet().remove(viewerKey, info.userSeq);
                
                // 라이브 목록 통계 업데이트 발행
                liveService.publishLiveStatsUpdate(info.liveSeq, LiveStatsUpdateDto.UpdateType.VIEWER);
                
                log.info("🔴 라이브 시청자 자동 퇴장: liveSeq={}, userSeq={}", info.liveSeq, info.userSeq);
            } catch (Exception e) {
                log.error("🔴 자동 퇴장 처리 실패: {}", e.getMessage(), e);
            }
        }
        
        log.info("🔴 WebSocket 연결 해제: {} (남은 세션 수: {})", sessionId, sessions.size());
    }
    
    /**
     * 사용자가 라이브 방송에 입장했을 때 호출
     * (LiveService.startLiveToken()에서 호출)
     */
    public void registerLiveViewer(String sessionId, Integer userSeq, Integer liveSeq) {
        sessionToLiveMap.put(sessionId, new UserLiveInfo(userSeq, liveSeq));
        log.info("📝 라이브 시청자 등록: sessionId={}, userSeq={}, liveSeq={}", sessionId, userSeq, liveSeq);
    }
    
    /**
     * 사용자 라이브 정보 저장용 내부 클래스
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