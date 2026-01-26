package kr.co.koreazinc.spring.utility;

import static org.springframework.web.reactive.function.BodyInserters.fromFormData;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.reactive.function.client.WebClient;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.UrlJwkProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.InvalidClaimException;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;

import kr.co.koreazinc.spring.exception.TokenIssuanceException;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@UtilityClass
public class OAuthUtils {

    public String issuedToken(String tokenUrl, String clientId, String clientSecret, String scope) throws TokenIssuanceException {
        try {
            //log.error(">>> Loaded clientId = {}", clientId);
            //log.error(">>> Loaded clientSecret = {}", clientSecret);
            //log.error(">>> Loaded tokenUrl = {}", tokenUrl);
            //log.error(">>> Loaded scope = {}", scope);

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = WebClient.create().post()
                .uri(tokenUrl)
                .accept(MediaType.APPLICATION_JSON)
                .body(fromFormData("grant_type", "client_credentials")
                            .with("client_id", clientId)
                            .with("client_secret", clientSecret)
                            .with("scope", scope))
                .exchangeToMono(response->{
                    return response.bodyToMono(Map.class);
                }).block();

            log.info("OAuthUtils - issuedToken: responseBody = {}", responseBody);               

            if (responseBody == null) {
                log.error("OAuthUtils - issuedToken: Empty response");
                throw new TokenIssuanceException();
            }
            Object error = responseBody.get("error");
            if (error != null && !String.valueOf(error).isBlank()) {
                log.error("OAuthUtils - issuedToken: Error Url = " + error);
                throw new TokenIssuanceException();
            }
            Object accessToken = responseBody.get("access_token");
            if (accessToken == null || String.valueOf(accessToken).isBlank()) {
                log.error("OAuthUtils - issuedToken: Missing access_token");
                throw new TokenIssuanceException();
            }


            return String.valueOf(accessToken);
        } catch (Exception e) {
            log.error("OAuthUtils - issuedToken: " + e.getMessage());
            throw new TokenIssuanceException();
        }
    }

    public boolean validationToken(String oAuth, String discoveryUrl) {
        try {
            DecodedJWT jwt = JWT.decode(oAuth);
            JwkProvider provider = new UrlJwkProvider(new URL(discoveryUrl));
            Jwk jwk = provider.get(jwt.getKeyId());
            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
            algorithm.verify(jwt);
            return true;
        } catch (JWTDecodeException | MalformedURLException | JwkException | SignatureVerificationException e) {
            log.error("OAuthUtils - validationToken: " + e.getMessage());
            return false;
        }
    }

    public Map<String, Object> parseToken(String oAuth, String discoveryUrl, String clientUrl) throws AuthenticationServiceException {
        try {
            DecodedJWT jwt = JWT.decode(oAuth);
            JwkProvider provider = new UrlJwkProvider(new URL(discoveryUrl));
            Jwk jwk = provider.get(jwt.getKeyId());
            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
            algorithm.verify(jwt);
            try {
                JWTVerifier verifier = JWT.require(algorithm).withAudience(clientUrl).build();
                Map<String, Object> claims = new HashMap<>(verifier.verify(oAuth).getClaims());
                return claims;
            } catch (TokenExpiredException | InvalidClaimException e) {
                log.error("OAuthUtils - parseToken: " + e.getMessage());
                throw new AuthenticationServiceException(e.getMessage());
            }
        } catch (JWTDecodeException | MalformedURLException | JwkException | SignatureVerificationException e) {
            log.error("OAuthUtils - parseToken: " + e.getMessage());
            throw new AuthenticationServiceException(e.getMessage());
        }
    }
}
