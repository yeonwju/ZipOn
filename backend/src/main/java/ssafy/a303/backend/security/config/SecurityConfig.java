package ssafy.a303.backend.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ssafy.a303.backend.security.filter.GoogleOAuthSuccessHandler;
import ssafy.a303.backend.security.filter.JWTFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTFilter jwtFilter;
    private final GoogleOAuthSuccessHandler googleOAuthSuccessHandler;

    private final List<String> origins = List.of("http://localhost:3000");
    private final List<String> methods = List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    private final List<String> headers = List.of("*");

    @Bean
    public CorsConfigurationSource ccfs() {
        // 어떤 config인지 설정
        CorsConfiguration ccf = new CorsConfiguration();
        ccf.setAllowedOrigins(origins);
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
                .authorizeHttpRequests(auth -> auth // URL 인가 규칙
                        .requestMatchers(
                                "/api/v1/public/**",
                                "/oauth2/**", // google OAuth 시작점
                                "/login/oauth2/**" // google OAuth 콜백
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(
                        oauth -> oauth
                                .successHandler(googleOAuthSuccessHandler)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}