package ssafy.a303.backend.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MeResponseDTO", description = "내 정보 응답 DTO")
public record MeResponseDTO(
        @Schema(description = "이메일", example = "user@example.com")
        String email,
        @Schema(description = "닉네임", example = "문준호")
        String nickname,
        @Schema(description = "이름", example = "문준호")
        String name,
        @Schema(description = "전화번호", example = "01012345678")
        String tel,
        @Schema(description = "생년월일(YYYY-MM-DD)", example = "1996-06-01")
        String birth,
        @Schema(description = "프로필 이미지 URL", example = "https://.../profile.png")
        String profileImg,
        @Schema(description = "역할(권한)", example = "USER")
        String role,
        @Schema(description = "본인 인증 완료 여부", example = "true")
        boolean isVerified,
        @Schema(description = "중개사 등록 여부", example = "false")
        boolean isBroker
) {
}
