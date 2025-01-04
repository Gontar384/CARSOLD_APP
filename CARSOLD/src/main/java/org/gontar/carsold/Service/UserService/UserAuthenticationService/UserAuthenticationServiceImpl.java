package org.gontar.carsold.Service.UserService.UserAuthenticationService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final CookieService cookieService;

    public UserAuthenticationServiceImpl(UserRepository repository, JwtService jwtService, UserDetailsService userDetailsService, AuthenticationManager authenticationManager, OAuth2AuthorizedClientService authorizedClientService, CookieService cookieService) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.authorizedClientService = authorizedClientService;
        this.cookieService = cookieService;
    }

    //activates account
    @Override
    public String activateAccount(String token, HttpServletResponse response) {
        try {
            Claims claims = jwtService.extractAllClaims(token);
            String username = claims.getSubject();
            User user = repository.findByUsername(username);

            if (!user.getActive()) {
                user.setActive(true);
                repository.save(user);
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String newToken = jwtService.generateToken(user.getUsername(), 600);
            ResponseCookie authCookie = cookieService.createCookie(newToken, 10);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
            return "Activation success";
        } catch (Exception e) {
            System.err.println("Failed to activate account: " + e.getMessage());
            return "Activation failed";
        }
    }

    //checks user's auth
    @Override
    public boolean checkAuthentication(HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt == null) {
            return false; // No token found
        }
        String username = jwtService.extractUsername(jwt);
        if (username == null) {
            return false; // Username not found in token
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtService.validateToken(jwt, userDetails);
    }

    //logs user out (deletes jwt and delete OAuth2 session if needed)
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
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
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        ResponseCookie deleteCookie = cookieService.createCookie("", 0);
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }

    //deletes OAuth2 token
    private void revokeGoogleToken(String token) {
        RestTemplate restTemplate = new RestTemplate();
        String revokeUrl = "https://oauth2.googleapis.com/revoke";
        try {
            restTemplate.postForEntity(revokeUrl, Map.of("token", token), String.class);
        } catch (Exception e) {
            System.err.println("Error revoking Google token: " + e.getMessage());
        }
    }

    //auth user using email or username
    @Override
    public void authenticate(String login, String password, HttpServletResponse response) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), password));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getUsername(), 600);
            ResponseCookie authCookie = cookieService.createCookie(token, 10);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
        }
    }

    //refreshes JWT, checks previous one validation and sends new one
    @Override
    public void refreshJwt(HttpServletRequest request, HttpServletResponse response) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt != null) {
            String username = jwtService.extractUsername(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            boolean isValid = jwtService.validateToken(jwt, userDetails);
            if (isValid) {
                String newToken = jwtService.generateToken(username, 600);
                ResponseCookie jwtCookie = cookieService.createCookie(newToken, 10);
                response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
            }
        }
    }
}
