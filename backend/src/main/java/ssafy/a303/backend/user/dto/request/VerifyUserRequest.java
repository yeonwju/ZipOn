package ssafy.a303.backend.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "휴대폰 인증 요청 DTO")
public record VerifyUserRequest(
        @Schema(description = "이름", example = "문준호")
        String name,
        @Schema(description = "생년월일(YYYYMMDD)", example = "19960101")
        String birth,
        @Schema(description = "휴대폰 번호(숫자만)", example = "01012345678")
        String tel
) {
}
