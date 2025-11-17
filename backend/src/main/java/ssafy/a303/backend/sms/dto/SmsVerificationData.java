package ssafy.a303.backend.sms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsVerificationData {
    private String code;
    private String name;
    private String tel;
    private String birth;
}
