package ssafy.a303.backend.security.jwt.token;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class TokenData {
    int userSeq;
    String role;
    String tokenType;
    Instant issueTime;
    String jti;
    long ver;
    // 사용자 정보
    String name;
    String tel;
    String birth;
}
