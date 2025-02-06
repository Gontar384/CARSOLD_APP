package org.gontar.carsold.ServiceTest.UserAuthenticationServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.gontar.carsold.Exceptions.ErrorHandler;
import org.gontar.carsold.Model.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserAuthenticationService.UserAuthenticationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserAuthenticationServiceUnitTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private OAuth2AuthorizedClientService authorizedClientService;

    @Mock
    private CookieService cookieService;

    @Mock
    private ErrorHandler errorHandler;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private UserAuthenticationServiceImpl service;

    @Test
    public void testActivateAccount_failure_problemWithToken() {
        String invalidToken = "invalid_token";

        boolean result = service.activateAccount(invalidToken, response);

        assertFalse(result, "Should return false, invalid token");
    }

    @Test
    public void testActivateAccount_failure_userIsActive() {
        String testUsername = "testUsername";
        String testToken = "validToken";
        User mockUser = new User();
        mockUser.setUsername(testUsername);
        mockUser.setActive(true);
        when(jwtService.extractUserFromToken(testToken)).thenReturn(mockUser);

        boolean result = service.activateAccount(testToken, response);

        assertTrue(result, "Should return true, but user is not updated");
        verify(jwtService).extractUserFromToken(testToken);
        verify(repo, never()).save(mockUser);
    }

    @Test
    public void testActivateAccount_success() {
        String testUsername = "testUsername";
        String testToken = "validToken";
        User mockUser = new User();
        mockUser.setUsername(testUsername);
        mockUser.setActive(false);
        when(jwtService.extractUserFromToken(testToken)).thenReturn(mockUser);

        boolean result = service.activateAccount(testToken, response);

        assertTrue(result, "Should return true, account activated");
        assertTrue(mockUser.getActive(), "User should be marked as active after activation");
        verify(jwtService).extractUserFromToken(testToken);
        verify(repo).save(mockUser);
    }

    @Test
    public void testAuthenticate_failure_noLoginProvided() {
        String password = "password";

        boolean result = service.authenticate(null, password, response);

        assertFalse(result, "Should return false, no login provided");
    }

    @Test
    public void testAuthenticate_failure_userNotFound() {
        String login = "login";
        String password = "password";
        when(repo.findByUsername(login)).thenReturn(null);

        boolean result = service.authenticate(login, password, response);

        assertFalse(result, "Should return false, user not found");
        verify(errorHandler).logBoolean("User not found");
        verify(repo).findByUsername(login);
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void testAuthenticate_failure_badCredentials() {
        String login = "testUser";
        String password = "wrongPassword";
        User mockUser = new User();
        mockUser.setUsername(login);

        when(repo.findByUsername(login)).thenReturn(mockUser);

        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(mockUser.getUsername(), password)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        boolean result = service.authenticate(login, password, response);

        assertFalse(result, "Should return false, bad credentials");
        verify(errorHandler).logBoolean("Authentication failed: Bad credentials");
        verify(repo).findByUsername(login);
        verify(authenticationManager).authenticate(new UsernamePasswordAuthenticationToken(login, password));
        verifyNoMoreInteractions(repo, authenticationManager);
    }

    @Test
    public void testAuthenticate_success() {
        String login = "testUser";
        String password = "wrongPassword";
        User mockUser = new User();
        mockUser.setUsername(login);
        Authentication authentication = new UsernamePasswordAuthenticationToken(login, password);

        when(repo.findByUsername(login)).thenReturn(mockUser);

        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(mockUser.getUsername(), password)))
                .thenReturn(authentication);

        boolean result = service.authenticate(login, password, response);

        assertTrue(result, "Should return true, wrong credentials");
        verify(repo).findByUsername(login);
        verify(authenticationManager).authenticate(new UsernamePasswordAuthenticationToken(login, password));
        verifyNoMoreInteractions(repo, authenticationManager);
    }

    @Test
    public void testCheckAuthentication_failure_userNotAuthOrProblemWithRequest() {
        when(jwtService.extractAndValidateTokenFromRequest(request)).thenReturn(false);

        boolean result = service.checkAuthentication(request);

        assertFalse(result, "Should return false, user is not authenticated or there is problem with request");
        verify(jwtService).extractAndValidateTokenFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testCheckAuthentication_success() {
        when(jwtService.extractAndValidateTokenFromRequest(request)).thenReturn(true);

        boolean result = service.checkAuthentication(request);

        assertTrue(result, "Should return true, user is authenticated");
        verify(jwtService).extractAndValidateTokenFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testLogout_failure() {
        when(request.getSession(false)).thenThrow(new RuntimeException("Session error"));

        boolean result = service.logout(request, response, null);

        assertFalse(result, "Should return false, session error occurred");
        verify(errorHandler).logBoolean("Failed to log out: Session error");
        verifyNoMoreInteractions(request, response);
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testLogout_success_withGoogleAuthentication() {
        OAuth2AuthenticationToken oauth2Token = mock(OAuth2AuthenticationToken.class);
        when(oauth2Token.getAuthorizedClientRegistrationId()).thenReturn("google");

        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);

        ResponseCookie cookie = ResponseCookie.from("JWT", "").maxAge(0).path("/").build();
        when(cookieService.createCookie("", 0)).thenReturn(cookie);

        boolean result = service.logout(request, response, oauth2Token);

        assertTrue(result, "Should return true, logged out successfully");
        verify(session).invalidate();
        verify(response).addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        verifyNoMoreInteractions(session, response, cookieService);
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testLogout_success_withNormalAuthentication() {
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);

        ResponseCookie cookie = ResponseCookie.from("JWT", "").maxAge(0).path("/").build();
        when(cookieService.createCookie("", 0)).thenReturn(cookie);

        boolean result = service.logout(request, response, null);

        assertTrue(result, "Should return true, logged out successfully");
        verify(session).invalidate();
        verify(response).addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        verifyNoMoreInteractions(session, response, cookieService);
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testRefreshJwt_failure_problemWithRequest() {
        when(jwtService.extractAndValidateTokenFromRequest(request)).thenReturn(false);

        service.refreshJwt(request, response);

        verify(errorHandler).logVoid("Couldn't refresh JWT");
        verify(jwtService).extractAndValidateTokenFromRequest(request);
        verifyNoMoreInteractions(jwtService, errorHandler);
    }

    @Test
    public void testRefreshJwt_success() {
        String testUsername = "testUsername";
        when(jwtService.extractAndValidateTokenFromRequest(request)).thenReturn(true);
        when(jwtService.extractUsernameFromRequest(request)).thenReturn(testUsername);

        service.refreshJwt(request, response);

        verify(errorHandler, never()).logVoid("Couldn't refresh JWT");
        verify(jwtService).extractAndValidateTokenFromRequest(request);
        verify(jwtService).extractUsernameFromRequest(request);
    }
}
