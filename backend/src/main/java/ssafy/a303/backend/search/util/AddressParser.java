package ssafy.a303.backend.search.util;

import ssafy.a303.backend.search.dto.AddressParts;

import java.util.ArrayList;
import java.util.List;

public class AddressParser {

    private AddressParser() {}

    public static AddressParts parse(String address) {
        if(address == null || address.isBlank()) {
            return AddressParts.builder().build();
        }

        // 정규화: 앞뒤 공백 제거 + 쉽표/괄호 제거
        String norm = normalize(address);

        // 토큰화: 빈 토큰 제거
        List<String> tokens = tokenize(norm);

        String si = null, gu = null, dong = null;

        // 시/구/동 순서대로 확인
        // 광역단위는 넘어감
        for(int i = 0; i<tokens.size(); i++) {
            String t = tokens.get(i);

            // 시
            if(si == null && endsWithSuffix(t, "시") && !endsWithSuffix(t, "시청")) {
                si = t;
                continue;;
            }

            // 구
            if (si != null && gu == null && endsWithSuffix(t, "구")) {
                gu = t;
                continue;
            }

            // 동
            if (si != null && dong == null && endsWithSuffix(t, "동")) {
                dong = t;
            }
        }
        return AddressParts.builder()
                .si(si)
                .gu(gu)
                .dong(dong)
                .build();
    }

    // ===== helpers =====

    private static String normalize(String s) {
        // 괄호 내용/쉼표/중복공백 제거
        String noParens = s.replaceAll("\\(.*?\\)", " ");
        String noCommas = noParens.replace(',', ' ');
        String collapsed = noCommas.replaceAll("\\s+", " ").trim();
        // 토큰 끝에 붙는 호/동/구 뒤의 특수문자 제거를 위해 말단 구두점 제거
        return collapsed.replaceAll("[.;:]+$", "");
    }

    private static List<String> tokenize(String s) {
        String[] raw = s.split("\\s+");
        List<String> out = new ArrayList<>(raw.length);
        for (String r : raw) {
            String t = r.trim();
            if (t.isEmpty()) continue;
            // 말단 구두점/특수기호 제거 (예: "강남구," -> "강남구")
            t = t.replaceAll("[,;:]+$", "");
            out.add(t);
        }
        return out;
    }

    private static boolean endsWithSuffix(String token, String suffix) {
        if (token == null) return false;
        // 도(…도)는 시/구/동 후보에서 제외
        if (token.endsWith("도")) return false;
        return token.endsWith(suffix);
    }
}
