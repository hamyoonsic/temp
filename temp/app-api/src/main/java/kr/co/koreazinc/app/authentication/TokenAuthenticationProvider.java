package kr.co.koreazinc.app.authentication;

import java.net.URL;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import kr.co.koreazinc.spring.security.authentication.TokenAuthenticationToken;
import kr.co.koreazinc.spring.security.model.ResponseToken;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.spring.utility.JwtUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TokenAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsService userDetailsService;
    private final OAuth2Property oauth2Property;

    public TokenAuthenticationProvider(UserDetailsService userDetailsService, OAuth2Property oauth2Property) {
        this.userDetailsService = userDetailsService;
        this.oauth2Property = oauth2Property;
    }

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {
        ResponseToken token = (ResponseToken) authentication.getCredentials();
        String accessToken = token.getAccessToken().replace("Bearer ", "");
        URL discoveryUrl = null;
        try {
            String url = oauth2Property.getProvider("microsoft").getDiscoveryUrl();
            if (url != null && !url.isBlank()) {
                discoveryUrl = new URL(url);
            }
        } catch (Exception e) {
            log.warn("TokenAuthenticationProvider - discoveryUrl lookup failed: {}", e.getMessage());
        }

        boolean valid = discoveryUrl != null
                ? JwtUtils.validationToken(accessToken, discoveryUrl)
                : JwtUtils.validationToken(accessToken, JwtUtils.getPublicKey());

        if (valid) {
            Map<String, Object> claims = discoveryUrl != null
                    ? JwtUtils.parseToken(accessToken, discoveryUrl)
                    : JwtUtils.parseToken(accessToken, JwtUtils.getPublicKey());
            return new TokenAuthenticationToken(
                    userDetailsService.loadUserByUsername(
                            String.valueOf(claims.getOrDefault("userId", claims.get("accId")))),
                    token);
        }
        throw new BadCredentialsException("Invalid access token");
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return TokenAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
