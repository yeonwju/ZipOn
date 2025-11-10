package ssafy.a303.backend.chat.service;

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
import ssafy.a303.backend.chat.dto.response.ChatNotificationDto;

/**
 * 채팅 알림 전용 Redis Pub/Sub 서비스
 * - 채팅방 목록에서 실시간 알림을 받기 위한 서비스
 * - 사용자별 알림 채널: user:notifications:{userSeq}
 */
@Service
@Log4j2
public class ChatNotificationPubSubService implements MessageListener {

    private final StringRedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ObjectMapper objectMapper;

    public ChatNotificationPubSubService(
            @Qualifier("chatRedisTemplate") StringRedisTemplate redisTemplate,
            SimpMessageSendingOperations messagingTemplate
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
        
        // ObjectMapper에 JavaTimeModule 등록
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Redis에 알림 발행
     */
    public void publish(String channel, String message) {
        redisTemplate.convertAndSend(channel, message);
    }

    /**
     * Redis에서 알림 수신 → STOMP 브로드캐스트
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Redis 채널명에서 userSeq 추출
            String channel = new String(message.getChannel());
            // channel 형식: user:notifications:123
            String[] parts = channel.split(":");
            if (parts.length < 3) {
                log.error("[REDIS][NOTIFICATION] 잘못된 채널 형식: {}", channel);
                return;
            }
            String userSeq = parts[2];
            
            // 메시지 파싱
            String payload = new String(message.getBody());
            ChatNotificationDto dto = objectMapper.readValue(payload, ChatNotificationDto.class);
            
            // STOMP 브로드캐스트: /sub/user/notifications/{userSeq}
            messagingTemplate.convertAndSend("/sub/user/notifications/" + userSeq, dto);
            
            log.info("[REDIS][NOTIFICATION] 알림 브로드캐스트 완료 → userSeq={}, roomSeq={}, unreadCount={}",
                    userSeq, dto.getRoomSeq(), dto.getUnreadCount());
        } catch (JsonProcessingException e) {
            log.error("[REDIS][NOTIFICATION] JSON 파싱 실패: {}", e.getMessage());
        } catch (Exception e) {
            log.error("[REDIS][NOTIFICATION] 알림 처리 실패: {}", e.getMessage(), e);
        }
    }
}

