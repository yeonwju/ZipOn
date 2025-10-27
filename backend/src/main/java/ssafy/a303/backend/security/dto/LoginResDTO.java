package ssafy.a303.backend.security.dto;

import lombok.*;

@Getter
@Setter
@Builder
public class LoginResDTO {
    String accessToken;
    String refreshToken;
}