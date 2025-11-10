package ssafy.a303.backend.sms.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Repository
@RequiredArgsConstructor
public class SmsLimitRepository {
    private static final String KEY_FORMAT = "sms::user::%s::date::%s::count";
    private final int LIMIT = 3;
    private final StringRedisTemplate redisTemplate;

    public boolean increaseAndCheck(int userSeq){
        String key = generateKey(userSeq);
        Long count = redisTemplate.opsForValue().increment(key);
        if(count == 1L){
            redisTemplate.expire(key, life());
        }
        return count <= LIMIT;
    }


    private String generateKey(int userSeq) {
        String YYMMDD = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        return KEY_FORMAT.formatted(userSeq);
    }
    private Duration life(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.of(23, 59, 59));
        return Duration.between(now, end);
    }
}
