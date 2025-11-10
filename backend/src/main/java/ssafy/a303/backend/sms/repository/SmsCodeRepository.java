package ssafy.a303.backend.sms.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class SmsCodeRepository {
    private static final String KEY_FORMAT = "sms::user::%s::code";
    private final StringRedisTemplate redisTemplate;

    public String read(int userSeq) {
        return redisTemplate.opsForValue().get(generateKey(userSeq));
    }

    public void save(int userSeq, String code, Duration ttl) {
        String key = generateKey(userSeq);
        redisTemplate.opsForValue().set(key, code, ttl);
    }

    public void delete(int userSeq){
        redisTemplate.delete(generateKey(userSeq));
    }

    private String generateKey(int userSeq) {
        return KEY_FORMAT.formatted(userSeq);
    }
}
