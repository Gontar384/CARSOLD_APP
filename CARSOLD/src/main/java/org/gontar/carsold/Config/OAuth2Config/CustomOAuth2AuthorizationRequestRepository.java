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
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request,
                                         HttpServletResponse response) {
        if (authorizationRequest == null) {
            deleteCookie(response);
            return;
        }
        String serializedAuthorizationRequest = serialize(authorizationRequest);
        addCookie(response, serializedAuthorizationRequest);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        return loadAuthorizationRequest(request);
    }

    private void addCookie(HttpServletResponse response, String value) {
        try {
            ResponseCookie cookie = ResponseCookie.from(CustomOAuth2AuthorizationRequestRepository.COOKIE_NAME, value)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofMinutes(1))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw new CookieServiceException("OAuth2 cookie creation failed: " + e.getMessage());
        }
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

    public void deleteCookie(HttpServletResponse response) {
        try {
            ResponseCookie cookie = ResponseCookie.from(CustomOAuth2AuthorizationRequestRepository.COOKIE_NAME, "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw new CookieServiceException("OAuth2 cookie deletion failed: " + e.getMessage());
        }
    }
}