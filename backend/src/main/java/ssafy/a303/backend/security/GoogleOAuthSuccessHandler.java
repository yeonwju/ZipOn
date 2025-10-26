package ssafy.a303.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.dto.ResponseDTO;
import ssafy.a303.backend.dto.user.LoginResDTO;
import ssafy.a303.backend.entity.user.Role;
import ssafy.a303.backend.entity.user.User;
import ssafy.a303.backend.repository.user.UserRepository;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class GoogleOAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTProvider jwtProvider;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

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

        TokenData tokenData = TokenData.builder()
                .userSeq(user.getUserSeq())
                .role(user.getRole().name())
                .build();

        String accessToken = jwtProvider.generateAccessToken(tokenData);
        String refreshToken = jwtProvider.generateRefreshToken(tokenData);

        LoginResDTO loginResDTO = LoginResDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

        var result = ResponseDTO.ok(loginResDTO, "로그인 성공");

        // ✅ JSON 응답
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpStatus.OK.value());
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}