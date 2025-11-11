package ssafy.a303.backend.common.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import ssafy.a303.backend.chat.dto.request.ChatMessageRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.dto.response.ChatNotificationDto;
import ssafy.a303.backend.chat.repository.MessageReadStatusRepository;
import ssafy.a303.backend.chat.service.ChatRedisPubSubService;
import ssafy.a303.backend.chat.service.ChatService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.livestream.dto.request.LiveChatMessageRequestDto;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;
import ssafy.a303.backend.livestream.dto.response.LiveStatsUpdateDto;
import ssafy.a303.backend.livestream.service.LiveChatService;
import ssafy.a303.backend.livestream.service.LiveRedisPubSubService;
import ssafy.a303.backend.livestream.service.LiveService;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Base64;

/**
 * StompController (WebSocket 메시지 처리 컨트롤러)
 * =================================================================================================
 * 역할
 *  - 클라이언트가 STOMP 프로토콜을 통해 `/pub/**` 경로로 전송한 메시지를 수신
 *  - Redis Pub/Sub 기반으로 `/sub/**` 경로를 구독 중인 클라이언트에게 실시간으로 브로드캐스트
 *
 * 주요 경로
 *  - 1:1 채팅   → /pub/chat/{roomSeq} 발행, /sub/chat/{roomSeq} 구독
 *  - 라이브 채팅 → /pub/live/{liveSeq} 발행, /sub/live/{liveSeq} 구독
 *
 * STOMP 메시지 동작 흐름
 *  1) 클라이언트가 /pub 경로로 메시지를 보낸다.
 *  2) 서버는 @MessageMapping 메서드로 해당 메시지를 수신한다.
 *  3) DB에 저장한 후 Redis Pub/Sub 채널을 통해 /sub 경로 구독자에게 브로드캐스트한다.
 *
 * 인증 처리
 *  - CONNECT 시 JWT 인증 검증은 StompHandler에서 수행된다.
 *  - SUBSCRIBE 시 접근 권한(방 참여 여부 등)을 확인할 수 있다.
 *  - SEND(@MessageMapping 실행 시) 현재 로그인 사용자는 SecurityContextHolder에서 가져온다.
 * =================================================================================================
 */
@Controller
@Log4j2
public class StompController {

    private final ChatService chatService;
    private final ChatRedisPubSubService chatRedisPubSubService;
    private final LiveChatService liveChatService;
    private final LiveRedisPubSubService liveRedisPubSubService;
    private final LiveService liveService;
    private final UserRepository userRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final ObjectMapper objectMapper;
    
    // 생성자 주입
    public StompController(ChatService chatService, 
                          ChatRedisPubSubService chatRedisPubSubService,
                          LiveChatService liveChatService,
                          LiveRedisPubSubService liveRedisPubSubService,
                          LiveService liveService,
                          UserRepository userRepository,
                          MessageReadStatusRepository messageReadStatusRepository) {
        this.chatService = chatService;
        this.chatRedisPubSubService = chatRedisPubSubService;
        this.liveChatService = liveChatService;
        this.liveRedisPubSubService = liveRedisPubSubService;
        this.liveService = liveService;
        this.userRepository = userRepository;
        this.messageReadStatusRepository = messageReadStatusRepository;
        
        // ObjectMapper에 JavaTimeModule 등록
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // =================================================================================================
    // 1:1 채팅 메시지 처리
    // =================================================================================================
    @MessageMapping("/chat/{roomSeq}")
    public void sendChatMessage(
            @DestinationVariable Integer roomSeq,
            ChatMessageRequestDto requestDto,
            @Header("Authorization") String authHeader
    ) throws JsonProcessingException {

        log.info("[CHAT] roomSeq={}, content={}", roomSeq, requestDto.getContent());

        // Authorization 헤더에서 토큰 추출
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomException(ErrorCode.INVALID_AUTH_HEADER);
        }
        
        String token = authHeader.substring(7);
        
        // 토큰에서 userSeq 추출 (간단한 방법: JWT 파싱)
        Integer userSeq;
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new CustomException(ErrorCode.INVALID_TOKEN);
            }
            
            // Payload 디코딩
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode node = new ObjectMapper().readTree(payload);
            userSeq = node.get("sub").asInt();
            
