package org.gontar.carsold.ServiceTest.UserManagementServiceTest;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.ErrorsAndExceptions.ErrorHandler;
import org.gontar.carsold.ErrorsAndExceptions.InvalidTokenException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationServiceImpl;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserManagementServiceUnitTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private Mapper<User, UserDto> mapper;

    @Mock
    private UserEmailNotificationServiceImpl emailService;

    @Mock
    private HttpServletResponse response;

    @Mock
    private HttpServletRequest request;

    @Mock
    private CookieService cookieService;

    @Mock
    private ErrorHandler errorHandler;

    @InjectMocks
    private UserManagementServiceImpl service;

    @Test
    public void registerUser_success_createsNewUser() {
        UserDto userDto = new UserDto("test@gmail.com", "testUsername", "testPassword");
        User newUser = new User();

        when(repo.findByEmail("test@gmail.com")).thenReturn(null);
        when(repo.findByUsername("testUsername")).thenReturn(null);
        when(mapper.mapToEntity(userDto)).thenReturn(newUser);
        when(encoder.encode("testPassword")).thenReturn("encodedPassword");
        when(jwtService.generateToken(anyString(), anyLong())).thenReturn("mockToken");
        when(emailService.sendVerificationEmail(anyString(), anyString(), anyString())).thenReturn(true);

        boolean result = service.registerUser(userDto);

        assertTrue(result, "Should return true, creates new user");
        assertEquals("test@gmail.com", newUser.getEmail());
        assertEquals("testUsername", newUser.getUsername());
        assertEquals("encodedPassword", newUser.getPassword());
        verify(repo).findByEmail("test@gmail.com");
        verify(repo).findByUsername("testUsername");
        verify(repo).save(newUser);
        verify(mapper).mapToEntity(userDto);
        verify(encoder).encode("testPassword");
        verify(jwtService).generateToken(anyString(), anyLong());
        verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString());
        verifyNoMoreInteractions(repo, mapper, encoder, jwtService, emailService);
    }

    @Test
    public void registerUser_success_updatesExistingUser() {
        UserDto userDto = new UserDto("test@gmail.com", "testUsername", "testPassword");
        User existingUser = new User();
        existingUser.setActive(false);

        when(repo.findByEmail("test@gmail.com")).thenReturn(existingUser);
        when(encoder.encode("testPassword")).thenReturn("encodedPassword");
        when(emailService.sendVerificationEmail(anyString(), anyString(), anyString())).thenReturn(true);

        boolean result = service.registerUser(userDto);

        assertTrue(result, "Should return true, updates existing user");
        assertEquals("test@gmail.com", existingUser.getEmail());
        assertEquals("testUsername", existingUser.getUsername());
        assertEquals("encodedPassword", existingUser.getPassword());
        verify(repo).findByEmail("test@gmail.com");
        verify(repo).save(existingUser);
        verify(encoder).encode("testPassword");
        verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString());
        verifyNoMoreInteractions(repo, encoder, emailService);
    }

    @Test
    public void registerUser_failure_userExistsAndIsActive () {
        UserDto userDto = new UserDto("test@gmail.com", "testUsername", "testPassword");
        User existingUser = new User();
        existingUser.setActive(true);
        when(repo.findByEmail("test@gmail.com")).thenReturn(existingUser);

        boolean result = service.registerUser(userDto);

        assertFalse(result, "Should return false, user exists and it's active");
        verify(repo).findByEmail("test@gmail.com");
        verify(repo, never()).save(any(User.class));
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void registerUser_failure_problemWithEmailSending() {
        UserDto userDto = new UserDto("test@gmail.com", "testUsername", "testPassword");
        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setUsername(userDto.getUsername());

        when(repo.findByEmail("test@gmail.com")).thenReturn(null);
        when(repo.findByUsername("testUsername")).thenReturn(null);
        when(mapper.mapToEntity(userDto)).thenReturn(newUser);
        when(emailService.sendVerificationEmail(anyString(), anyString(), anyString())).thenThrow(new RuntimeException("Cannot send activation email"));

        boolean result = service.registerUser(userDto);

        assertFalse(result, "Should return false, email sending failed");
        verify(errorHandler).logBoolean(contains("Error registering user: Cannot send activation email"));
        verify(repo).findByEmail("test@gmail.com");
        verify(repo).findByUsername("testUsername");
        verify(repo, never()).save(any(User.class));
        verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString());
        verifyNoMoreInteractions(repo, emailService);
    }

    @Test
    public void recoveryChangePassword_failure_invalidToken() {
        String newPassword = "newPassword";
        String testToken = "testToken";
        when(jwtService.extractAllClaims(testToken)).thenReturn(null);

        boolean result = service.recoveryChangePassword(testToken, newPassword, response);

        assertFalse(result, "Should return false, token has wrong format");
        verify(jwtService).extractAllClaims(testToken);
        verify(repo, never()).save(any(User.class));
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void recoveryChangePassword_failure_tokenHasExpired() {
        String newPassword = "newPassword";
        String expiredToken = "testToken";
        String testUsername = "extractedUsername";
        UserDetails userDetails = mock(UserDetails.class);
        Claims mockClaims = mock(Claims.class);
        when(jwtService.extractAllClaims(expiredToken)).thenReturn(mockClaims);
        when(mockClaims.getSubject()).thenReturn(testUsername);
        when(userDetailsService.loadUserByUsername(testUsername)).thenReturn(userDetails);
        when(jwtService.validateToken(expiredToken, userDetails)).thenReturn(false);

        boolean result = service.recoveryChangePassword(expiredToken, newPassword, response);

        assertFalse(result, "Should return false, token has expired");
        verify(jwtService).extractAllClaims(expiredToken);
        verify(userDetailsService).loadUserByUsername(testUsername);
        verify(jwtService).validateToken(expiredToken, userDetails);
        verify(repo, never()).save(any(User.class));
        verifyNoMoreInteractions(jwtService, userDetailsService);
    }

    @Test
    public void recoveryChangePassword_success_passwordChanged() {
        String newPassword = "newPassword";
        String testToken = "testToken";
        String testUsername = "extractedUsername";
        UserDetails userDetails = mock(UserDetails.class);
        Claims mockClaims = mock(Claims.class);
        User mockUser = new User();
        ResponseCookie mockCookie = mock(ResponseCookie.class);
        when(jwtService.extractAllClaims(testToken)).thenReturn(mockClaims);
        when(mockClaims.getSubject()).thenReturn(testUsername);
        when(userDetailsService.loadUserByUsername(testUsername)).thenReturn(userDetails);
        when(jwtService.validateToken(testToken, userDetails)).thenReturn(true);
        when(repo.findByUsername(testUsername)).thenReturn(mockUser);
        when(encoder.encode(newPassword)).thenReturn("encodedPassword");
        when(jwtService.generateToken(anyString(), anyLong())).thenReturn(testToken);
        when(cookieService.createCookie(anyString(), anyLong())).thenReturn(mockCookie);

        boolean result = service.recoveryChangePassword(testToken, newPassword, response);

        assertTrue(result, "Should return true, password changed successfully");
        verify(jwtService).extractAllClaims(testToken);
        verify(userDetailsService).loadUserByUsername(testUsername);
        verify(jwtService).validateToken(testToken, userDetails);
        verify(repo).findByUsername(testUsername);
        verify(encoder).encode(newPassword);
        verify(repo).save(any(User.class));
        verify(jwtService).generateToken(anyString(), anyLong());
        verify(cookieService).createCookie(anyString(), anyLong());
        verify(response).addHeader(HttpHeaders.SET_COOKIE, mockCookie.toString()); // Verify cookie added to response
        verifyNoMoreInteractions(jwtService, userDetailsService, repo, encoder, cookieService);
    }

    @Test
    public void changePassword_failure_problemWithRequest() {
        String newPassword = "newPassword";
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidTokenException("JWT is missing in the cookie"));

        boolean result = service.changePassword(newPassword, request);

        assertFalse(result, "Should return false, problem with request");
        verify(jwtService).extractUserFromRequest(request);
        verify(errorHandler).logBoolean("Error changing password: JWT is missing in the cookie");
        verifyNoMoreInteractions(jwtService, errorHandler);
    }

    @Test
    public void changePassword_success_passwordChanged() {
        String newPassword = "newPassword";
        User mockUser = new User();

        when(jwtService.extractUserFromRequest(request)).thenReturn(mockUser);
        when(encoder.encode(newPassword)).thenReturn("encodedPassword");
        when(repo.save(mockUser)).thenReturn(mockUser);

        boolean result = service.changePassword(newPassword, request);

        assertTrue(result, "Should return true, password changed successfully");
        verify(jwtService).extractUserFromRequest(request);
        verify(encoder).encode(newPassword);
        verify(repo).save(mockUser);
        verifyNoMoreInteractions(jwtService, repo, encoder);
    }

    @Test
    public void fetchUsername_failure_problemWithRequest() {
        when(jwtService.extractUsernameFromRequest(request)).thenReturn(null);

        String result = service.fetchUsername(request);

        assertNull(result, "Should return null, no proper cookie or token");
        verify(jwtService).extractUsernameFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void fetchUsername_success_fetched() {
        String testUsername = "extractedUsername";
        when(jwtService.extractUsernameFromRequest(request)).thenReturn(testUsername);

        String result = service.fetchUsername(request);

        assertEquals(testUsername, result);
        verify(jwtService).extractUsernameFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }
}
