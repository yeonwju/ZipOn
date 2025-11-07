package ssafy.a303.backend.broker.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BiznoResponse(int resultCode, List<Result> items) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Result(
            String company,     //회사명
            String bno,         //사업자등록번호
            String cno,
            String bsttcd,
            String bstt,
            String TaxTypeCd,
            String taxtype,
            String EndDt        // 폐업일 YYYYMMDD
    ){}
}
