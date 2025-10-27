package ssafy.a303.backend.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.security.dto.TokenData;
import ssafy.a303.backend.security.dto.TokenType;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JWTProvider {

    private final Key key;
    private final long accessMinutes;
    private final long refreshDays;

    public JWTProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-minutes}") long accessMinutes,
            @Value("${jwt.refresh-token-days}") long refreshDays
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessMinutes = accessMinutes;
        this.refreshDays = refreshDays;
    }

    public String generateAccessToken(TokenData tokenData){
        Instant now = Instant.now();
        Duration life = Duration.ofMinutes(accessMinutes);
        Date expiry = Date.from(now.plus(life));
        return Jwts.builder()
                .setSubject(String.valueOf(tokenData.getUserSeq()))
                .setIssuedAt(Date.from(now))
                .setExpiration(expiry)
                .claim("role", tokenData.getRole())
                .claim("tokenType", TokenType.ACCESS.name())
                .claim("ver", tokenData.getVer())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    public String generateRefreshToken(TokenData tokenData){
        Instant now = Instant.now();
        Duration life = Duration.ofDays(refreshDays);
        Date expiry = Date.from(now.plus(life));
        return Jwts.builder()
                .setSubject(String.valueOf(tokenData.getUserSeq()))
                .setIssuedAt(Date.from(now))
                .setExpiration(expiry)
                .claim("tokenType", TokenType.REFRESH.name())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 유효성 검사
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 클레임 확인
    public Claims getClaims(String token) {
        return Jwts.parserBuilder().
                setSigningKey(key).
                build()
                .parseClaimsJws(token).getBody();
    }

    public int getSubject(String token) { return Integer.parseInt(getClaims(token).getSubject()); }
    public String getRole(String token) { return getClaims(token).get("role", String.class); }
    public Long getVer (String token) { return getClaims(token).get("ver", Long.class); }
}
