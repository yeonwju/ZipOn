package ssafy.a303.backend.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ssafy.a303.backend.security.filter.JWTFilter;
import ssafy.a303.backend.security.handler.GoogleOAuthSuccessHandler;
import ssafy.a303.backend.security.oauth.service.CustomOauth2UserService;
import ssafy.a303.backend.security.oauth.service.CustomOidcUserService;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTFilter jwtFilter;
    private final CustomOauth2UserService customOauth2UserService; // KKAKO 등 비표준
    private final CustomOidcUserService customOidcUserService; // GOOGLE, NAVER 표준
    private final GoogleOAuthSuccessHandler googleOAuthSuccessHandler;
    private @Value("${frontUrl}") String frontUrl;

    @Bean
    public RequestCache requestCache() {
        HttpSessionRequestCache cache = new HttpSessionRequestCache();
        cache.setCreateSessionAllowed(true); // ← 보호자원 접근 시 SavedRequest 저장 허용
        return cache;
    }

    @Bean
    public CorsConfigurationSource ccfs() {
        // ┌─── 설정 ───┐
        List<String> methods = List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
        List<String> headers = List.of("*");
        // └─── 설정 ───┘
        // 어떤 config인지 설정
        CorsConfiguration ccf = new CorsConfiguration();
        ccf.addAllowedOrigin(frontUrl);
        ccf.setAllowedMethods(methods);
        ccf.setAllowedHeaders(headers);
        ccf.setAllowCredentials(true);
        // 위에서 정의한 config를 어디에 적용할지 설정
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", ccf);

        return src;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf.disable()) // 시큐리티 기본 로그인 기능 끄기
                .cors(cors -> cors.configurationSource(ccfs())) // cors
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // JSESSIONID 생성 못하도록
                .requestCache(rc -> rc.requestCache(requestCache()))
                .authorizeHttpRequests(auth -> auth // URL 인가 규칙
                        .requestMatchers(
                                "/api/v1/public/**",
                                "/oauth2/**", // google OAuth 시작점
                                "/login/oauth2/**", // google OAuth 콜백
                                // Swagger & Health Check
                                "/swagger-ui/**",
                                "/api-docs/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/actuator/health",
                                "/api/actuator/health",
                                "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(
                        oauth -> oauth
                                .userInfoEndpoint(userInfo -> userInfo
                                        .userService(customOauth2UserService)
                                        .oidcUserService(customOidcUserService)
                                )
                                .successHandler(googleOAuthSuccessHandler)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}