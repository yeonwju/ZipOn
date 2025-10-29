package ssafy.a303.backend.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ssafy.a303.backend.security.jwt.service.JWTProvider;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 퍼블릭/인증 시작 경로는 스킵
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/v1/public/") || uri.startsWith("/oauth2/")) {
            filterChain.doFilter(request, response);
            return;
        }
        // token 읽기
        String token = null;
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        if (token == null && request.getCookies() != null) {
            for (var c : request.getCookies()) {
                if ("AT".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token != null && jwtProvider.isTokenValid(token)) {
            int userSeq = jwtProvider.getSubject(token);
            String role = jwtProvider.getRole(token);
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