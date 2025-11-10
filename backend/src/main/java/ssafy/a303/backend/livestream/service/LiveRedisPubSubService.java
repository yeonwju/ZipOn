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
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;

/**
 * LiveRedisPubSubService
 * ----------------------------------------------------------------------------------
 * Redis Pub/Sub 기반 라이브 방송 실시간 채팅 메시지 중계 서비스
 *
 * [동작 구조]
 * 1. 서버 → Redis 로 메시지 Publish (publish 메서드)
 * 2. Redis → onMessage() 콜백 실행
 * 3. 메시지를 WebSocket(STOMP) /sub/live/{liveSeq} 로 브로드캐스트
 *
 * 채팅 저장은 LiveChatService (Redis List) 에서 담당하고,
 * 본 클래스는 "실시간 메시지 전송" 역할만 담당한다.
 */
@Service
@Log4j2
public class LiveRedisPubSubService implements MessageListener {

    private final StringRedisTemplate redisTemplate;                // Redis Pub/Sub 발행용
    private final SimpMessageSendingOperations messagingTemplate;   // STOMP 메시지 전송
    private final ObjectMapper objectMapper;                        // JSON ↔ DTO 변환기

    public LiveRedisPubSubService(
            @Qualifier("liveRedisTemplate") StringRedisTemplate redisTemplate,
            SimpMessageSendingOperations messagingTemplate
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Redis Pub/Sub 채널에 메시지를 발행
     */
    public void publish(String channel, String message) {
        log.info("[REDIS][LIVE] 📤 Publishing to channel: {}, message: {}", channel, message);
        redisTemplate.convertAndSend(channel, message);
        log.info("[REDIS][LIVE] ✅ Published successfully");
    }

    /**
     * Redis → 메시지 수신 → Front로 Broadcast
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String payload = new String(message.getBody());
            log.info("[REDIS][LIVE] 📨 Received message from Redis: {}", payload);
            
            LiveChatMessageResponseDto dto = objectMapper.readValue(payload, LiveChatMessageResponseDto.class);
            
            String destination = "/sub/live/" + dto.getLiveSeq();
            log.info("[REDIS][LIVE] 📡 Broadcasting to STOMP: {} → {}", destination, dto.getContent());
            
            messagingTemplate.convertAndSend(destination, dto);
            
            log.info("[REDIS][LIVE] ✅ Broadcast complete: liveSeq={}, sender={}, content={}", 
                    dto.getLiveSeq(), dto.getSenderName(), dto.getContent());
        } catch (JsonProcessingException e) {
            log.error("[REDIS][LIVE] ❌ 메시지 역직렬화 실패: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("[REDIS][LIVE] ❌ 메시지 브로드캐스트 실패: {}", e.getMessage(), e);
        }
    }
}
