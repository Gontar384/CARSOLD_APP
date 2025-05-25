package org.gontar.carsold.ServiceTest.UserServiceTest.UserManagementServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Exception.CustomException.InvalidPasswordException;
import org.gontar.carsold.Exception.CustomException.JwtServiceException;
import org.gontar.carsold.Exception.CustomException.PasswordRecoveryChangeException;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserManagementServiceUnitTest {

    @InjectMocks
    private UserManagementServiceImpl managementService;

    @Mock
    private MyUserDetailsService userDetailsService;

    @Mock
    private UserRepository repository;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private JwtService jwtService;

    @Test
    public void fetchUsername() {
        User mockUser = new User();
        mockUser.setUsername("testUser");

        when(userDetailsService.loadUser()).thenReturn(mockUser);

        String username = managementService.fetchUsername();

        assertEquals("testUser", username);
        verify(userDetailsService).loadUser();
    }

    @Test
    public void changePassword_success() {
        User mockUser = new User();
        mockUser.setPassword("encodedOldPassword");

        when(userDetailsService.loadUser()).thenReturn(mockUser);
        when(encoder.matches("oldPassword", "encodedOldPassword")).thenReturn(true);
        when(encoder.encode("newPassword")).thenReturn("encodedNewPassword");

        managementService.changePassword("oldPassword", "newPassword");

        assertEquals("encodedNewPassword", mockUser.getPassword());
        verify(repository).save(mockUser);
    }

    @Test
    public void changePassword_shouldThrowInvalidPasswordException_whenOldPasswordIsIncorrect() {
        User mockUser = new User();
        mockUser.setPassword("encodedOldPassword");

        when(userDetailsService.loadUser()).thenReturn(mockUser);
        when(encoder.matches("wrongOldPassword", "encodedOldPassword")).thenReturn(false);

        InvalidPasswordException exception = assertThrows(InvalidPasswordException.class,
                () -> managementService.changePassword("wrongOldPassword", "newPassword"));

        assertEquals("Passwords do not match", exception.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    public void changePasswordRecovery_shouldChangePasswordAndSetAuthentication() {
        User mockUser = new User();
        String username = "testUser";
        mockUser.setUsername(username);
        mockUser.setPassword("oldEncodedPassword");

        HttpServletResponse response = mock(HttpServletResponse.class);
        HttpServletRequest request = mock(HttpServletRequest.class);

        when(jwtService.extractUsername("validToken")).thenReturn(username);
        when(repository.findByUsername(username)).thenReturn(mockUser);
        when(encoder.encode("newPassword")).thenReturn("newEncodedPassword");

        managementService.changePasswordRecovery("validToken", "newPassword", request, response);

        assertEquals("newEncodedPassword", mockUser.getPassword());
        verify(repository).save(mockUser);
        verify(jwtService).addCookieWithNewTokenToResponse(eq("testUser"), eq(response));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        assertEquals("testUser", authentication.getName());
    }

    @Test
    public void changePasswordRecovery_shouldThrowException_whenTokenIsInvalid() {
        when(jwtService.extractUsername("invalidToken")).thenThrow(new JwtServiceException("Error when extracting JWT claims"));

        HttpServletResponse response = mock(HttpServletResponse.class);
        HttpServletRequest request = mock(HttpServletRequest.class);

        PasswordRecoveryChangeException exception = assertThrows(PasswordRecoveryChangeException.class,
                () -> managementService.changePasswordRecovery("invalidToken", "newPassword", request, response));

        assertTrue(exception.getMessage().contains("Changing password failed: Error when extracting JWT claims"));
        verify(repository, never()).save(any());
        verify(jwtService, never()).addCookieWithNewTokenToResponse(anyString(), any());
    }
}
