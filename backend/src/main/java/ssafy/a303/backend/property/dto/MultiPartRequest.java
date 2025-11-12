package ssafy.a303.backend.property.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

@Schema(description = "등기부등본 검증 요청 DTO")
public class MultiPartRequest {
    @Schema(description = "등기부등본 PDF 파일", type = "string", format = "binary", example = "file.pdf")
    private MultipartFile file;

    @Schema(description = "등기부 명의자 이름", example = "홍길동")
    private String regiNm;

    @Schema(description = "등기부 명의자 생년월일 (YYYYMMDD 형식)", example = "19950101")
    private String regiBirth;

    @Schema(description = "매물 주소", example = "서울특별시 강남구 역삼동 123-45")
    private String address;
}
