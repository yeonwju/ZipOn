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
import ssafy.a303.backend.livestream.dto.response.LiveStartNotificationDto;

/**
 * 새 라이브 방송 시작 알림 전용 Redis Pub/Sub 서비스
 * - 라이브 목록 화면에서 새 방송을 실시간으로 추가하기 위한 서비스
 * - 채널: live:new:broadcast
 */
@Service
@Log4j2
public class LiveStartNotificationPubSubService implements MessageListener {

    private final StringRedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ObjectMapper objectMapper;

    public LiveStartNotificationPubSubService(
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
     * Redis에 새 방송 알림 발행
     */
    public void publish(String channel, String message) {
        redisTemplate.convertAndSend(channel, message);
    }

    /**
     * Redis에서 새 방송 알림 수신 → STOMP 브로드캐스트
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // 메시지 파싱
            String payload = new String(message.getBody());
            LiveStartNotificationDto dto = objectMapper.readValue(payload, LiveStartNotificationDto.class);
            
            // STOMP 브로드캐스트: /sub/live/new/broadcast
            messagingTemplate.convertAndSend("/sub/live/new/broadcast", dto);
            
            log.info("[REDIS][LIVE_NEW] 새 방송 알림 브로드캐스트 → liveSeq={}, title={}",
                    dto.getLiveSeq(), dto.getTitle());
        } catch (JsonProcessingException e) {
            log.error("[REDIS][LIVE_NEW] JSON 파싱 실패: {}", e.getMessage());
        } catch (Exception e) {
            log.error("[REDIS][LIVE_NEW] 새 방송 알림 처리 실패: {}", e.getMessage(), e);
        }
    }
}

