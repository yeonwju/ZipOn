package ssafy.a303.backend.user.dto.request;

public record VerifyUserRequest(
        String name,
        String birth,
        String tel
) {
}
