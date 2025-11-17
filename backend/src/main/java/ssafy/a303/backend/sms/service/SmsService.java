package ssafy.a303.backend.sms.service;

import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.service.DefaultMessageService;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.sms.dto.SmsVerificationData;
import ssafy.a303.backend.sms.repository.SmsCodeRepository;
import ssafy.a303.backend.sms.repository.SmsLimitRepository;
import ssafy.a303.backend.user.dto.request.VerifyUserRequest;
import ssafy.a303.backend.user.dto.response.MeResponseDTO;
import ssafy.a303.backend.user.entity.Role;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final SmsCodeRepository smsCodeRepository;
    private final SmsLimitRepository smsLimitRepository;
    private final UserRepository userRepository;
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

    private String send(int userSeq, String tel) {
        Message message = new Message();
        message.setFrom(solapiTel);
        message.setTo(tel);
        String code = randomCode();
        message.setText(String.format("[집온] 인증 번호입니다. %s", code));
        try {
            messageService.send(message);
            return code;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, e);
        }
    }

    // redis 연결 후 사용할 예정
    public void sendAndSave(int userSeq, VerifyUserRequest request) {
        boolean result = smsLimitRepository.increaseAndCheck(userSeq);
        if (!result) throw new CustomException(ErrorCode.EXTERNAL_API_LIMIT);
        String code = send(userSeq, request.tel());
        SmsVerificationData data = SmsVerificationData
                .builder()
                .tel(request.tel())
                .birth(request.birth())
                .name(request.name())
                .code(code)
                .build();
        smsCodeRepository.save(userSeq, data);
    }

    @Transactional
    public MeResponseDTO verify(int userSeq, String code) {
        SmsVerificationData data = smsCodeRepository.read(userSeq);
        if (data == null) throw new CustomException(ErrorCode.SMS_NOT_SENDED);
        if (!data.getCode().equalsIgnoreCase(code)) throw new CustomException(ErrorCode.CODE_NOT_VALID);
        Optional<User> opt = userRepository.findById(userSeq);
        if (opt.isEmpty()) throw new CustomException(ErrorCode.USER_NOT_FOUND);
        User user = opt.get();
        user.setName(data.getName());
        user.setBirth(data.getBirth());
        user.setTel(data.getTel());
        smsCodeRepository.delete(userSeq);

        return new MeResponseDTO(
                userSeq,
                user.getEmail(),
                user.getNickname(),
                user.getName(),
                user.getTel(),
                user.getBirth(),
                user.getProfileImg(),
                user.getRole().name(),
                true,
                user.getRole().equals(Role.BROKER)
        );
    }
}
