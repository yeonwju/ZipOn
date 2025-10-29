package ssafy.a303.backend.security.handler;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.security.jwt.token.TokenData;
import ssafy.a303.backend.security.support.CookieFactory;
import ssafy.a303.backend.security.jwt.service.JWTProvider;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class GoogleOAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTProvider jwtProvider;
    private final CookieFactory cookieFactory;

    @Value("${frontUrl}")
    private String frontUrl;
    private final SavedRequestAwareAuthenticationSuccessHandler delegate =
            new SavedRequestAwareAuthenticationSuccessHandler();

    @PostConstruct
    void init(){
        delegate.setDefaultTargetUrl(frontUrl);
        delegate.setAlwaysUseDefaultTargetUrl(false);
    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OAuth2User p = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> map = p.getAttributes();
        Integer userSeq = p.getAttribute("userSeq");
        String role     = p.getAttribute("role");
        // ---- 쿠키 발급 ----
        TokenData tokenData = TokenData.builder()
                .userSeq(userSeq)
                .role(role)
                .build();

        String accessToken = jwtProvider.generateAccessToken(tokenData);
        String refreshToken = jwtProvider.generateRefreshToken(tokenData);

        Cookie AccessCookie = cookieFactory.accessCookie(accessToken);
        Cookie RefreshCookie = cookieFactory.refreshCookie(refreshToken);

        response.addCookie(AccessCookie);
        response.addCookie(RefreshCookie);

        // ---- 이동 ----
        delegate.onAuthenticationSuccess(request,response,authentication);
    }
}