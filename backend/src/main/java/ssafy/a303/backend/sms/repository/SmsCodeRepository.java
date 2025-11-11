package ssafy.a303.backend.sms.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.sms.dto.SmsVerificationData;

import java.time.Duration;

@Repository
public class SmsCodeRepository {
    private static final String KEY_FORMAT = "sms::user::%s::verify";
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private static final Duration TTL = Duration.ofMinutes(5);

    public SmsCodeRepository(
            @Qualifier("smsRedisTemplate") StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper
    ) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public void save(int userSeq, SmsVerificationData data) {
        String key = generateKey(userSeq);
        String json = toJson(data);
        redisTemplate.opsForValue().set(key, json, TTL);
    }

    public SmsVerificationData read(int userSeq) {
        String json =  redisTemplate.opsForValue().get(generateKey(userSeq));
        if(json == null){
            return null;
        }
        return fromJson(json);
    }

    public void delete(int userSeq) {
        redisTemplate.delete(generateKey(userSeq));
    }

    private String generateKey(int userSeq) {
        return KEY_FORMAT.formatted(userSeq);
    }

    private String toJson(SmsVerificationData data) {
        try {
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException e){
            throw new CustomException(ErrorCode.JSON_ERROR);
        }
    }
    private SmsVerificationData fromJson(String json){
        try {
            return objectMapper.readValue(json, SmsVerificationData.class);
        } catch (JsonProcessingException e){
            throw new CustomException(ErrorCode.JSON_ERROR);
        }
    }
}
