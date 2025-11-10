package ssafy.a303.backend.sms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SmsVerificationData {
    private String code;
    private String name;
    private String tel;
    private String birth;
}
