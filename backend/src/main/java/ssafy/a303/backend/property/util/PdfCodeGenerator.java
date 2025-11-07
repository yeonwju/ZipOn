package ssafy.a303.backend.property.util;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class PdfCodeGenerator {

    private static final SecureRandom RND = new SecureRandom();
    private static final DateTimeFormatter TS = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
    private static final char[] BASE36 = "1234567890abcdefghijklmnopqrstuvwxyz".toCharArray();

    private PdfCodeGenerator() {}

    public static String next(String prefix) {
        String ts = LocalDateTime.now().format(TS);
        String rand = randomBase36(6);
        return String.format("%s-%s-%s", prefix, ts, rand).toUpperCase();
    }

    private static String randomBase36(int len) {
        if (len <= 0) throw new IllegalArgumentException("len must be positive");
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            int idx = RND.nextInt(36); // 36는 항상 양수 bound
            sb.append(BASE36[idx]);
        }
        return sb.toString();
    }
}
