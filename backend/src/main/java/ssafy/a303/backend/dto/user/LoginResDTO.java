package ssafy.a303.backend.dto.user;

import lombok.*;

@Getter
@Setter
@Builder
public class LoginResDTO {
    String accessToken;
    String refreshToken;
}