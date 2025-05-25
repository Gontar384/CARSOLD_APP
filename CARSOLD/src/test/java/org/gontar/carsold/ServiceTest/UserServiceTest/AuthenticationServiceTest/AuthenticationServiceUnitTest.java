package org.gontar.carsold.ServiceTest.UserServiceTest.AuthenticationServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Exception.CustomException.*;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.UserService.AuthenticationService.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceUnitTest {

    @InjectMocks
    private AuthenticationServiceImpl authService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private MyUserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository repository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private RestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void checkAuth_shouldReturnTrue_whenUserIsAuthenticated() {
        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testUser");
        when(repository.existsByUsername("testUser")).thenReturn(true);

        assertTrue(authService.checkAuth());
    }

    @Test
    public void checkAuth_shouldReturnFalse_whenAuthenticationIsAnonymous() {
        Authentication authentication = mock(AnonymousAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        assertFalse(authService.checkAuth());
    }

    @Test
    public void checkAuth_shouldReturnFalse_whenUserIsNotAuthenticated() {
        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(false);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        assertFalse(authService.checkAuth());
    }

    @Test
    public void fetchJwt_shouldAddCookie_whenUserIsAuthenticated() {
        User user = mock(User.class);
        when(user.getUsername()).thenReturn("testUser");
        when(userDetailsService.loadUser()).thenReturn(user);

        authService.fetchJwt(response);

        verify(jwtService).addCookieWithNewTokenToResponse("testUser", response);
    }

    @Test
    public void fetchJwt_shouldThrowException_whenUserIsNotAuthenticated() {
        when(userDetailsService.loadUser()).thenThrow(new UserDetailsException("User not authenticated"));

        UserDetailsException exception = assertThrows(UserDetailsException.class, () -> authService.fetchJwt(response));

        assertEquals("User not authenticated", exception.getMessage());
        verify(jwtService, never()).addCookieWithNewTokenToResponse(anyString(), any());
    }

    @Test
    public void activateAccount_shouldActivateUserAndSetAuthentication_whenTokenIsValid() {
        String token = "validToken";
        User user = new User();
        String username = "testUser";
        user.setUsername(username);
        user.setActive(false);
        when(jwtService.extractUsername(token)).thenReturn(username);
        when(repository.findByUsername(username)).thenReturn(user);
        Authentication mockAuthentication = mock(UsernamePasswordAuthenticationToken.class);
        when(mockAuthentication.getPrincipal()).thenReturn(user.getUsername());
        when(securityContext.getAuthentication()).thenReturn(mockAuthentication);

        authService.activateAccount(token, request, response);

        assertTrue(user.getActive());
        verify(repository).save(user);
        verify(jwtService).addCookieWithNewTokenToResponse("testUser", response);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication, "Authentication should not be null");
        assertEquals("testUser", authentication.getPrincipal(), "Principal should match the username");
    }

    @Test
    public void activateAccount_shouldThrowAccountActivationException_whenTokenIsInvalid() {
        String token = "invalidToken";

        when(jwtService.extractUsername(token)).thenThrow(new JwtServiceException("Error during claims extraction"));

        AccountActivationException exception = assertThrows(AccountActivationException.class, () -> authService.activateAccount(token, request, response));

        assertTrue(exception.getMessage().contains("Account activation process failed"));
        verify(repository, never()).save(any());
        verify(jwtService, never()).addCookieWithNewTokenToResponse(anyString(), any());
    }

    @Test
    public void authenticate_shouldThrowUserNotFoundException_whenUserNotFoundByLogin() {
        String login = "testLogin";
        String password = "password";

        when(repository.findByUsername(login)).thenReturn(null);

        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> authService.authenticate(login, password, response));

        assertEquals("User not found for login: " + login, exception.getMessage());
    }

    @Test
    public void authenticate_shouldThrowUserDataException_whenUserIsNotActive() {
        String login = "testLogin";
        String password = "password";

        User user = new User();
        user.setEmail(login);
        user.setActive(false);

        when(repository.findByUsername(login)).thenReturn(user);

        UserDataException exception = assertThrows(UserDataException.class, () -> authService.authenticate(login, password, response));

        assertEquals("User " + login + " is not active", exception.getMessage());
    }

    @Test
    public void authenticate_shouldThrowUserDataException_whenUserIsOauth2() {
        String login = "testLogin";
        String password = "password";

        User user = new User();
        user.setEmail(login);
        user.setActive(true);
        user.setOauth2(true);

        when(repository.findByUsername(login)).thenReturn(user);

        UserDataException exception = assertThrows(UserDataException.class, () -> authService.authenticate(login, password, response));

        assertEquals("User " + login + " is an oauth2 user", exception.getMessage());
    }

    @Test
    public void authenticate_shouldThrowBadCredentialsException_whenPasswordDoesNotMatch() {
        String login = "testLogin";
        String password = "password";

        User user = new User();
        user.setEmail(login);
        user.setPassword("hashedPassword");
        user.setActive(true);
        user.setOauth2(false);

        when(repository.findByUsername(login)).thenReturn(user);
        when(encoder.matches(password, user.getPassword())).thenReturn(false);

        AuthFailedException exception = assertThrows(AuthFailedException.class, () -> authService.authenticate(login, password, response));

        assertEquals("Authentication process failed: Bad credentials", exception.getMessage());
    }

    @Test
    public void authenticate_shouldAuthenticateUserAndAddToken_whenValidCredentials() {
        String login = "test@example.com";
        String password = "password";

        User user = new User();
        user.setEmail(login);
        user.setPassword("hashedPassword");
        user.setActive(true);
        user.setOauth2(false);

        when(repository.findByEmail(login)).thenReturn(user);
        when(encoder.matches(password, user.getPassword())).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);

        authService.authenticate(login, password, response);

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).addCookieWithNewTokenToResponse(user.getUsername(), response);
    }

    @Test
    public void logout_nonOAuth2Authentication() {
        Authentication nonOauthAuthentication = mock(Authentication.class);

        ResponseCookie mockCookie = mock(ResponseCookie.class);
        when(jwtService.createCookie(any(), anyInt())).thenReturn(mockCookie);
        when(mockCookie.toString()).thenReturn("Set-Cookie: mockCookie");

        authService.logout(request, response, nonOauthAuthentication);

        verify(restTemplate, never()).postForEntity(any(), any(), eq(String.class));
        verify(jwtService).createCookie(any(), anyInt());
        verify(response).addHeader(eq("Set-Cookie"), anyString());
    }
}
