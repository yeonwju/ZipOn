package ssafy.a303.backend.user.dto.response;

public record MeResponseDTO(
        String email,
        String nickname,
        String name,
        String tel,
        String birth,
        String profileImg,
        String Role,
        boolean isVerified,
        boolean isBroker
) {
}
