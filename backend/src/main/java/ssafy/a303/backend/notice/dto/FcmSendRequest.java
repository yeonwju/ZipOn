package ssafy.a303.backend.notice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FcmSendRequest {
    private String token;
    private String title;
    private String body;
}
