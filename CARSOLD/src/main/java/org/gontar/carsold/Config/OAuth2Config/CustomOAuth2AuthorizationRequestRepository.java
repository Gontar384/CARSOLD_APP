package org.gontar.carsold.Config.OAuth2Config;

import com.google.gson.Gson;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Exception.CustomException.CookieServiceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Component
public class CustomOAuth2AuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private static final String COOKIE_NAME = "OAUTH2_AUTH";

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return getCookie(request)
                .map(this::deserialize)
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            createCookie(response, "", 0);
            return;
        }
        String serializedAuthorizationRequest = serialize(authorizationRequest);
        createCookie(response, serializedAuthorizationRequest, 5);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        return loadAuthorizationRequest(request);
    }

    private Optional<String> getCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> cookie.getName().equals(CustomOAuth2AuthorizationRequestRepository.COOKIE_NAME))
                    .map(Cookie::getValue)
                    .findFirst();
        }
        return Optional.empty();
    }

    private String serialize(Object obj) {
        String json = new Gson().toJson(obj);
        return java.util.Base64.getUrlEncoder().encodeToString(json.getBytes());
    }

    private OAuth2AuthorizationRequest deserialize(String encoded) {
        byte[] decodedBytes = java.util.Base64.getUrlDecoder().decode(encoded);
        String json = new String(decodedBytes);
        return new Gson().fromJson(json, OAuth2AuthorizationRequest.class);
    }

    public void createCookie(HttpServletResponse response, String value, int timeInMinutes) {
        try {
            ResponseCookie cookie = ResponseCookie.from(CustomOAuth2AuthorizationRequestRepository.COOKIE_NAME, value)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofMinutes(timeInMinutes))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw new CookieServiceException("OAuth2 cookie creation failed: " + e.getMessage());
        }
    }
}