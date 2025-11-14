package ssafy.a303.backend.auction.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.auction.dto.request.BidEventMessage;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.sms.dto.SmsVerificationData;

import java.util.Set;

@Repository
public class BidOnGoingRepository {
    private static final String KEY_FORMAT = "bid::auction::%s";
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    public BidOnGoingRepository(
            @Qualifier("bidRedisTemplate") StringRedisTemplate redis,
            ObjectMapper objectMapper
    ) {
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    // 저장
    public void updateScore(BidEventMessage message) {
        String json = toJson(message);
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
                - 1
        );
    }

    private String generateKey(int auctionSeq) {
        return KEY_FORMAT.formatted(auctionSeq);
    }

    private String toJson(BidEventMessage data) {
        try {
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException e){
            throw new CustomException(ErrorCode.JSON_ERROR);
        }
    }
    private BidEventMessage fromJson(String json){
        try {
            return objectMapper.readValue(json, BidEventMessage.class);
        } catch (JsonProcessingException e){
            throw new CustomException(ErrorCode.JSON_ERROR);
        }
    }

}
