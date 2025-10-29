package ssafy.a303.backend.security.oauth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.user.entity.Role;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // ---- 유저 조회 또는 회원가입 ----
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> optionalUser = userRepository.findUserByEmailAndDeletedAtIsNull(email);
        User user;
        if (optionalUser.isEmpty()) {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .nickname(name)
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
        } else {
            user = optionalUser.get();
        }
        // Principal에 도메인 정보 심기
        Map<String, Object> attrs = new HashMap<>(oAuth2User.getAttributes());
        attrs.put("userSeq", user.getUserSeq());
        attrs.put("role", user.getRole().name());
        // 식별자
        String nameAttributeKey = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                attrs,
                nameAttributeKey
        );
    }
}
