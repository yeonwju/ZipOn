package ssafy.a303.backend.security.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ssafy.a303.backend.security.jwt.entity.TokenPair;
import ssafy.a303.backend.security.jwt.repository.TokenPairRepository;
import ssafy.a303.backend.security.jwt.token.TokenData;
import ssafy.a303.backend.security.jwt.token.TokenType;

import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JWTProvider {

    @Value("${jwt.secret}")
    private Key key;
    @Value("${jwt.access-token-hours}")
    private long accessHours;
    @Value("${jwt.refresh-token-days}")
    private long refreshDays;
    private final TokenPairRepository tokenPairRepository;

    public String generateAccessToken(TokenData tokenData) {
        Instant now = tokenData.getIssueTime();
        Duration life = Duration.ofHours(accessHours);
        Date expiry = Date.from(now.plus(life));
        return Jwts.builder()
                .setSubject(String.valueOf(tokenData.getUserSeq()))
                .setIssuedAt(Date.from(now))
                .setExpiration(expiry)
                .claim("role", tokenData.getRole())
                .claim("tokenType", TokenType.ACCESS.name())
                .claim("jti", tokenData.getJti())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(TokenData tokenData) {
        Instant now = tokenData.getIssueTime();
        Duration life = Duration.ofDays(refreshDays);
        Date expiry = Date.from(now.plus(life));
        return Jwts.builder()
                .setId(tokenData.getJti())
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

    public TokenData parseToken(String token) { // 사용 전에 isTokenValid 로 체크하고 사용하기
        Claims c = getClaims(token);
        return TokenData.builder()
                .userSeq(Integer.parseInt(c.getSubject()))
                .role(c.get("role", String.class))
                .jti(c.getId())
                .tokenType(c.get("tokenType", String.class))
                .issueTime(c.getIssuedAt().toInstant())
                .build();
    }

    // isTokenValid 일 때만 사용하기
    @Transactional
    public String[] getNewAccessTokenByRefreshToken(String accessToken, String refreshToken) {
        TokenData aTokenData = parseToken(accessToken);
        TokenData rTokenData = parseToken(refreshToken);
        // access user != refresh user
        if (aTokenData.getUserSeq() != rTokenData.getUserSeq())
            return null;
        // token type 비교
        if (!aTokenData.getTokenType().equals(TokenType.ACCESS.name()) ||
                !rTokenData.getTokenType().equals(TokenType.REFRESH.name()))
            return null;
        // token jti db 찾기
        String accessJti = aTokenData.getJti();
        String refreshJti = rTokenData.getJti();
        Optional<TokenPair> opt = tokenPairRepository.findByAccessJtiAndRefreshJtiAndUsedFalse(accessJti, refreshJti);
        if (opt.isEmpty())
            return null;
        // 검증 완료
        // 사용 처리
        TokenPair tokenPair = opt.get();
        tokenPair.setUsed(true);
        tokenPairRepository.save(tokenPair);
        // 재발급
        String nAccessJti = UUID.randomUUID().toString();
        String nRefreshJti = UUID.randomUUID().toString();
        aTokenData.setJti(nAccessJti);
        rTokenData.setJti(nRefreshJti);
        Instant now = Instant.now();
        aTokenData.setIssueTime(now);
        rTokenData.setIssueTime(now);

        String nAccessToken = generateAccessToken(aTokenData);
        String nRefreshToken = generateRefreshToken(rTokenData);

        TokenPair nTokenPair = TokenPair.builder()
                .accessJti(nAccessJti)
                .refreshJti(nRefreshJti)
                .build();
        tokenPairRepository.save(nTokenPair);
        return new String[]{nAccessToken, nRefreshToken};
    }
}
