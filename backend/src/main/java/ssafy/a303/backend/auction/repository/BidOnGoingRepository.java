package ssafy.a303.backend.auction.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.common.helper.DataSerializer;

import java.util.Set;

@Repository
public class BidOnGoingRepository {
    private static final String KEY_FORMAT = "bid::auction::%s";
    private final StringRedisTemplate redis;

    public BidOnGoingRepository(@Qualifier("bidRedisTemplate") StringRedisTemplate redis) {
        this.redis = redis;
    }

    // 저장
    public void updateScore(BidEventMessage message) {
        String json = DataSerializer.serialize(message);
        redis.opsForZSet().add(
                generateKey(message.auctionSeq()),
                String.valueOf(json),
                message.amount().doubleValue()
        );
    }

    // 전체 조회
    public Set<String> getAllUsers(Integer auctionSeq) {
        return redis.opsForZSet().reverseRange(
                generateKey(auctionSeq),
                0,
                -1
        );
    }

    // TOP N 조회
    public Set<String> getTopUsers(Integer auctionSeq, int limit) {
        return redis.opsForZSet().reverseRange(
                generateKey(auctionSeq),
                0,
                limit - 1
        );
    }

    // TOP N 이후 조회
    public Set<String> getRestUsers(Integer auctionSeq, int limit) {
        return redis.opsForZSet().reverseRange(
                generateKey(auctionSeq),
                limit,
                -1
        );
    }

    private String generateKey(int auctionSeq) {
        return KEY_FORMAT.formatted(auctionSeq);
    }
}
