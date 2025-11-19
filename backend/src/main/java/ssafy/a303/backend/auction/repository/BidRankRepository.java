package ssafy.a303.backend.auction.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.common.helper.DataSerializer;

import java.util.*;

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
                message.amount().doubleValue()
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

    public BidEventMessage getUser(Integer auctionSeq, int userSeq) {
        Set<String> set = redis.opsForZSet().reverseRange(generateKey(auctionSeq), 0, -1);
        if (set == null || set.isEmpty()) {
            return null;
        }

        for (String msg : set) {
            BidEventMessage data = DataSerializer.deserialize(msg, BidEventMessage.class);
            if (data.userSeq() == userSeq) {
                return data;
            }
        }
        return null;
    }

    private String generateKey(int auctionSeq) {
        return KEY_FORMAT.formatted(auctionSeq);
    }

    public void deleteKey(int auctionSeq) {
        redis.delete(generateKey(auctionSeq));
    }
}
