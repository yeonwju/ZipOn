package ssafy.a303.backend.livestream.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.livestream.dto.request.LiveChatMessageRequestDto;
import ssafy.a303.backend.livestream.dto.request.LiveCreateRequestDto;
import ssafy.a303.backend.livestream.dto.response.*;
import ssafy.a303.backend.livestream.dto.response.LiveStartNotificationDto;
import ssafy.a303.backend.livestream.entity.LiveStream;
import ssafy.a303.backend.livestream.enums.LiveStreamSortType;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;
import ssafy.a303.backend.livestream.repository.LiveStreamRepository;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Log4j2
public class LiveService {

    private final AuctionRepository auctionRepository;
    private final LiveStreamRepository liveStreamRepository;
    private final UserRepository userRepository;
    private final OpenVidu openVidu;
    private final LiveRedisPubSubService liveRedisPubSubService;
    private final LiveStartNotificationPubSubService liveStartNotificationPubSubService;

    @Qualifier("liveRedisTemplate")
    private final StringRedisTemplate liveRedisTemplate;
    private final RedisTemplate<Object, Object> redisTemplate;

    /**라이브 방송 시작*/
    public LiveCreateResponseDto startLive(LiveCreateRequestDto requestDto, Integer hostUserSeq) {

        //1. 경매 조회
        Auction auction = auctionRepository.findById(requestDto.getAuctionSeq())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND)); // todo: 경매 못찾겠다는 에러코드 생기면 그걸로 바꾸기

        //2. User 조회
        User host = userRepository.findById(hostUserSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        //3. OpenVidu Session 생성
        SessionProperties properties = new SessionProperties.Builder().build();
        Session session;

        try {
            session = openVidu.createSession(properties);
            log.info("[LIVE] OpenVidu Session 생성 성공: {}", session.getSessionId());
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            log.error("[LIVE] OpenVidu Session 생성 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.OPENVIDU_SESSION_CREATE_FAILED);
        }

        // 4. LiveStream 생성
        LiveStream liveStream = LiveStream.builder()
                .auction(auction)
                .host(host)
                .title(requestDto.getTitle())
                .streamUrl(session.getSessionId())
                .chatChannel("live:" + session.getSessionId())
                .status(LiveStreamStatus.LIVE)
                .viewerCount(0)
                .chatCount(0)
                .likeCount(0)
                .recorded(false)
                .startAt(LocalDateTime.now())
                .build();

        liveStreamRepository.save(liveStream);

        log.info("[LIVE] LiveStream 생성 완료: liveSeq={}", liveStream.getId());

        // 5. 해당 라이브 방 Redis 초기화
        String viewerKey = "live:viewers:" + liveStream.getId();
        String chatKey = "live:chat:" + liveStream.getId();
        String likeKey = "live:like:" + liveStream.getId();

        liveRedisTemplate.delete(viewerKey);
        redisTemplate.delete(chatKey);
        redisTemplate.delete(likeKey);

        //6. 새 방송 시작 알림 발행 (라이브 목록에 실시간으로 추가)
        try {
            LiveStartNotificationDto notification = LiveStartNotificationDto.builder()
                    .liveSeq(liveStream.getId())
                    .auctionSeq(auction.getAuctionSeq())
                    .sessionId(session.getSessionId())
                    .title(liveStream.getTitle())
                    .status(liveStream.getStatus())
                    .host(LiveStartNotificationDto.HostDto.builder()
                            .userSeq(host.getUserSeq())
                            .name(host.getName())
                            .profileImg(host.getProfileImg())
                            .build())
                    .startAt(liveStream.getStartAt())
                    .build();

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            String payload = objectMapper.writeValueAsString(notification);
            
            liveStartNotificationPubSubService.publish("live:new:broadcast", payload);
            
            log.info("[LIVE] 새 방송 시작 알림 발행: liveSeq={}, title={}", liveStream.getId(), liveStream.getTitle());
        } catch (Exception e) {
            log.error("[LIVE] 새 방송 알림 발행 실패: {}", e.getMessage(), e);
        }

        //7. 방 생성 응답값 build
        return LiveCreateResponseDto.builder()
                .liveSeq(liveStream.getId())
                .auctionSeq(auction.getAuctionSeq())
                .sessionId(session.getSessionId())
                .title(liveStream.getTitle())
                .status(liveStream.getStatus())
                .host(LiveCreateResponseDto.HostDto.builder()
                        .userSeq(host.getUserSeq())
                        .name(host.getName())
                        .profileImg(host.getProfileImg())
                        .build())
                .startAt(liveStream.getStartAt())
                .build();
    }

    /*라이브 방송 참여 토큰 생성*/
    public LiveTokenResponseDto startLiveToken(Integer liveSeq, boolean isHost, Integer userSeq)  {

        // 1. 라이브 방송 존재 여부 확인
        LiveStream liveStream = liveStreamRepository.findById(liveSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVE_STREAM_NOT_FOUND));

        // 2. 라이브 상태 확인 (이미 ENDED 상태면 토큰 발급 불가)
        if(liveStream.getStatus().equals(LiveStreamStatus.ENDED)) {
            throw new CustomException(ErrorCode.LIVE_STREAM_ALREADY_ENDED);
        }

        try {
            // 3. OpenVidu에서 해당 방송의 Session 가져오기
            Session session = openVidu.getActiveSession(liveStream.getStreamUrl()); // OpenVidu 서버에서 현재 진행중인 세션만 가져옴
            if(session == null) { // 이미 종료되었거나 생성되지 않은 세션은 null을 반환함
                log.error("[LIVE] Session not found: {}", liveStream.getStreamUrl());
                throw new CustomException(ErrorCode.OPENVIDU_SESSION_NOT_FOUND);
            }

            /** 4. 역할 설정 (방장: PUBLISHER / 시청자: SUBSCRIBER)
             * PUBLISHER : 송출자 , 카메라/마이크 전송 가능, 방장/방송 호스트
             * SUBSCRIBER : 시청자, 영상/오디오 보기만 가능, 송출은 불가, 시청자/관전자
             * */
            OpenViduRole role = isHost ? OpenViduRole.PUBLISHER : OpenViduRole.SUBSCRIBER;

            // 5. Connection 생성 정보 설정
            ConnectionProperties properties = new ConnectionProperties.Builder()
                    .type(ConnectionType.WEBRTC)
                    .role(role)
                    .data(userSeq.toString()) //유저 정보를 세션 내부에 저장
                    .build();

            // 6. 해당 세션에 연결 생성 (OpenVidu 토큰 발급)
            // 해당 세션에 유저 1명 연결을 생성하고 반환값으로 접속 토큰을 준다
            Connection connection = session.createConnection(properties);

            // 7. Redis에 시청자 등록 (중복 방지: SET 구조)
            String viewerKey = "live:viewers:" + liveSeq;
            redisTemplate.opsForSet().add(viewerKey, userSeq);

            // 8. 현재 시청자 수를 Pub/Sub 로 전송 (라이브 방송 내부용)
            long viewerCount = redisTemplate.opsForSet().size(viewerKey);
            liveRedisTemplate.convertAndSend(
                    "live:" + liveSeq,
                    "{\"type\":\"VIEWER_COUNT_UPDATE\",\"count\":" + viewerCount + "}"
            );

            log.info("[LIVE] Token 발급 성공: liveSeq={}, userSeq={}, role={}", liveSeq, userSeq, role);

            // 10. 토큰 정보 DTO로 반환
            //Session  = 방송 방 자체
            //Token    = 그 방송 방에 "들어가기 위한 입장권"
            return LiveTokenResponseDto.builder()
                    .token(connection.getToken())  // WebRTC 접속 토큰
                    .sessionId(session.getSessionId()) // 연결된 세션 ID
                    .role(role.name())  // 역할 정보
                    .build();

        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            log.error("[LIVE] Token 생성 실패: {}", e.getMessage());
            throw new CustomException(ErrorCode.OPENVIDU_TOKEN_CREATE_FAILED);
        }
    }

    /* 라이브 방송 퇴장 */
    public void leaveLive(Integer liveSeq, Integer userSeq) {
        
        // 1. 라이브 방송 존재 여부 확인
        liveStreamRepository.findById(liveSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVE_STREAM_NOT_FOUND));
        
        // 2. Redis에서 시청자 제거
        String viewerKey = "live:viewers:" + liveSeq;
        redisTemplate.opsForSet().remove(viewerKey, userSeq);
        
        // 3. 현재 시청자 수를 Pub/Sub 로 전송 (라이브 방송 내부용)
        long viewerCount = Optional.ofNullable(redisTemplate.opsForSet().size(viewerKey)).orElse(0L);
        liveRedisTemplate.convertAndSend(
                "live:" + liveSeq,
                    "{\"type\":\"VIEWER_COUNT_UPDATE\",\"count\":" + viewerCount + "}"
        );
        
        log.info("[LIVE] 시청자 퇴장: liveSeq={}, userSeq={}, 남은 시청자={}", liveSeq, userSeq, viewerCount);
    }

    /* 라이브 방송 종료 */
    public LiveEndResponseDto endLive(Integer liveSeq, Integer userSeq) {

        // 1. 라이브 방송 존재 여부 확인
        LiveStream liveStream = liveStreamRepository.findById(liveSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVE_STREAM_NOT_FOUND));

        // 2. 종료 요청자가 호스트인지 확인 (호스트만 방송 종료 가능)
        if (!liveStream.getHost().getUserSeq().equals(userSeq)) {
            throw new CustomException(ErrorCode.LIVE_STREAM_NOT_OWNER);
        }

        // 3. 종료 요청 유저 정보 조회
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 4. OpenVidu 세션 종료 처리
        try {
            Session session = openVidu.getActiveSession(liveStream.getStreamUrl());
            if (session != null) {
                session.close(); // WebRTC 세션 종료
                log.info("[LIVE] OpenVidu Session 종료: {}", session.getSessionId());
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            log.error("[LIVE] OpenVidu Session 종료 실패: {}", e.getMessage());
            throw new CustomException(ErrorCode.OPENVIDU_SESSION_CLOSE_FAILED);
        }

        // 5. Redis 저장값 조회 (종료 시 누적 집계 반영)
        String viewerKey = "live:viewers:" + liveSeq;
        String chatKey = "live:chat:" + liveSeq;
        String likeKey = "live:like:" + liveSeq;

        int finalViewerCount = redisTemplate.opsForSet().size(viewerKey) != null
                ? Objects.requireNonNull(redisTemplate.opsForSet().size(viewerKey)).intValue() : 0;

        int finalChatCount = redisTemplate.opsForList().size(chatKey) != null
                ? Objects.requireNonNull(redisTemplate.opsForList().size(chatKey)).intValue() : 0;

        int finalLikeCount = redisTemplate.opsForSet().size(likeKey) != null
                ? Objects.requireNonNull(redisTemplate.opsForSet().size(likeKey)).intValue() : 0;

        // 6. 엔티티 상태 변경 (LiveStream 종료 상태 & 최종 데이터 저장)
        liveStream.end(LocalDateTime.now(), finalViewerCount, finalChatCount, finalLikeCount);
        liveStreamRepository.save(liveStream);

        // 7. 방송 종료 이벤트 전송 (라이브 방송 내부 시청자용)
        liveRedisTemplate.convertAndSend(
                "live:" + liveSeq,
                "{\"type\":\"LIVE_ENDED\"}"
        );
        
        log.info("[LIVE] 방송 종료 이벤트 발행: liveSeq={}", liveSeq);

        // 8. 모든 시청자 강제 퇴장 처리 (Redis에서 제거)
        Set<Object> viewers = redisTemplate.opsForSet().members(viewerKey);
        if (viewers != null && !viewers.isEmpty()) {
            redisTemplate.delete(viewerKey);
            log.info("[LIVE] 모든 시청자 강제 퇴장 처리 완료: {} 명", viewers.size());
        }

        // 9. Redis 데이터 TTL 설정 (방송 종료 후 1시간 지나면 자동 삭제)
        // 시청자는 이미 삭제되었으므로 채팅과 좋아요만 TTL 설정
        redisTemplate.expire(chatKey, 1, TimeUnit.HOURS);
        redisTemplate.expire(likeKey, 1, TimeUnit.HOURS);

        log.info("[LIVE] 방송 종료 완료: liveSeq={}, viewer={}, chat={}, like={}",
                liveSeq, finalViewerCount, finalChatCount, finalLikeCount);

        // 10. 종료 응답 반환
        return LiveEndResponseDto.builder()
                .liveSeq(liveStream.getId())
                .auctionSeq(liveStream.getAuction().getAuctionSeq())
                .sessionId(liveStream.getStreamUrl())
                .title(liveStream.getTitle())
                .status(liveStream.getStatus())
                .viewerCount(finalViewerCount)
                .chatCount(finalChatCount)
                .likeCount(finalLikeCount)
                .host(LiveEndResponseDto.HostDto.builder()
                        .userSeq(user.getUserSeq())          // 종료 요청 유저(방장) 정보
                        .name(user.getName())
                        .profileImg(user.getProfileImg())
                        .build())
                .startAt(liveStream.getStartAt())
                .endAt(liveStream.getEndAt())
                .build();
    }

    /*라이브 방송 정보 조회*/
    public LiveInfoResponseDto getLiveInfo(Integer liveSeq, Integer userSeq) {

        // 1. 라이브 방송 조회
        LiveStream liveStream = liveStreamRepository.findById(liveSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVE_STREAM_NOT_FOUND));

        // 2. Redis Key
        String viewerKey = "live:viewers:" + liveSeq;
        String chatKey = "live:chat:" + liveSeq;
        String likeKey = "live:like:" + liveSeq;

        //3. 방송이 끝났는지 아닌지 확인
        boolean isEnded = liveStream.getStatus() == LiveStreamStatus.ENDED;

        // 4. 방송이 끝났으면 DB에서 조회, 라이브 중이면 Redis에서 실시간 데이터 조회
        long viewerCount = isEnded
                ? liveStream.getViewerCount()
                : Optional.ofNullable(redisTemplate.opsForSet().size(viewerKey)).orElse(0L);

        long chatCount = isEnded
                ? liveStream.getChatCount()
                : Optional.ofNullable(redisTemplate.opsForList().size(chatKey)).orElse(0L);

        long likeCount = isEnded
                ? liveStream.getLikeCount()
                : Optional.ofNullable(redisTemplate.opsForSet().size(likeKey)).orElse(0L);

        // 이미 좋아요 되어있는지 확인 (종료된 방송은 Redis 데이터가 TTL로 삭제될 수 있으므로 체크 안함)
        // 종료된 방송은 좋아요 정보 제공 안 함
        boolean liked = !isEnded && Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(likeKey, userSeq));

        // 5. 응답 반환
        return LiveInfoResponseDto.builder()
                .liveSeq(liveStream.getId())
                .auctionSeq(liveStream.getAuction().getAuctionSeq())
                .sessionId(liveStream.getStreamUrl())
                .title(liveStream.getTitle())
                .status(liveStream.getStatus())
                .viewerCount((int) viewerCount)
                .chatCount((int) chatCount)
                .likeCount((int) likeCount)
                .host(LiveInfoResponseDto.HostDto.builder()
                        .userSeq(liveStream.getHost().getUserSeq())
                        .name(liveStream.getHost().getName())
                        .profileImg(liveStream.getHost().getProfileImg())
                        .build())
                .startAt(liveStream.getStartAt())
                .endAt(liveStream.getEndAt())
                .liked(liked)
                .build();
    }

    /*상태별 라이브 목록 조회*/
    public List<LiveInfoResponseDto> getLiveListByStatus(LiveStreamStatus status, Integer userSeq, LiveStreamSortType sortType) {

        // 상태별 방송 조회 (시작 시간 기준 최신순)
        List<LiveStream> liveStreams = liveStreamRepository
                .findByStatusOrderByStartAtDesc(status);

        // DTO 변환 후 정렬
        return liveStreams.stream()
                .map(liveStream -> {

                    String viewerKey = "live:viewers:" + liveStream.getId();
                    String chatKey = "live:chat:" + liveStream.getId();
                    String likeKey = "live:like:" + liveStream.getId();

                    // 종료된 방송이면 DB 값 / 진행중이면 Redis 실시간 값 사용
                    boolean isEnded = liveStream.getStatus() == LiveStreamStatus.ENDED;

                    int viewerCount = isEnded
                            ? liveStream.getViewerCount()
                            : Optional.ofNullable(redisTemplate.opsForSet().size(viewerKey))
                            .map(Long::intValue).orElse(0);

                    int chatCount = isEnded
                            ? liveStream.getChatCount()
                            : Optional.ofNullable(redisTemplate.opsForList().size(chatKey))
                            .map(Long::intValue).orElse(0);

                    int likeCount = isEnded
                            ? liveStream.getLikeCount()
                            : Optional.ofNullable(redisTemplate.opsForSet().size(likeKey))
                            .map(Long::intValue).orElse(0);

                    // 이미 좋아요 되어있는지 확인 (종료된 방송은 Redis 데이터가 TTL로 삭제될 수 있으므로 체크 안함)
                    // 종료된 방송은 좋아요 정보 제공 안 함
                    boolean liked = !isEnded && Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(likeKey, userSeq));

                    return LiveInfoResponseDto.builder()
                            .liveSeq(liveStream.getId())
                            .auctionSeq(liveStream.getAuction().getAuctionSeq())
                            .sessionId(liveStream.getStreamUrl())
                            .title(liveStream.getTitle())
                            .status(liveStream.getStatus())
                            .viewerCount(viewerCount)
                            .chatCount(chatCount)
                            .likeCount(likeCount)
                            .host(LiveInfoResponseDto.HostDto.builder()
                                    .userSeq(liveStream.getHost().getUserSeq())
                                    .name(liveStream.getHost().getName())
                                    .profileImg(liveStream.getHost().getProfileImg())
                                    .build())
                            .startAt(liveStream.getStartAt())
                            .endAt(liveStream.getEndAt())
                            .liked(liked)
                            .build();
                })
                // 정렬 타입에 따라 정렬
                .sorted((a, b) -> {
                    if (sortType == LiveStreamSortType.POPULAR) {
                        // 인기순: 시청자 수 내림차순
                        return Integer.compare(b.getViewerCount(), a.getViewerCount());
                    } else {
                        // 최신순: 시작 시간 내림차순 (이미 DB에서 정렬되어 있지만 명시적으로 처리)
                        return b.getStartAt().compareTo(a.getStartAt());
                    }
                })
                .toList();
    }

    /*라이브 방송 좋아요 등록 or 좋아요 취소*/
    public boolean toggleLike(Integer liveSeq, Integer userSeq) {

        // 방송 확인
        liveStreamRepository.findById(liveSeq)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVE_STREAM_NOT_FOUND));

        String likeKey = "live:like:" + liveSeq;

        // 이미 좋아요 되어있는지 확인
        Boolean alreadyLiked = redisTemplate.opsForSet().isMember(likeKey, userSeq);

        if (Boolean.TRUE.equals(alreadyLiked)) {
            // 좋아요 취소
            redisTemplate.opsForSet().remove(likeKey, userSeq);
        } else {
            // 좋아요 추가
            redisTemplate.opsForSet().add(likeKey, userSeq);
        }

        // 변경 후 좋아요 수 조회
        int likeCount = Optional.ofNullable(redisTemplate.opsForSet().size(likeKey))
                .map(Long::intValue).orElse(0);

        // 실시간 좋아요 수 갱신 전송 (기존 라이브 방송 내부용)
        liveRedisTemplate.convertAndSend(
                "live:" + liveSeq,
                    "{\"type\":\"LIKE_COUNT_UPDATE\",\"count\":" + likeCount + "}"
        );

        // true = 좋아요 상태 유지, false = 취소 상태 유지
        return !Boolean.TRUE.equals(alreadyLiked);
    }

}

