package ssafy.a303.backend.common.helper;

import java.time.Clock;
import java.time.ZoneId;

public class KoreaClock {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final Clock CLOCK = Clock.system(KST);

    public static Clock getClock(){
        return CLOCK;
    }
}
