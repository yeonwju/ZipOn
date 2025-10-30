package ssafy.a303.backend.finace.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDTO {
    // success reply
    String userId;
    String userName;
    String institutionCode;
    String userKey;
    String created;
    String modified;
    // error reply
    String responseCode;
    String responseMessage;
}
