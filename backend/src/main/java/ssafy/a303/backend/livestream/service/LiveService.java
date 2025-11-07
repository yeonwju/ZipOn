package ssafy.a303.backend.livestream.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.livestream.dto.request.LiveChatMessageRequestDto;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LiveService {

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
