package org.gontar.carsold.Config.OAuth2Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

//Google authentication
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final JwtService jwtService;
    private final UserRepository repository;
    private final CookieService cookieService;

    public CustomAuthenticationSuccessHandler(JwtService jwtService, UserRepository repository, CookieService cookieService) {
        this.jwtService = jwtService;
        this.repository = repository;
        this.cookieService = cookieService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
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

                String token = jwtService.generateToken(user.getUsername(), 600);
                ResponseCookie authCookie = cookieService.createCookie(token, 10);
                response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
                response.sendRedirect(frontendUrl + "details/myOffers");
            }
        } catch (Exception e) {
            System.err.println("Error during OAuth2 authentication success handling: " + e.getMessage());
        }
    }

    //used to delete OAuth2 session
    @Bean
    public OAuth2AuthorizedClientService authorizedClientService(ClientRegistrationRepository clientRegistrationRepository) {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
    }
}