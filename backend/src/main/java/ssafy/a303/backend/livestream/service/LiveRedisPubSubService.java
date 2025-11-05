package ssafy.a303.backend.livestream.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    public LiveRedisPubSubService(
            @Qualifier("liveRedisTemplate") StringRedisTemplate redisTemplate, // ✅ 생성자 파라미터에 붙이기
            SimpMessageSendingOperations messagingTemplate
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
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
