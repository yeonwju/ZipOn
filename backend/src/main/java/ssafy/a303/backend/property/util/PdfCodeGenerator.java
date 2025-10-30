package ssafy.a303.backend.property.util;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class PdfCodeGenerator {

    private static final SecureRandom RND = new SecureRandom();
    private static final DateTimeFormatter TS = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private PdfCodeGenerator() {}

    public static String next(String prefix) {
        String ts = LocalDateTime.now().format(TS);
        String rand = toBase36(RND.nextInt(36 * 36 * 36 * 36 * 36 * 36));
        return String.format("%s-%s-%s", prefix, ts, padLeft(rand, 6, '0')).toUpperCase();
    }

    private static String toBase36(int n) {
        return Integer.toString(Math.abs(n), 36);
    }

    private static String padLeft(String s, int len, char fill) {
        if(s.length() >= len) return s;
        StringBuilder sb = new StringBuilder(len);
        for (int i = s.length(); i < len; i++) sb.append(fill);
        sb.append(s);
        return sb.toString();
    }
}
