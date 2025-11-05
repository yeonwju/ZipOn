package ssafy.a303.backend.sms.service;

import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.dto.response.MultipleDetailMessageSentResponse;
import com.solapi.sdk.message.service.DefaultMessageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
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

    public MultipleDetailMessageSentResponse send(String tel) {
        try {
            Message message = new Message();
            message.setFrom(solapiTel);
            message.setTo(tel);
            message.setText(String.format("[집온] 인증 번호입니다. %s", randomCode()));

            MultipleDetailMessageSentResponse response = this.messageService.send(message);
            System.out.println(response);

            return response;
        } catch (Exception e) {
            e.fillInStackTrace();
        }
        return null;
    }
}
