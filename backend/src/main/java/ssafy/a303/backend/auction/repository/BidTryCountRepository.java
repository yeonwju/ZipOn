package ssafy.a303.backend.auction.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BidTryCountRepository {

    private static final String KEY_FORMAT = "bid-try::auction::%s";
    private final StringRedisTemplate redis;

    public BidTryCountRepository(@Qualifier("bidRedisTemplate") StringRedisTemplate redis) {
        this.redis = redis;
    }

    public boolean tryFirstBid(int auctionSeq, int userSeq) {
        String key = generateKey(auctionSeq);
        String member = String.valueOf(userSeq);

        Long result = redis.opsForSet().add(key, member);
        return result != null && result == 1L;
    }

    private String generateKey(int auctionSeq) {
        return KEY_FORMAT.formatted(auctionSeq);
    }
    public void deleteKey(int auctionSeq){
        redis.delete(generateKey(auctionSeq));
    }
}
