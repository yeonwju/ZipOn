package ssafy.a303.backend.security;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TokenData {
    int userSeq;
    String role;
    long ver;
}
