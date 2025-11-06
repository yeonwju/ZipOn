package ssafy.a303.backend.common.helper;

import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;

public class KoreaClock {
    private static Clock kClock() {
        return Clock.system(ZoneId.of("Asia/Seoul"));
    }

    public static Timestamp now() {
        return Timestamp.from(kClock().instant());
    }

    public static LocalDate today() {
        return LocalDate.now(kClock());
    }
}
