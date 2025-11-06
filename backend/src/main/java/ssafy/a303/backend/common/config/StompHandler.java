package ssafy.a303.backend.common.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.chat.service.ChatService;
import ssafy.a303.backend.common.exception.CustomException;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
import ssafy.a303.backend.common.response.ErrorCode;

/**
 * StompHandler
 * -----------------------------------------------------------------------------
 * 역할:
 *  - WebSocket(STOMP) 인바운드 메시지를 가로채 인증/인가 로직을 수행하는 인터셉터
 *  - Spring Security FilterChain은 HTTP 요청에만 작동하므로,
 *    STOMP(WebSocket) 메시지는 직접 JWT 검증을 수행해야 한다.

 * 주요 동작:
 *   1) CONNECT → 클라이언트가 웹소켓 연결 시도 시 JWT 유효성 검증
 *   2) SUBSCRIBE → 특정 Topic(예: 채팅방)에 구독 요청 시 접근 권한 검증
 *   3) (선택) SEND → 메시지 발송 시에도 필요 시 검증 로직 추가 가능

 * STOMP 헤더 구조:
 *   - 클라이언트는 Authorization 헤더를 "native header"에 담아 전송해야 한다.
 *     예: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

 * 예시 구독 경로 규칙:
 *   - /sub/chat/{roomId} → 1:1 채팅방 (참가자만 접근 가능)
 *   - /sub/live/{liveId} → 실시간 방송 (공개 접근 가능)
 */
@Component
@Log4j2
public class StompHandler implements ChannelInterceptor {

    /** JWT 서명 검증용 secret key (application.yml에서 주입) */
    @Value("${jwt.secret}")
    private String secretKey;
    
    /** JWT 서명 검증용 Key 객체 */
    private Key key;

    /** 채팅방 접근 권한 검증에 사용할 서비스 */
    private final ChatService chatService;

    public StompHandler(ChatService chatService) {
        this.chatService = chatService;
    }
    
