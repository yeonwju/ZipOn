package ssafy.a303.backend.security.oauth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import ssafy.a303.backend.security.oauth.principal.CustomOidcPrincipal;
import ssafy.a303.backend.user.entity.Role;
import ssafy.a303.backend.user.entity.User;
import ssafy.a303.backend.user.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        // idToken에서 email과 name을 가져옴
        String email = oidcUser.getAttributes().get("email").toString();
        String name = oidcUser.getAttributes().get("name").toString();

        Optional<User> optionalUser = userRepository.findUserByEmailAndDeletedAtIsNull(email);
        User user;
        if (optionalUser.isEmpty()) {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .nickname(name)
                    .role(Role.OAUTH)
                    .build();
            userRepository.save(user);
        } else {
            user = optionalUser.get();
        }

        String nameAttributeKey = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // DefaultOidcUser를 반환 (OidcUser를 확장)
        OidcUser base = new DefaultOidcUser(
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo(),
                nameAttributeKey
        );

        // Principal에 도메인 정보 심기
        Map<String, Object> extra = new HashMap<>(oidcUser.getAttributes());
        extra.put("userSeq", user.getUserSeq());
        extra.put("role", user.getRole().name());

        return new CustomOidcPrincipal(base, extra);
    }
}
