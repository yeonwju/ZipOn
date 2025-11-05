package ssafy.a303.backend.common.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import ssafy.a303.backend.chat.dto.request.ChatMessageRequestDto;
import ssafy.a303.backend.chat.dto.response.ChatMessageResponseDto;
import ssafy.a303.backend.chat.service.ChatRedisPubSubService;
import ssafy.a303.backend.chat.service.ChatService;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.livestream.dto.request.LiveChatMessageRequestDto;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;
import ssafy.a303.backend.livestream.service.LiveRedisPubSubService;
import ssafy.a303.backend.livestream.service.LiveService;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

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
@RequiredArgsConstructor
@Log4j2
public class StompController {

    // 의존성 주입
    private final ChatService chatService;                           // 채팅 메시지 저장 및 비즈니스 로직
    private final ChatRedisPubSubService chatRedisPubSubService;     // Redis 기반 채팅 메시지 브로드캐스트
    private final LiveService liveService;                           // 라이브 방송 비즈니스 로직
    private final LiveRedisPubSubService liveRedisPubSubService;     // Redis 기반 라이브 방송 메시지 브로드캐스트
    private final UserRepository userRepository;                     // JWT 기반 로그인 사용자 조회
    private final ObjectMapper objectMapper = new ObjectMapper();    // DTO 직렬화용 Jackson Mapper

    // =================================================================================================
    // 1:1 채팅 메시지 처리
    // =================================================================================================

    /**
     * 클라이언트가 `/pub/chat/{roomSeq}` 로 STOMP 메시지를 보낼 때 호출된다.
     * - 해당 메시지는 Redis Pub/Sub을 통해 `/sub/chat/{roomSeq}` 구독자에게 전달된다.
     *
     * 동작 순서
     *  1. 클라이언트가 STOMP 메시지를 `/pub/chat/{roomSeq}` 경로로 발행한다.
     *  2. 서버는 SecurityContextHolder에서 JWT 인증 사용자 정보를 추출한다.
     *  3. ChatService를 통해 메시지를 DB에 저장하고 응답 DTO를 생성한다.
     *  4. Redis Pub/Sub을 통해 해당 채널 구독자에게 실시간 브로드캐스트한다.
     *
     * @param roomSeq   채팅방 식별자 (Path Variable)
     * @param requestDto 클라이언트에서 보낸 메시지 DTO
     */
    @MessageMapping("/chat/{roomSeq}")
    public void sendChatMessage(
            @DestinationVariable Integer roomSeq,
            ChatMessageRequestDto requestDto
    ) throws JsonProcessingException {

        log.info("[CHAT] roomSeq={}, content={}", roomSeq, requestDto.getContent());

        // 1. JWT 기반 현재 사용자 정보 추출
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User sender = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. DB 저장 및 응답 DTO 생성
        ChatMessageResponseDto response = chatService.saveMessage(roomSeq, requestDto, sender);

        // 3. DTO → JSON 문자열 변환
        String payload = objectMapper.writeValueAsString(response);

        // 4. Redis Pub/Sub 채널로 메시지 발행
        chatRedisPubSubService.publish("chat:" + roomSeq, payload);

        log.info("[REDIS][CHAT] roomSeq={}, sender={}, message={}",
                roomSeq, sender.getNickname(), response.getContent());
    }

    // =================================================================================================
    // 라이브 방송 채팅 메시지 처리
    // =================================================================================================

    /**
     * 클라이언트가 `/pub/live/{liveSeq}` 로 메시지를 발행할 때 호출된다.
     * - 방송 중인 방의 구독자(`/sub/live/{liveSeq}`)에게 메시지를 전달한다.
     *
     * 동작 순서
     *  1. 클라이언트가 방송 중 메시지를 `/pub/live/{liveSeq}` 경로로 발행한다.
     *  2. 서버는 SecurityContextHolder에서 로그인한 사용자 정보를 조회한다.
     *  3. LiveService를 통해 메시지를 가공하고 응답 DTO를 생성한다.
     *  4. Redis Pub/Sub 채널을 통해 브로드캐스트한다.
     *
     * @param liveSeq    방송 식별자 (Path Variable)
     * @param requestDto 클라이언트에서 보낸 메시지 DTO
     */
    @MessageMapping("/live/{liveSeq}")
    public void sendLiveMessage(
            @DestinationVariable Integer liveSeq,
            LiveChatMessageRequestDto requestDto
    ) throws JsonProcessingException {

        log.info("[LIVE] liveSeq={}, content={}", liveSeq, requestDto.getContent());

        // 1. JWT 기반 현재 로그인 사용자 조회
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User sender = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. 응답 DTO 구성 (보낸 사람 정보 + 메시지 내용)
        LiveChatMessageResponseDto response =
                liveService.buildResponse(requestDto, sender.getUserSeq(), sender.getNickname());

        // 3. DTO → JSON 문자열 변환
        String payload = objectMapper.writeValueAsString(response);

        // 4. Redis Pub/Sub 채널로 메시지 발행
        liveRedisPubSubService.publish("live:" + liveSeq, payload);

        log.info("[REDIS][LIVE] liveSeq={}, sender={}, message={}",
                liveSeq, sender.getNickname(), response.getContent());
    }
}