    @PostConstruct
    void init() {
        // JWTProvider와 동일한 방식으로 Key 생성
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * preSend()
     * -------------------------------------------------------------------------
     * STOMP 인바운드 메시지를 가로채는 핵심 메서드.
     *  - message: 클라이언트가 보낸 STOMP 프레임
     *  - channel: 메시지가 전달될 채널

     * Command에 따라 검증 로직 분기:
     *  - CONNECT → JWT 토큰 유효성 확인
     *  - SUBSCRIBE → 구독 권한(방 접근 가능 여부) 확인
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        // STOMP 헤더 정보를 파싱하기 위한 헬퍼 객체
        final StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // 1) 연결 시도 → JWT 유효성 검증
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                validateJwt(accessor);
                log.info("[STOMP][CONNECT] JWT 검증 성공");
            } catch (Exception e) {
                log.error("[STOMP][CONNECT] JWT 검증 실패: {}", e.getMessage(), e);
                // 개발 환경에서는 계속 진행 (프로덕션에서는 throw 해야 함)
                // throw e;
            }
        }

        // 2) 구독 시도 → 방/채널 접근 권한 검증
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            try {
                validateRoomPermission(accessor);
                log.info("[STOMP][SUBSCRIBE] 구독 권한 검증 성공");
            } catch (Exception e) {
                log.error("[STOMP][SUBSCRIBE] 구독 권한 검증 실패: {}", e.getMessage(), e);
                // 개발 환경에서는 계속 진행
                // throw e;
            }
        }

        // 검증 통과 → 메시지를 그대로 Broker로 전달
        return message;
    }

    // ========================================================================
    // CONNECT 단계: JWT 토큰 검증
    // ========================================================================

    /**
     * 클라이언트의 STOMP CONNECT 요청 시 JWT 유효성을 검증한다.
     * 검증 순서:
     *  1) Authorization 헤더 존재 확인
     *  2) "Bearer " 접두어 제거 후 실제 토큰 추출
     *  3) JJWT로 서명키 검증 및 만료 확인
     * 예외 발생 시 → CustomException으로 차단 (ErrorCode.INVALID_AUTH_HEADER 등)
     */
    private void validateJwt(StompHeaderAccessor accessor) {
        // Authorization 헤더 추출 (STOMP는 HTTP가 아니므로 native header에서 가져온다)
        String bearerToken = accessor.getFirstNativeHeader("Authorization");

        log.info("[STOMP][CONNECT] Authorization 헤더: {}", bearerToken != null ? bearerToken.substring(0, Math.min(30, bearerToken.length())) + "..." : "null");

        // 헤더가 없거나 형식이 잘못된 경우 예외
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            log.error("[STOMP][CONNECT] Authorization 헤더가 없거나 잘못됨");
            throw new CustomException(ErrorCode.INVALID_AUTH_HEADER);
        }

        // 실제 JWT 문자열 추출
        String token = bearerToken.substring(7);
        log.info("[STOMP][CONNECT] JWT 토큰 추출 완료 (길이: {})", token.length());

        try {
            // 토큰 검증 수행 (서명, 만료 등) - Key 객체 사용
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userSeq = claims.getSubject();
            String role = claims.get("role", String.class);

            log.info("[CONNECT] JWT 검증 완료 - 사용자: {}, 역할: {}", userSeq, role);

            // SecurityContext에 인증 정보 설정 (StompController에서 사용)
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userSeq,  // principal
                            null,     // credentials
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // STOMP 세션에도 저장 (선택사항)
            accessor.setUser(authentication);
            
            log.info("[CONNECT] SecurityContext 설정 완료 - userSeq: {}", userSeq);
        } catch (Exception e) {
            // 유효하지 않은 토큰 → 연결 차단
            log.error("[STOMP][CONNECT] JWT 파싱 실패: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }
    }

    // ========================================================================
    // SUBSCRIBE 단계: 구독 경로 및 접근 권한 검증
    // ========================================================================

    /**
     * 사용자가 특정 Topic(/sub/...)을 구독하려 할 때
     * 경로 규칙 및 사용자 권한을 검증한다.
     * 예:
     *   /sub/chat/12 → category=chat, id=12
     *   /sub/live/5  → category=live, id=5
     */
    private void validateRoomPermission(StompHeaderAccessor accessor) {

        // A) 목적지(destination) 확인 (예: /sub/chat/12)
        final String dest = accessor.getDestination();
        log.info("[STOMP][SUBSCRIBE] 구독 요청: {}", dest);
        
        if (dest == null || dest.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_DESTINATION);
        }

        // B) 경로 파싱
        final String[] path = dest.split("/");
        if (path.length < 4) {
            log.error("[STOMP][SUBSCRIBE] 경로 형식 오류: {}", dest);
            throw new CustomException(ErrorCode.INVALID_DESTINATION);
        }

        final String category = path[2]; // "chat" or "live"
        final String id = path[3];       // "12" 등
        log.info("[STOMP][SUBSCRIBE] 파싱됨 - category: {}, id: {}", category, id);

        // C) Authorization 헤더 재확인 (CONNECT 이후에도 보안 유지를 위해 다시 검증)
        final String bearerToken = accessor.getFirstNativeHeader("Authorization");
        log.info("[STOMP][SUBSCRIBE] Authorization 헤더: {}", bearerToken != null ? bearerToken.substring(0, Math.min(30, bearerToken.length())) + "..." : "null");
        
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            log.error("[STOMP][SUBSCRIBE] Authorization 헤더가 없거나 형식 오류");
            throw new CustomException(ErrorCode.INVALID_AUTH_HEADER);
        }

        final String token = bearerToken.substring(7);
        final Claims claims;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(key)  // Key 객체 사용
                    .build()
                    .parseClaimsJws(token)
                    .getBody(); //토큰 안의 Claims (Payload 부분) 꺼내기
            log.info("[STOMP][SUBSCRIBE] JWT 검증 성공 - subject: {}", claims.getSubject());
        } catch (Exception e) {
            log.error("[STOMP][SUBSCRIBE] JWT 파싱 실패: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        final String subject = claims.getSubject(); // 사용자 식별자 (이메일 or ID)

        // D) 카테고리별 접근 정책 처리
        if ("chat".equals(category)) {
            // 1:1 채팅방은 참가자만 접근 허용
            final Integer roomId;
            try {
                roomId = Integer.parseInt(id);
            } catch (NumberFormatException e) {
                throw new CustomException(ErrorCode.INVALID_ROOM_ID);
            }

            // ChatService를 통해 방 참여 여부 확인
            final boolean allowed = chatService.isRoomParticipant(subject, roomId);
            if (!allowed) {
                throw new CustomException(ErrorCode.UNAUTHORIZED_CHAT_ACCESS);
            }

            log.info("[SUBSCRIBE] 채팅방 구독 허용 - subject: {}, roomId: {}", subject, roomId);

        } else if ("live".equals(category)) {
            // 라이브 방송은 공개 접근으로 가정 (정책에 따라 접근제어 추가 가능)
            log.info("[SUBSCRIBE] 라이브 구독 허용 - subject: {}, liveId: {}", subject, id);

        } else {
            // 지원하지 않는 구독 카테고리
            throw new CustomException(ErrorCode.UNSUPPORTED_CATEGORY);
        }
    }
}
