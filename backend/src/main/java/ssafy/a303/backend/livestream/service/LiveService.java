package ssafy.a303.backend.livestream.service;

import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.auction.repository.AuctionRepository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.livestream.dto.request.LiveChatMessageRequestDto;
import ssafy.a303.backend.livestream.dto.request.LiveCreateRequestDto;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;
import ssafy.a303.backend.livestream.dto.response.LiveCreateResponseDto;
import ssafy.a303.backend.livestream.entity.LiveStream;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;
import ssafy.a303.backend.livestream.repository.LiveStreamRepository;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Log4j2
public class LiveService {

    private final AuctionRepository auctionRepository;
    private final LiveStreamRepository liveStreamRepository;
    private final UserRepository userRepository;
    private final OpenVidu openVidu;

    @Qualifier("liveRedisTemplate")
    private final StringRedisTemplate liveRedisTemplate;

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
        liveRedisTemplate.delete(viewerKey);

        //6. 방 생성 응답값 build
        return LiveCreateResponseDto.builder()
                .liveSeq(liveStream.getId())
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


    /**
     * 클라이언트의 요청 DTO + 서버 인증 정보를 합쳐 응답 DTO를 생성
     *
     * @param requestDto  클라이언트가 보낸 메시지 내용
     * @param senderSeq   JWT 인증으로 확인된 발신자 ID
     * @param senderName  발신자 닉네임
     * @return            방송 채팅 응답 DTO (서버가 클라이언트들에게 뿌리는 메시지)
     */
    public LiveChatMessageResponseDto buildResponse(LiveChatMessageRequestDto requestDto,
                                                    Integer senderSeq,
                                                    String senderName) {
        return LiveChatMessageResponseDto.builder()
                .liveSeq(requestDto.getLiveSeq())      // 방송 ID
                .senderSeq(senderSeq)                  // 발신자 ID (JWT에서 추출)
                .senderName(senderName)                // 발신자 이름
                .content(requestDto.getContent())      // 채팅 내용
                .sentAt(LocalDateTime.now())           // 서버 기준 전송 시간
                .build();
    }

}
