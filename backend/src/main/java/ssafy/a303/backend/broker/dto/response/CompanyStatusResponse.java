package ssafy.a303.backend.broker.dto.response;

import java.util.List;

public record CompanyStatusResponse(List<Result> data){
    public record Result(
            String b_no,      // 사업자번호
            String b_stt,
            String b_stt_cd
    ) {}

    // 첫 번째 사업자 기준으로 진위 여부 반환
    public boolean isValid() {
        if (data == null || data.isEmpty()) return false;
        return "01".equals(data.get(0).b_stt_cd);
    }
}


