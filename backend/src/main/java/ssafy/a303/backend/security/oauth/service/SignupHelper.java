package ssafy.a303.backend.security.oauth.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.finance.SSAFYAPI;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.user.entity.Role;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SignupHelper {

    private final UserRepository userRepository;
    private final SSAFYAPI ssafyapi;
    @Value("${ssafy.api.key}")
    private String apiKey;

    @Transactional
    public User Signup(String email, String name){
        // DB에서 계정 찾기
        Optional<User> optionalUser = userRepository.findUserByEmailAndDeletedAtIsNull(email);
        User user;
        if (optionalUser.isPresent()){ // 찾았다
            user = optionalUser.get();
        } else { // 못 찾았다
            // SSAFY OPENAPI 에서 계정 찾기 - body 생성
            Map<String, Object> body = new HashMap<>();
            body.put("userId", email);
            body.put("apiKey", apiKey);
            // SSAFY OPENAPI 에서 계정 찾기 - 검색
            Map<String, Object> search = ssafyapi.post("/member/search", null, body);
            String financeKey = null;
            if (search.containsKey("userKey")) {
                // ----------검색 성공 ---------
                financeKey = search.get("userKey").toString();
            } else {
                // SSAFY OPENAPI 에서 계정 찾기 - 등록
                // ----------검색 실패 ---------
                Map<String, Object> signup = ssafyapi.post("/member", null, body);
                if(search.containsKey("userKey")){
                    // ----------싸피 금융 api 등록 성공 ---------
                    financeKey = signup.get("userKey").toString();
                }
            }
            if(financeKey == null)
                throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);

            // DB에 저장
            user = User.builder()
                    .email(email)
                    .name(null)
                    .nickname(name)
                    .financeKey(financeKey)
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
        }
        return user;
    }

}
