package ssafy.a303.backend.security.handler;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.security.jwt.entity.TokenPair;
import ssafy.a303.backend.security.jwt.repository.TokenPairRepository;
import ssafy.a303.backend.security.jwt.service.JWTProvider;
import ssafy.a303.backend.security.jwt.token.TokenData;
import ssafy.a303.backend.security.support.CookieFactory;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleOAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTProvider jwtProvider;
    private final CookieFactory cookieFactory;
    private final TokenPairRepository tokenPairRepository;
    private final SavedRequestAwareAuthenticationSuccessHandler delegate =
            new SavedRequestAwareAuthenticationSuccessHandler();
    @Value("${frontUrl}")
    private String frontUrl;
    private final RequestCache requestCache = createRequestCache();

    private RequestCache createRequestCache() {
        HttpSessionRequestCache cache = new HttpSessionRequestCache();
        cache.setCreateSessionAllowed(true); // 세션 없으면 만들어서 저장 허용
        return cache;
    }

    @PostConstruct
    void init() {
        delegate.setDefaultTargetUrl(frontUrl);
        delegate.setAlwaysUseDefaultTargetUrl(false);
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        OAuth2User p = (OAuth2User) authentication.getPrincipal();
        Integer userSeq = p.getAttribute("userSeq");
        String role = p.getAttribute("role");
        // ---- 쿠키 발급 ----
        TokenData tokenData = TokenData.builder()
                .userSeq(userSeq)
                .role(role)
                .issueTime(Instant.now())
                .build();

        String accessJti = UUID.randomUUID().toString();
        tokenData.setJti(accessJti);
        String accessToken = jwtProvider.generateAccessToken(tokenData);

        String refreshJti = UUID.randomUUID().toString();
        tokenData.setJti(refreshJti);
        String refreshToken = jwtProvider.generateRefreshToken(tokenData);

        TokenPair tokenPair = TokenPair.builder()
                .accessJti(accessJti)
                .refreshJti(refreshJti)
                .build();

        tokenPairRepository.save(tokenPair);

        Cookie AccessCookie = cookieFactory.accessCookie(accessToken);
        Cookie RefreshCookie = cookieFactory.refreshCookie(refreshToken);

        response.addCookie(AccessCookie);
        response.addCookie(RefreshCookie);

        // ---- 이동 ----
        log.info(String.format("frontUrl : %s", frontUrl));
        SavedRequest saved = requestCache.getRequest(request, response);
        if (saved != null) {
            String[] param = saved.getParameterValues("redirect_url");
            if (param != null && param.length > 0) {
                log.info(String.format("frontUrl: %s, redirect_url: %s",frontUrl, param[0]));
                response.sendRedirect(String.format("%s%s", frontUrl, param[0]));
                return;
            }
        }
        delegate.onAuthenticationSuccess(request, response, authentication);
    }
}