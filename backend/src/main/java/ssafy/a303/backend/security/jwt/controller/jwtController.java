package ssafy.a303.backend.security.jwt.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.dto.ResponseDTO;
import ssafy.a303.backend.security.jwt.service.JWTProvider;
import ssafy.a303.backend.security.support.CookieFactory;

@RestController
@RequestMapping("/api/v1/jwt")
@RequiredArgsConstructor
public class jwtController {

    private final JWTProvider jwtProvider;
    private final CookieFactory cookieFactory;

    @PostMapping("/refresh") // getMapping 맞나?
    public ResponseEntity<ResponseDTO<Void>> getNewAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = null;
        String refreshToken = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("AT".equals(c.getName())) accessToken = c.getValue();
                else if ("RT".equals(c.getName())) refreshToken = c.getValue();
            }
        }
        if (accessToken == null || refreshToken == null) {
            return ResponseDTO.unauthorized("Bad Cookies");
        }
        if (!jwtProvider.isTokenValid(accessToken))
            return ResponseDTO.unauthorized("Bad Access Token");
        if(!jwtProvider.isTokenValid(refreshToken))
            return ResponseDTO.unauthorized("Bad Refresh Token");
        String[] tokens = jwtProvider.getNewAccessTokenByRefreshToken(accessToken, refreshToken);
        Cookie accessCookie = cookieFactory.accessCookie(tokens[0]);
        Cookie refreshCookie = cookieFactory.refreshCookie(tokens[1]);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        return ResponseDTO.ok(null,"Got New Tokens");
    }
}
