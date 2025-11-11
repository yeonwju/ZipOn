package ssafy.a303.backend.security.oauth.principal;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class CustomOidcPrincipal implements OidcUser {
    private final OidcUser delegate;
    private final Map<String, Object> merged;

    public CustomOidcPrincipal(OidcUser delegate, Map<String, Object> merged) {
        this.delegate = delegate;
        this.merged = Collections.unmodifiableMap(merged);
    }

    @Override public Map<String, Object> getAttributes() { return merged; }
    @Override public Map<String, Object> getClaims() { return merged; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return delegate.getAuthorities(); }
    @Override public String getName() { return delegate.getName(); }
    @Override public OidcIdToken getIdToken() { return delegate.getIdToken(); }
    @Override public OidcUserInfo getUserInfo() { return delegate.getUserInfo(); }
}
