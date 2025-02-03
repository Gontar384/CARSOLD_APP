package org.gontar.carsold.Config.OAuth2Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final UserRepository repository;
    private final CookieService cookieService;

    public CustomOAuth2SuccessHandler(UserRepository repository, CookieService cookieService) {
        this.repository = repository;
        this.cookieService = cookieService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        try {
            if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {

                OAuth2User oAuth2User = oauth2Token.getPrincipal();
                String email = (String) oAuth2User.getAttributes().get("email");

                boolean exists = repository.existsByEmail(email);
                User user;

                if (!exists) {
                    user = new User();
                    user.setEmail(email);
                    user.setUsername(email.split("@")[0]);
                } else {
                    user = repository.findByEmail(email);
                    user.setPassword(null);
                }

                user.setActive(true);
                user.setOauth2User(true);
                repository.save(user);

                cookieService.addCookieWithNewTokenToResponse(user.getUsername(), response);

                response.sendRedirect(frontendUrl + "details/myOffers");
            }
        } catch (Exception e) {
            log.error("Error during OAuth2 authentication success handling: {}", e.getMessage(), e);
            response.sendRedirect(frontendUrl + "authenticate/login");
        }
    }
}