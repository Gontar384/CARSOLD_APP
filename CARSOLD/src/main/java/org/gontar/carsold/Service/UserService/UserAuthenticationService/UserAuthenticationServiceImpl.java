package org.gontar.carsold.Service.UserService.UserAuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.gontar.carsold.ErrorsAndExceptions.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class UserAuthenticationServiceImpl implements UserAuthenticationService {

    private final UserRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final CookieService cookieService;
    private final ErrorHandler errorHandler;

    public UserAuthenticationServiceImpl(UserRepository repository, JwtService jwtService, AuthenticationManager authenticationManager, OAuth2AuthorizedClientService authorizedClientService, CookieService cookieService, ErrorHandler errorHandler) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.authorizedClientService = authorizedClientService;
        this.cookieService = cookieService;
        this.errorHandler = errorHandler;
    }

    //activates account
    @Override
    public boolean activateAccount(String token, HttpServletResponse response) {
        try {
            if (token == null) return false;

            User user = jwtService.extractUserFromToken(token);

            if (!user.getActive()) {  //this can be changed to return false in production (now doesn't go well with React strict mode)
                user.setActive(true);
                repository.save(user);
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            addCookieWithNewTokenToResponse(user.getUsername(), response);

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Failed to activate account : " + e.getMessage());
        }
    }

    //auth user using email or username
    @Override
    public boolean authenticate(String login, String password, HttpServletResponse response) {
        try {
            if (login == null) return false;

            User user = login.contains("@") ? repository.findByEmail(login) : repository.findByUsername(login);
            if (user == null) return errorHandler.logBoolean("User not found");

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), password));
            addCookieWithNewTokenToResponse(user.getUsername(), response);

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Authentication failed: " + e.getMessage());
        }
    }

    //checks user's auth
    @Override
    public boolean checkAuthentication(HttpServletRequest request) {
        return jwtService.extractAndValidateTokenFromRequest(request);
    }

    //logs user out (deletes jwt and delete OAuth2 session if needed)
    @Override
    public boolean logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
                OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                        oauth2Token.getAuthorizedClientRegistrationId(),
                        oauth2Token.getName()
                );

                if (client != null) {
                    String tokenValue = client.getAccessToken().getTokenValue();
                    revokeGoogleToken(tokenValue);
                    authorizedClientService.removeAuthorizedClient(
                            oauth2Token.getAuthorizedClientRegistrationId(),
                            oauth2Token.getName()
                    );
                }
            }

            HttpSession session = request.getSession(false);    //deletes session
            if (session != null) session.invalidate();
            SecurityContextHolder.clearContext();

            ResponseCookie deleteCookie = cookieService.createCookie("", 0);
            response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Failed to log out: " + e.getMessage());
        }
    }

    //deletes OAuth2 token
    private void revokeGoogleToken(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String revokeUrl = "https://oauth2.googleapis.com/revoke";
            restTemplate.postForEntity(revokeUrl, Map.of("token", token), String.class);
        } catch (Exception e) {
            errorHandler.logVoid("Error revoking Google token: " + e.getMessage());
        }
    }

    //refreshes JWT, validates previous one and sends new
    @Override
    public void refreshJwt(HttpServletRequest request, HttpServletResponse response) {
        boolean result = jwtService.extractAndValidateTokenFromRequest(request);

        if (result) {
            String username = jwtService.extractUsernameFromRequest(request);
            addCookieWithNewTokenToResponse(username, response);
        } else {
            errorHandler.logVoid("Couldn't refresh JWT");
        }
    }

    //helper method to add cookie with Jwt to response
    private void addCookieWithNewTokenToResponse(String username, HttpServletResponse response) {
        String newToken = jwtService.generateToken(username, 600);
        if (newToken == null) errorHandler.logVoid("Failed to generate token");

        ResponseCookie jwtCookie = cookieService.createCookie(newToken, 10);
        if (jwtCookie == null) errorHandler.logVoid("Failed to create cookie");

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie != null ? jwtCookie.toString() : null);
    }
}
