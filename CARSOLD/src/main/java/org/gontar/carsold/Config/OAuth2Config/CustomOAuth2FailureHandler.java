package org.gontar.carsold.Config.OAuth2Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final CustomOAuth2AuthorizationRequestRepository customOAuth2AuthorizationRequestRepository;

    public CustomOAuth2FailureHandler(CustomOAuth2AuthorizationRequestRepository customOAuth2AuthorizationRequestRepository) {
        this.customOAuth2AuthorizationRequestRepository = customOAuth2AuthorizationRequestRepository;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        customOAuth2AuthorizationRequestRepository.createCookie(response, "", 0);
        response.sendRedirect(frontendUrl + "/authenticate/login");
    }
}