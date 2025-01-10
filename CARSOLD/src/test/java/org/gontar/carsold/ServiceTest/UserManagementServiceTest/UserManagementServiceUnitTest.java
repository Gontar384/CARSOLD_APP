package org.gontar.carsold.ServiceTest.UserManagementServiceTest;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
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
    private CookieService cookieService;

    @InjectMocks
    private UserManagementServiceImpl service;

    @Test
    public void registerUser_successfulRegistration_createsNewUser() {
        UserDto userDto = new UserDto("test@gmail.com", "testUsername", "testPassword");
        User newUser = new User();

        when(repo.findByEmail("test@gmail.com")).thenReturn(null);
        when(repo.findByUsername("testUsername")).thenReturn(null);
        when(mapper.mapToEntity(userDto)).thenReturn(newUser);
        when(encoder.encode("testPassword")).thenReturn("encodedPassword");
        when(jwtService.generateToken(anyString(), anyLong())).thenReturn("mockToken");

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
        verify(emailService).sendVerificationEmail(anyString(), anyString());
        verifyNoMoreInteractions(repo, mapper, encoder, jwtService, emailService);
    }

    @Test
    public void registerUser_successfulRegistration_updatesExistingUser() {
        UserDto userDto = new UserDto("test@gmail.com", "testUsername", "testPassword");
        User existingUser = new User();
        existingUser.setActive(false);

        when(repo.findByEmail("test@gmail.com")).thenReturn(existingUser);
        when(encoder.encode("testPassword")).thenReturn("encodedPassword");

        boolean result = service.registerUser(userDto);

        assertTrue(result, "Should return true, updates existing user");
        assertEquals("test@gmail.com", existingUser.getEmail());
        assertEquals("testUsername", existingUser.getUsername());
        assertEquals("encodedPassword", existingUser.getPassword());
        verify(repo).findByEmail("test@gmail.com");
        verify(repo).save(existingUser);
        verify(encoder).encode("testPassword");
        verify(emailService).sendVerificationEmail(anyString(), anyString());
        verifyNoMoreInteractions(repo, encoder, emailService);
    }

    @Test
    public void registerUser_unsuccessfulRegistration_userExistsAndIsActive () {
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
    public void recoveryChangePassword_tokenHasWrongFormat() {
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
    public void recoveryChangePassword_tokenHasExpired() {
        String newPassword = "newPassword";
        String expiredToken = "testToken";
        String testUsername = "extractedUsername";
        UserDetails userDetails = mock(UserDetails.class);
        Claims mockedClaims = mock(Claims.class);
        when(jwtService.extractAllClaims(expiredToken)).thenReturn(mockedClaims);
        when(mockedClaims.getSubject()).thenReturn(testUsername);
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
    public void recoveryChangePassword_passwordChangedSuccessfully() {
        String newPassword = "newPassword";
        String testToken = "testToken";
        String testUsername = "extractedUsername";
        UserDetails userDetails = mock(UserDetails.class);
        Claims mockedClaims = mock(Claims.class);
        User mockedUser = new User();
        ResponseCookie mockedCookie = mock(ResponseCookie.class); // Mocked cookie response
        when(jwtService.extractAllClaims(testToken)).thenReturn(mockedClaims);
        when(mockedClaims.getSubject()).thenReturn(testUsername);
        when(userDetailsService.loadUserByUsername(testUsername)).thenReturn(userDetails);
        when(jwtService.validateToken(testToken, userDetails)).thenReturn(true);
        when(repo.findByUsername(testUsername)).thenReturn(mockedUser);
        when(encoder.encode(newPassword)).thenReturn("encodedPassword");
        when(jwtService.generateToken(anyString(), anyLong())).thenReturn(testToken);
        when(cookieService.createCookie(anyString(), anyLong())).thenReturn(mockedCookie);

        boolean result = service.recoveryChangePassword(testToken, newPassword, response);

        assertTrue(result, "Should return true, token is valid, password changed successfully");
        verify(jwtService).extractAllClaims(testToken);
        verify(userDetailsService).loadUserByUsername(testUsername);
        verify(jwtService).validateToken(testToken, userDetails);
        verify(repo).findByUsername(testUsername);
        verify(encoder).encode(newPassword);
        verify(repo).save(any(User.class));
        verify(jwtService).generateToken(anyString(), anyLong());
        verify(cookieService).createCookie(anyString(), anyLong());
        verify(response).addHeader(HttpHeaders.SET_COOKIE, mockedCookie.toString()); // Verify cookie added to response
        verifyNoMoreInteractions(jwtService, userDetailsService, repo, encoder, cookieService);
    }
}
