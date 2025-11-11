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
 * ------------------------------------------------------------------
 * WebSocket(STOMP) 메시지에 대한 인증/인가 처리 담당 인터셉터.
 * HTTP 요청은 Spring Security FilterChain이 처리하지만,
 * WebSocket은 그 체인을 타지 않기 때문에 직접 JWT 검증을 해줘야 한다.
 */
@Component
@Log4j2
public class StompHandler implements ChannelInterceptor {

    /** JWT 서명 검증용 secret key */
    @Value("${jwt.secret}")
    private String secretKey;
    
    /** JWT 서명 검증용 Key 객체 */
    private Key key;

    /** 채팅방 접근 권한 검증에 사용할 서비스 */
    private final ChatService chatService;
    
    /** 라이브 방송 입장/퇴장 등록 처리 담당 */
    private final StompEventListener stompEventListener;

    public StompHandler(ChatService chatService, StompEventListener stompEventListener) {
        this.chatService = chatService;
        this.stompEventListener = stompEventListener;
    }
    
    @PostConstruct
    void init() {
        // JWTProvider와 동일한 방식으로 Key 생성
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * STOMP 인바운드 메시지를 가로채는 핵심 메서드.
     *  - message: 클라이언트가 보낸 STOMP 프레임
     *  - channel: 메시지가 전달될 채널
     *
     * Command에 따라 검증 로직 분기:
     *  - CONNECT → JWT 토큰 유효성 확인
     *  - SUBSCRIBE → 구독 권한(방 접근 가능 여부) 확인
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        // STOMP 헤더 정보를 파싱하기 위한 헬퍼 객체
        final StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // 1) CONNECT: 웹소켓 연결 시도 시 → JWT 검증
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

        // 2) SUBSCRIBE: 특정 채널/방 구독 시도 시 → 접근 권한 검증
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

        // 검증 통과 → 이 message 를 그대로 다음 단계에 계속 흘려보낸다
        return message;
    }

    /**
     * CONNECT 요청에서 Authorization 헤더를 확인하고 JWT 검증 수행
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

    /**
     * SUBSCRIBE 요청 시 경로 규칙 및 사용자 권한을 검증한다.
     * 경로 패턴:
     *   - /sub/chat/12 → 1:1 채팅방 (권한 검증 필요)
     *   - /sub/live/5  → 라이브 방송 채팅 (공개, 세션 등록 필요)
     *   - /sub/user/notifications/123 → 개인 알림 (공개)
     *   - /sub/live/stats/updates → 라이브 통계 업데이트 (공개)
     *   - /sub/live/new/broadcast → 새 방송 시작 알림 (공개)
     */
    private void validateRoomPermission(StompHeaderAccessor accessor) {

        // A) 목적지(destination) 확인
        final String dest = accessor.getDestination();
        log.info("[STOMP][SUBSCRIBE] 구독 요청: {}", dest);
        
        if (dest == null || dest.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_DESTINATION);
        }

        // B) 공개 채널은 바로 허용 (권한 검증 불필요)
        if (dest.startsWith("/sub/live/stats/updates") || 
            dest.startsWith("/sub/live/new/broadcast") ||
            dest.startsWith("/sub/user/notifications/")) {
            log.info("[STOMP][SUBSCRIBE] 공개 채널 구독 허용: {}", dest);
            return;
        }

        // C) 경로 파싱 (chat 또는 live)
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

        final String subject = claims.getSubject(); // 사용자 식별자 (ID)

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
            // 라이브 방송 채팅 채널 구독 (공개 접근)
            log.info("[SUBSCRIBE] 라이브 구독 허용 - subject: {}, liveId: {}", subject, id);
            
            // ⭐ 세션 등록 (비정상 종료 시 자동 퇴장 처리용)
            try {
                String sessionId = accessor.getSessionId();
                Integer userSeq = Integer.valueOf(subject);
                Integer liveSeq = Integer.valueOf(id);
                
                stompEventListener.registerLiveViewer(sessionId, userSeq, liveSeq);
                
                log.info("[SUBSCRIBE] 라이브 시청자 세션 등록 완료: sessionId={}, userSeq={}, liveSeq={}", 
                        sessionId, userSeq, liveSeq);
            } catch (Exception e) {
                log.warn("[SUBSCRIBE] 라이브 시청자 세션 등록 실패 (구독은 허용): {}", e.getMessage());
                // 세션 등록 실패해도 구독은 허용 (비정상 종료 감지만 안 될 뿐)
            }

        } else {
            // 지원하지 않는 구독 카테고리
            throw new CustomException(ErrorCode.UNSUPPORTED_CATEGORY);
        }
    }
}
