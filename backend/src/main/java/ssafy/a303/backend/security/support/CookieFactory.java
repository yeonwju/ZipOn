package ssafy.a303.backend.security.support;

import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieFactory {

    private final int accessHours;
    private final int refreshDays;
    private final int instantMinute;

    public CookieFactory(@Value("${jwt.access-token-hours}") int accessHours, @Value("${jwt.refresh-token-days}") int refreshDays, @Value("${instant-minute}") int instantMinute) {
        this.accessHours = accessHours * 60 * 60;
        this.refreshDays = refreshDays * 60 * 60 * 24;
        this.instantMinute = instantMinute * 60;
    }

    private Cookie bake(String name, String token, int life) {
        Cookie cookie = new Cookie(name, token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(life);
        // cookie.setSecure(true); // infra https 하면 주석 풀 예정
        return cookie;
    }

    public Cookie accessCookie(String token) {
        return bake("AT", token, accessHours);
    }

    public Cookie refreshCookie(String token) {
        return bake("RT", token, refreshDays);
    }
    public Cookie instantCookie(String name, String token){
        return bake(name, token, instantMinute);
    }
}