            log.info("[CHAT] 토큰에서 userSeq 추출: {}", userSeq);
        } catch (Exception e) {
            log.error("[CHAT] 토큰 파싱 오류: {}", e.getMessage());
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        User sender = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. DB 저장 및 응답 DTO 생성
        ChatMessageResponseDto response = chatService.saveMessage(roomSeq, requestDto, sender);

        // 3. DTO → JSON 문자열 변환
        String payload = objectMapper.writeValueAsString(response);

        // 4. Redis Pub/Sub 채널로 메시지 발행 (채팅방 내부 구독자용)
        chatRedisPubSubService.publish("chat:" + roomSeq, payload);

        log.info("[REDIS][CHAT] roomSeq={}, sender={}, message={}",
                roomSeq, sender.getNickname(), response.getContent());

        // 5. 수신자의 알림 채널로도 발행 (채팅방 목록 구독자용)
        try {
            User recipient = chatService.getRecipient(roomSeq, sender.getUserSeq());
            
            // 수신자 기준 읽지 않은 메시지 개수 조회
            long unreadCount = messageReadStatusRepository.countByChatRoomIdAndUserUserSeqAndIsReadFalse(
                    roomSeq, recipient.getUserSeq());
            
            // 알림 DTO 생성
            ChatNotificationDto notification = ChatNotificationDto.builder()
                    .roomSeq(roomSeq)
                    .sender(ChatNotificationDto.SenderDto.builder()
                            .userSeq(sender.getUserSeq())
                            .name(sender.getName())
                            .nickname(sender.getNickname())
                            .profileImg(sender.getProfileImg())
                            .build())
                    .content(response.getContent())
                    .sentAt(response.getSentAt())
                    .unreadCount((int) unreadCount)
                    .build();
            
            String notificationPayload = objectMapper.writeValueAsString(notification);
            
            // 수신자의 개인 알림 채널로 발행
            chatRedisPubSubService.publish("user:notifications:" + recipient.getUserSeq(), notificationPayload);
            
            log.info("[REDIS][NOTIFICATION] 수신자 알림 발행 → userSeq={}, roomSeq={}, unreadCount={}",
                    recipient.getUserSeq(), roomSeq, unreadCount);
        } catch (Exception e) {
            log.error("[REDIS][NOTIFICATION] 알림 발행 실패: {}", e.getMessage(), e);
            // 알림 실패해도 메시지는 정상 전송되었으므로 예외 무시
        }
    }

    // =================================================================================================
    // 라이브 방송 채팅 메시지 처리
    // =================================================================================================
    @MessageMapping("/live/{liveSeq}")
    public void sendLiveMessage(
            @DestinationVariable Integer liveSeq,
            LiveChatMessageRequestDto requestDto,
            @Header("Authorization") String authHeader
    ) throws JsonProcessingException {

        log.info("[STOMP][LIVE] 📨 Message received: liveSeq={}, content={}", liveSeq, requestDto.getContent());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("[STOMP][LIVE] ❌ Invalid Authorization header");
            throw new CustomException(ErrorCode.INVALID_AUTH_HEADER);
        }

        String token = authHeader.substring(7);
        String payload = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]));
        JsonNode node = new ObjectMapper().readTree(payload);
        Integer userSeq = node.get("sub").asInt();

        log.info("[STOMP][LIVE] 👤 Sender userSeq: {}", userSeq);

        User sender = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 1) 라이브 메시지 DTO 생성 + Redis 저장
        LiveChatMessageResponseDto response = LiveChatMessageResponseDto.builder()
                .liveSeq(liveSeq)
                .senderSeq(userSeq)
                .senderName(sender.getName())
                .content(requestDto.getContent())
                .sentAt(LocalDateTime.now())
                .build();

        log.info("[STOMP][LIVE] 💾 Saving to Redis...");
        
        // 메시지 redis 저장
        liveChatService.saveChatMessage(liveSeq, response);

        String messageJson = objectMapper.writeValueAsString(response);
        
        log.info("[STOMP][LIVE] 📡 Publishing to Redis channel: live:{}", liveSeq);

        // 2) Redis Pub/Sub → 라이브룸 구독자에게 메시지 push
        liveRedisPubSubService.publish("live:" + liveSeq, messageJson);
        
        log.info("[STOMP][LIVE] ✅ Message processing complete");
        
        // 3) 라이브 목록 통계 업데이트 알림 발행 (공통 메서드 사용)
        liveService.publishLiveStatsUpdate(liveSeq, LiveStatsUpdateDto.UpdateType.CHAT);
    }
}
