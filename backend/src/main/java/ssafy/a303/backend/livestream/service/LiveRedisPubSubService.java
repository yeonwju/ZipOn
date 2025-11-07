package ssafy.a303.backend.livestream.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;

@Service
@Log4j2
public class LiveRedisPubSubService implements MessageListener {

    private final StringRedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ObjectMapper objectMapper;

    public LiveRedisPubSubService(
            @Qualifier("liveRedisTemplate") StringRedisTemplate redisTemplate,
            SimpMessageSendingOperations messagingTemplate
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
        
        // ObjectMapper에 JavaTimeModule 등록
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public void publish(String channel, String message) {
        redisTemplate.convertAndSend(channel, message);
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String payload = new String(message.getBody());
            LiveChatMessageResponseDto dto = objectMapper.readValue(payload, LiveChatMessageResponseDto.class);
            messagingTemplate.convertAndSend("/sub/live/" + dto.getLiveSeq(), dto);
        } catch (JsonProcessingException e) {
            log.error("[REDIS][LIVE] JSON 파싱 실패: {}", e.getMessage());
        }
    }
}
