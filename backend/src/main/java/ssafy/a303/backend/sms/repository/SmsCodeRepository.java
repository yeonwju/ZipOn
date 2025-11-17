package ssafy.a303.backend.sms.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import ssafy.a303.backend.common.helper.DataSerializer;
import ssafy.a303.backend.sms.dto.SmsVerificationData;

import java.time.Duration;

@Repository
public class SmsCodeRepository {
    private static final String KEY_FORMAT = "sms::user::%s::verify";
    private static final Duration TTL = Duration.ofMinutes(5);
    private final StringRedisTemplate redisTemplate;

    public SmsCodeRepository(@Qualifier("smsRedisTemplate") StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void save(int userSeq, SmsVerificationData data) {
        String key = generateKey(userSeq);
        String json = DataSerializer.serialize(data);
        redisTemplate.opsForValue().set(key, json, TTL);
    }

    public SmsVerificationData read(int userSeq) {
        String json = redisTemplate.opsForValue().get(generateKey(userSeq));
        if (json == null) {
            return null;
        }
        return DataSerializer.deserialize(json, SmsVerificationData.class);
    }

    public void delete(int userSeq) {
        redisTemplate.delete(generateKey(userSeq));
    }

    private String generateKey(int userSeq) {
        return KEY_FORMAT.formatted(userSeq);
    }

}
