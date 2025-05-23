package org.gontar.carsold.Service.UserService.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Exception.CustomException.*;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Objects;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository repository;
    private final MyUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final BCryptPasswordEncoder encoder;

    public AuthenticationServiceImpl(UserRepository repository, MyUserDetailsService userDetailsService, JwtService jwtService,
                                     AuthenticationManager authenticationManager, OAuth2AuthorizedClientService authorizedClientService,
                                     BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.authorizedClientService = authorizedClientService;
        this.encoder = encoder;
    }

    @Override
    public boolean checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken) &&
                repository.existsByUsername(authentication.getName());
    }

    @Override
    public void fetchJwt(HttpServletResponse response) {
        User user = userDetailsService.loadUser();
        jwtService.addCookieWithNewTokenToResponse(user.getUsername(), response);
    }

    @Override
    public void activateAccount(String token, HttpServletRequest request, HttpServletResponse response) {
        Objects.requireNonNull(token, "JWT cannot be null");
        try {
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            if (user == null) throw new UsernameNotFoundException("User not found");
            user.setActive(true);
            repository.save(user);

            UserDetails userDetails = new UserPrincipal(user);

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

            jwtService.addCookieWithNewTokenToResponse(user.getUsername(), response);
        } catch (JwtServiceException | AuthenticationException e) {
            throw new AccountActivationException("Account activation process failed: " + e.getMessage());
        }
    }

    @Override
    public void authenticate(String login, String password, HttpServletResponse response) {
        Objects.requireNonNull(login, "Login cannot be null");
        Objects.requireNonNull(password, "Password cannot be null");
        try {
            User user = login.contains("@") ? repository.findByEmail(login) : repository.findByUsername(login);
            if (user == null) throw new UserNotFoundException("User not found for login: " + login);
            if (!user.getActive()) throw new UserDataException("User " + login + " is not active");
            if (user.getOauth2()) throw new UserDataException("User " + login + " is an oauth2 user");
            if (!encoder.matches(password, user.getPassword())) throw new BadCredentialsException("Bad credentials");

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), password));

            jwtService.addCookieWithNewTokenToResponse(user.getUsername(), response);
        } catch (AuthenticationException e) {
            throw new AuthFailedException("Authentication process failed: " + e.getMessage());
        }
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            try {
                OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                        oauth2Token.getAuthorizedClientRegistrationId(),
                        oauth2Token.getName());
                if (client != null) {
                    String tokenValue = client.getAccessToken().getTokenValue();
                    revokeGoogleToken(tokenValue);
                    authorizedClientService.removeAuthorizedClient(
                            oauth2Token.getAuthorizedClientRegistrationId(),
                            oauth2Token.getName());
                }
            } catch (OAuth2AuthenticationException e) {
                throw new LogoutFailedException("OAuth2 logout failed: " + e.getMessage());
            }
        }
        try {
            SecurityContextHolder.clearContext();
            ResponseCookie deleteCookie = jwtService.createCookie("", 0);
            response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
        } catch (AuthenticationException e) {
            throw new LogoutFailedException("Logout process failed: " + e.getMessage());
        }
    }

    private void revokeGoogleToken(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String revokeUrl = "https://oauth2.googleapis.com/revoke";
            ResponseEntity<String> response = restTemplate.postForEntity(revokeUrl, Map.of("token", token), String.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new OAuth2AuthenticationException("OAuth2 token revocation failed: " + response.getStatusCode());
            }
        } catch (RestClientException e) {
            throw new OAuth2AuthenticationException("Rest Client Exception: " + e.getMessage());
        }
    }
}
