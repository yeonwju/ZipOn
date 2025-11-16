package ssafy.a303.backend.auction.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.common.helper.DataSerializer;

import java.util.Set;

@Repository
public class BidRankRepository {
    private static final String KEY_FORMAT = "bid::auction::%s";
    private final StringRedisTemplate redis;

    public BidRankRepository(@Qualifier("bidRedisTemplate") StringRedisTemplate redis) {
        this.redis = redis;
    }

    // 저장
    public void updateScore(BidEventMessage message) {
        String json = DataSerializer.serialize(message);
        redis.opsForZSet().add(
                generateKey(message.auctionSeq()),
                json,
                message.amount()
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

    public void deleteKey(int auctionSeq){
        redis.delete(generateKey(auctionSeq));
    }
}
