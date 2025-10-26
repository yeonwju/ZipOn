package ssafy.a303.backend.dto.user;

import lombok.Builder;

@Builder
public class LoginResDTO {
    String accessToken;
    String refreshToken;
}