package ssafy.a303.backend.livestream.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.livestream.entity.LiveStream;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;
import ssafy.a303.backend.livestream.repository.LiveStreamRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 라이브 방송 스케줄러
 * 
 * - 1시간 이상 방송된 라이브를 자동으로 종료합니다.
 * - 1분마다 실행됩니다.
 */
@Component
@RequiredArgsConstructor
@Log4j2
public class LiveStreamScheduler {

    private final LiveStreamRepository liveStreamRepository;
    private final LiveService liveService;

    /**
     * 1시간 이상 방송된 라이브를 자동 종료
     * 매 1분마다 실행 (cron: 초 분 시 일 월 요일)
     */
    @Scheduled(cron = "0 * * * * *") // 매 분 0초에 실행
    public void autoCloseLongRunningLives() {
        try {
            // 1시간 전 시간 계산
            LocalDateTime oneHourAgo = LocalDateTime.now().minusMinutes(1);

            // LIVE 상태이면서 시작 시간이 1시간 이상 지난 방송 조회
            List<LiveStream> expiredLives = liveStreamRepository
                    .findByStatusAndStartAtBefore(LiveStreamStatus.LIVE, oneHourAgo);

            if (expiredLives.isEmpty()) {
                return; // 종료할 방송이 없으면 로그 안 남김
            }

            log.info("[SCHEDULER] 1시간 초과 라이브 방송 {}개 발견. 자동 종료 시작...", expiredLives.size());

            for (LiveStream live : expiredLives) {
                try {
                    // LiveService의 종료 메서드 호출
                    liveService.endLive(live.getId(), live.getHost().getUserSeq());
                    
                    log.info("[SCHEDULER] 라이브 자동 종료 성공: liveSeq={}, title={}, 방송 시간={} 분", 
                            live.getId(), 
                            live.getTitle(),
                            java.time.Duration.between(live.getStartAt(), LocalDateTime.now()).toMinutes());
                } catch (Exception e) {
                    log.error("[SCHEDULER] 라이브 자동 종료 실패: liveSeq={}, error={}", 
                            live.getId(), e.getMessage(), e);
                }
            }

            log.info("[SCHEDULER] 1시간 초과 라이브 자동 종료 완료: 총 {}개", expiredLives.size());
        } catch (Exception e) {
            log.error("[SCHEDULER] 라이브 자동 종료 스케줄러 실행 중 오류: {}", e.getMessage(), e);
        }
    }
}

