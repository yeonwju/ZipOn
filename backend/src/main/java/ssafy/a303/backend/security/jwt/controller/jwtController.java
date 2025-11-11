package ssafy.a303.backend.security.jwt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.a303.backend.common.response.ResponseDTO;
import ssafy.a303.backend.common.exception.CustomException;
import ssafy.a303.backend.common.response.ErrorCode;
import ssafy.a303.backend.security.jwt.service.JWTProvider;
import ssafy.a303.backend.security.support.CookieFactory;


@RestController
@RequestMapping("/api/v1/jwt")
@RequiredArgsConstructor
@Tag(name = "jwt", description = "토큰 갱신")
public class jwtController {

    private final JWTProvider jwtProvider;
    private final CookieFactory cookieFactory;

    @Operation(
            summary = "Access / Refresh 토큰 재발급",
            description = "쿠키에 포함된 AT, RT를 검증하고 새 토큰을 발급합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "토큰 재발급 성공",
                    content = @Content()
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "토큰 없음, 만료 또는 유효하지 않음 (EXPIRED_TOKEN, INVALID_TOKEN)",
                    content = @Content()
            )
    })
    @PostMapping("/refresh")
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
            throw new CustomException(ErrorCode.EXPIRED_TOKEN);
        }
        if (!jwtProvider.isTokenValid(accessToken) || !jwtProvider.isTokenValid(refreshToken))
            throw new CustomException(ErrorCode.INVALID_TOKEN);

        String[] tokens = jwtProvider.getNewAccessTokenByRefreshToken(accessToken, refreshToken);
        Cookie accessCookie = cookieFactory.accessCookie(tokens[0]);
        Cookie refreshCookie = cookieFactory.refreshCookie(tokens[1]);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        return ResponseDTO.ok(null,"Got New Tokens");
    }
}
