package ssafy.a303.backend.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "휴대폰 인증번호 검증 요청 DTO")
public record CodeRequest(
        @Schema(description = "인증번호(6자리 영문 대문자)", example = "ABCDXY")
        String code
) {
}
