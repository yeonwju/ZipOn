package ssafy.a303.backend.sms.service;

import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.service.DefaultMessageService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;

@Service
@RequiredArgsConstructor
public class SmsService {

    @Value("${solapi.key}")
    String solapiKey;
    @Value("${solapi.secret-key}")
    String solapiSecretKey;
    @Value("${solapi.tel}")
    String solapiTel;
    DefaultMessageService messageService;

    private static String randomCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int rand = (int) (Math.random() * 26) + 65;
            sb.append((char) rand);
        }
        return sb.toString();
    }

    @PostConstruct
    void init() {
        this.messageService = SolapiClient.INSTANCE.createInstance(solapiKey, solapiSecretKey);
    }

    public void send(int userSeq, String tel) {
        if (sendAble(userSeq)) throw new CustomException(ErrorCode.EXTERNAL_API_LIMIT);

        Message message = new Message();
        message.setFrom(solapiTel);
        message.setTo(tel);
        String code = randomCode();
        message.setText(String.format("[집온] 인증 번호입니다. %s", code));
        try {
            messageService.send(message);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, e);
        }
        throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "핸드폰 외부 API 오류");
    }

    // redis 연결 후 사용할 예정
    private boolean sendAble(int userSeq) {
        return true;
    }

    private void saveCode(int userSeq, String tel, String code) {

    }

}
