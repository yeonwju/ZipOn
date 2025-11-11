package ssafy.a303.backend.security.jwt.token;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
@Getter
@Setter
@Builder
public class InstantData {
    private Instant issueTime;
    private Integer userSeq;
    // company
    private String taxSeq;
    private String ceo;
}
