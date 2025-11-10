package ssafy.a303.backend.livestream.entity;

import jakarta.persistence.*;
import lombok.*;
import ssafy.a303.backend.auction.entity.Auction;
import ssafy.a303.backend.common.entity.BaseTimeEntity;
import ssafy.a303.backend.livestream.enums.LiveStreamStatus;
import ssafy.a303.backend.user.entity.User;

import java.time.LocalDateTime;


/**
 * 라이브 방송 (live_stream)
 * - ERD: live_seq(PK), auc_seq(FK), user_seq(FK), strm_url, title, status, vwr_cnt, chat_cnt, like_cnt, is_rec, start_at, end_at, chat_channel
 * - 상태(status): ENUM('LIVE','ENDED') → 자바 enum으로 매핑
 */
@Entity
@Table(name = "live_stream")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveStream extends BaseTimeEntity {

    /** live_seq INT PK (AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "live_seq")
    private Integer id;

    /** auc_seq FK → auction.auction_seq (경매와의 연결) */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "auc_seq", nullable = false)
    private Auction auction;

    /** user_seq FK → user.user_seq (방장/호스트) */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_seq", nullable = false)
    private User host;

    /** strm_url VARCHAR(500) NOT NULL : WebRTC/Media Server 세션 식별 경로/키 */
    @Column(name = "strm_url", nullable = false, length = 500)
    private String streamUrl;

    /** title VARCHAR(200) NOT NULL : 방송 제목 */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /** status ENUM('LIVE','ENDED') NOT NULL : 기본 LIVE */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private LiveStreamStatus status;

    /** vwr_cnt INT NOT NULL DEFAULT 0 : 누적 시청자 수(종료 시 기록) */
    @Column(name = "vwr_cnt", nullable = false)
    private Integer viewerCount = 0;

    /** chat_cnt INT NOT NULL DEFAULT 0 : 채팅 메시지 총합(종료 시 반영) */
    @Column(name = "chat_cnt", nullable = false)
    private Integer chatCount = 0;

    /** like_cnt INT NOT NULL DEFAULT 0 : 방송 중 받은 좋아요 수 */
    @Column(name = "like_cnt", nullable = false)
    private Integer likeCount = 0;

    /** is_rec BOOLEAN NOT NULL DEFAULT false : 녹화본 저장 여부 */
    @Column(name = "is_rec", nullable = false)
    private Boolean recorded = Boolean.FALSE;

    /** start_at / end_at : 방송 시작/종료 시각 */
    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    /** chat_channel VARCHAR(200) NOT NULL : 방송별 Redis 채널명 */
    @Column(name = "chat_channel", nullable = false, length = 200)
    private String chatChannel;


    /** 도메인 편의 메서드: 방송 종료 처리 */
    public void end(LocalDateTime endedAt, int finalViewerCount, int finalChatCount, int finalLikeCount) {
        this.status = LiveStreamStatus.ENDED;
        this.endAt = endedAt;
        this.viewerCount = finalViewerCount;
        this.chatCount = finalChatCount;
        this.likeCount = finalLikeCount;
    }
}
