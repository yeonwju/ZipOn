package ssafy.a303.backend.auction.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.common.helper.KoreaClock;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Repository
public class AuctionInProgressRepository {
    private static final String KEY_FORMAT = "auction-in-progress::auction::%s";
    private final StringRedisTemplate redis;

    public AuctionInProgressRepository(@Qualifier("bidRedisTemplate") StringRedisTemplate redis) {
        this.redis = redis;
    }

    public void enrollAuctionInProgress(int auctionSeq) {
        redis.opsForValue().setIfAbsent(generateKey(auctionSeq), String.valueOf(auctionSeq), life());
    }

    public boolean checkAuctionInProgress(int auctionSeq) {
        return redis.opsForValue().get(generateKey(auctionSeq)) != null;
    }

    private Duration life() {
        LocalDateTime now = LocalDateTime.now(KoreaClock.getClock());
        LocalDateTime end = LocalDateTime.of(LocalDate.now(KoreaClock.getClock()).plusDays(1), LocalTime.of(11, 59, 59));
        return Duration.between(now, end);
    }

    private String generateKey(int auctionSeq) {
        return KEY_FORMAT.formatted(auctionSeq);
    }
}
