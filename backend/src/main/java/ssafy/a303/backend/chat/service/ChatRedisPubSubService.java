package ssafy.a303.backend.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener; // Redis Pub/Sub 메시지 수신 인터페이스
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations; // STOMP 브로커로 메세지 전송
import org.springframework.stereotype.Service;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;

@Service
@Log4j2
public class ChatRedisPubSubService implements MessageListener {

    // Redis에 문자열 메시지를 Publish 하기 위한 템플릿
    private final StringRedisTemplate redisTemplate;

    // STOMP Broker (/sub/**) 로 메시지를 보내기 위한 Spring 메시지 전송 객체
    private final SimpMessageSendingOperations messagingTemplate;

    // JSON <-> DTO 변환기 (LocalDateTime 지원을 위해 모듈 추가)
    private final ObjectMapper objectMapper;

    public ChatRedisPubSubService(
            @Qualifier("chatRedisTemplate") StringRedisTemplate redisTemplate,
            SimpMessageSendingOperations messagingTemplate
    ) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;

        // ObjectMapper는 LocalDateTime 직렬화/역직렬화를 지원하도록 설정
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * publish()
     * -------------------------------------------------
     * 다른 서비스(예: ChatService)가 메시지를 Redis Pub/Sub 채널에 발행할 때 사용.
     * 즉, 채팅 메시지를 Redis에 올리면 → Redis가 브로드캐스트함.
     */
    public void publish(String channel, String message) {
        redisTemplate.convertAndSend(channel, message);
    }

    /**
     * onMessage()
     * -------------------------------------------------
     * Redis Pub/Sub에서 메시지가 발행되면 자동으로 호출되는 콜백 메서드.
     * 여기서 받은 메시지를 다시 STOMP를 통해 해당 채팅방 구독자에게 전달한다.
     *
     * 즉,
     * Redis → (여기) → WebSocket 구독자들에게 브로드캐스트
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Redis에서 수신한 JSON 문자열 추출
            String payload = new String(message.getBody());

            // JSON → DTO 변환 (채팅 메시지 객체화)
            ChatMessageResponseDto dto = objectMapper.readValue(payload, ChatMessageResponseDto.class);

            // STOMP 구독자들에게 메시지 전송
            // 예: /sub/chat/5 를 구독 중인 모든 사용자에게 메시지 전달
            messagingTemplate.convertAndSend("/sub/chat/" + dto.getRoomSeq(), dto);

        } catch (JsonProcessingException e) {
            log.error("[REDIS][CHAT] JSON 파싱 실패: {}", e.getMessage());
        }
    }
}