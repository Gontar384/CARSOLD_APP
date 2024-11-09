package org.gontar.carsold.Config.OAuth2Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.JwtConfig.JwtService;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final JwtService jwtService;
    private final UserRepository repository;

    public CustomAuthenticationSuccessHandler(JwtService jwtService, UserRepository repository) {
        this.jwtService = jwtService;
        this.repository = repository;
    }

    //used for Google authentication
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {    //is instance of OAuth2AuthenticationToken
                                                                                  //which indicates an OAuth2Login
            OAuth2User oAuth2User = oauth2Token.getPrincipal();                   //retrieves authenticated user's details from OAuth2 using OAuth2User

            String email = (String) oAuth2User.getAttributes().get("email");      //retrieves email
            boolean exists = repository.existsByEmail(email);
            User user;                                                            //user management in DB
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

            String token = jwtService.generateToken(user.getUsername());//generates token based on "username"

            ResponseCookie authCookie = createCookie(token);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());   //adds cookie to response

            response.sendRedirect(frontendUrl + "/home");    //sends link with authorization token
        }
    }
    //creates cookie
    private ResponseCookie createCookie(String token) {
        return ResponseCookie.from("JWT", token)    //creates new cookie with name "authToken"
                .httpOnly(true)                                 //cannot be accessed via JavaScript
                .secure(false)                                  //enabled only for production
                .path("/")                                      //can be sent to any endpoint
                .sameSite("Lax")                                //restricts cookies sending via cross-site requests
                .maxAge(Duration.ofMinutes(15))
                .build();
    }
}