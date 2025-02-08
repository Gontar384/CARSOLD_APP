package org.gontar.carsold.Config.OAuth2Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Domain.Entity.User.User;
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
        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            OAuth2User oAuth2User = oauth2Token.getPrincipal();
            String email = (String) oAuth2User.getAttributes().get("email");
            User user = repository.findByEmail(email);

            if (user == null) user = createNewOAuth2User(email);
            else if (!user.getOauth2()) updateUserToOAuth2(user);

            cookieService.addCookieWithNewTokenToResponse(user.getUsername(), response);
            response.sendRedirect(frontendUrl + "details/myOffers");
        }
    }

    private User createNewOAuth2User(String email) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(email.split("@")[0]);
        newUser.setPassword(null);
        newUser.setActive(true);
        newUser.setOauth2(true);
        repository.save(newUser);
        return newUser;
    }

    private void updateUserToOAuth2(User user) {
        user.setPassword(null);
        user.setOauth2(true);
        user.setActive(true);
        repository.save(user);
    }
}