package ssafy.a303.backend.livestream.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.livestream.dto.response.LiveChatMessageResponseDto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 라이브 방송 채팅 관련 서비스
 * ---------------------------------------------------------------------
 * - 채팅 메시지를 Redis List에 저장 (실시간, 빠른 입출력)
 * - 채팅 기록 조회 (최근 N개 메시지)
 * - Redis TTL 적용으로 오래된 채팅 자동 정리
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class LiveChatService {

    @Qualifier("liveRedisObjectTemplate")
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * 채팅 메시지 저장
     * ------------------------------------------------------------------
     * Redis List 구조 사용: O(1) 삽입 / 순서 유지
     * - key : live:chat:{liveSeq}
     * - value : LiveChatMessageResponseDto (JSON 변환 저장)
     *
     * @param liveSeq 방송 ID
     * @param message 저장할 채팅 메시지
     */
    public void saveChatMessage(Integer liveSeq, LiveChatMessageResponseDto message) {

        String key = "live:chat:" + liveSeq;

        // 채팅 메시지 리스트 끝에 추가 (FIFO 채팅 스트림 유지)
        Long newSize = redisTemplate.opsForList().rightPush(key, message);
        
        log.info("[LIVE][CHAT] 💾 메시지 저장 완료: key={}, 저장 후 총 개수={}", key, newSize);

        // 채팅 기록은 24시간 동안만 유지 (자동 삭제)
        redisTemplate.expire(key, 24, TimeUnit.HOURS);
    }

    /**
     * 최근 채팅 기록 조회
     * ------------------------------------------------------------------
     * - Redis List의 끝에서부터 limit 만큼 가져옴
     * - 예: limit = 50 → 최근 50개 메시지 반환
     *
     * @param liveSeq 방송 ID
     * @param limit 조회할 메시지 개수
     * @return 채팅 메시지 리스트 (최신 순)
     */
    public List<LiveChatMessageResponseDto> getChatHistory(Integer liveSeq, int limit) {

        String key = "live:chat:" + liveSeq;

        // 전체 메시지 개수 확인
        Long size = redisTemplate.opsForList().size(key);
        if (size == null || size == 0) return new ArrayList<>();

        // 최근 limit 개의 범위 계산
        //120 - 50 = 70 → 70번째부터 가져오라는 의미
        long start = Math.max(0, size - limit);

        // Redis에서 해당 범위의 메시지 조회
        // -1 은 Redis에서 "마지막 요소" 를 의미함.
        List<Object> messages = redisTemplate.opsForList().range(key, start, -1);
        if (messages == null) return new ArrayList<>();

        // JSON → DTO 변환 (ObjectMapper 활용)
        return messages.stream()
                .map(m -> objectMapper.convertValue(m, LiveChatMessageResponseDto.class))
                .toList();
    }

}
