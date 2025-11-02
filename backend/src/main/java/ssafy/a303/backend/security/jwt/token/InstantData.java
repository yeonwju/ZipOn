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
    private String taxSeq;      //b_no
    private String ceo;        //p_nm
}
