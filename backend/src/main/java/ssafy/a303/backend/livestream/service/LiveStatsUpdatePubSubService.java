package ssafy.a303.backend.livestream.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.livestream.dto.response.LiveStatsUpdateDto;

/**
 * 라이브 통계 업데이트 전용 Redis Pub/Sub 서비스
 * - 라이브 목록 화면에서 실시간 통계 업데이트를 받기 위한 서비스
 * - 채널: live:stats:updates
 */
@Service
@Log4j2
public class LiveStatsUpdatePubSubService implements MessageListener {

    private final StringRedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ObjectMapper objectMapper;

    public LiveStatsUpdatePubSubService(
            @Qualifier("liveRedisTemplate") StringRedisTemplate redisTemplate,
            SimpMessageSendingOperations messagingTemplate
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
        
        // ObjectMapper에 JavaTimeModule 등록
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Redis에 통계 업데이트 발행
     */
    public void publish(String channel, String message) {
        redisTemplate.convertAndSend(channel, message);
    }

    /**
     * Redis에서 통계 업데이트 수신 → STOMP 브로드캐스트
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // 메시지 파싱
            String payload = new String(message.getBody());
            LiveStatsUpdateDto dto = objectMapper.readValue(payload, LiveStatsUpdateDto.class);
            
            // STOMP 브로드캐스트: /sub/live/stats/updates
            messagingTemplate.convertAndSend("/sub/live/stats/updates", dto);
            
            log.info("[REDIS][LIVE_STATS] 통계 업데이트 브로드캐스트 → liveSeq={}, type={}, viewers={}, chats={}, likes={}",
                    dto.getLiveSeq(), dto.getUpdateType(), dto.getViewerCount(), dto.getChatCount(), dto.getLikeCount());
        } catch (JsonProcessingException e) {
            log.error("[REDIS][LIVE_STATS] JSON 파싱 실패: {}", e.getMessage());
        } catch (Exception e) {
            log.error("[REDIS][LIVE_STATS] 통계 업데이트 처리 실패: {}", e.getMessage(), e);
        }
    }
}

