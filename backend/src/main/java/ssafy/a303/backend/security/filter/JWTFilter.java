package ssafy.a303.backend.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ssafy.a303.backend.security.jwt.service.JWTProvider;
import ssafy.a303.backend.security.jwt.token.TokenData;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }

//        log.info("URI: {}, IP: {}", request.getRequestURI(), ip);

        // 퍼블릭/인증 시작 경로는 스킵
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/v1/public/") || uri.startsWith("/oauth2/")) {
            filterChain.doFilter(request, response);
            return;
        }
        // ---- token ----
        String accessToken = null;
        // ---- dev 확인용 ---
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            accessToken = header.substring(7);
        }
        // ---- Cookie ----
        if (accessToken == null && request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("AT".equals(c.getName())) {
                    accessToken = c.getValue();
                    break;
                }
            }
        }
        if (accessToken != null && jwtProvider.isTokenValid(accessToken)) {
            TokenData tokenData = jwtProvider.parseToken(accessToken);
            int userSeq = tokenData.getUserSeq();
            String role = tokenData.getRole();
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userSeq, // principal
                            null, // credentials
                            Collections.singletonList(authority)
                    );

            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}