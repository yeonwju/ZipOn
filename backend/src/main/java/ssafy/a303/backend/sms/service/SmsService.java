package ssafy.a303.backend.sms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    @Value("${solapi.key}")
    private String solapiKey;
    @Value("${solapi.secret-key}")
    private String solapiSecretKey;

    public void send(String code){

    }
}
