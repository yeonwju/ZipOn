package ssafy.a303.backend.broker.dto.request;

import java.util.List;

public record CompanyStatusRequest(List<Business> businesses) {
    public record Business(
            String b_no,      // 사업자등록번호(10자리, 하이픈 제거)
            String start_dt,  // 개업일자(YYYYMMDD)
            String p_nm       // 대표자 성명
    ) {
    }
}
