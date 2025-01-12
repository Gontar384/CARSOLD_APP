package org.gontar.carsold.ServiceTest.UserGetInfoServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.ErrorHandler.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserGetInfoService.UserGetInfoServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserGetInfoServiceUnitTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private ErrorHandler errorHandler;

    @InjectMocks
    private UserGetInfoServiceImpl service;

    @Test
    public void testFindEmail_exists() {
        String testEmail = "test@gmail.com";
        when(repo.existsByEmail(testEmail)).thenReturn(true);
        assertTrue(service.findEmail(testEmail), "Should return true, email exists");
        verify(repo).existsByEmail(testEmail);
    }

    @Test
    public void testFindEmail_notExist() {
        String testEmail = "test@gmail.com";
        when(repo.existsByEmail(testEmail)).thenReturn(false);
        assertFalse(service.findEmail(testEmail), "Should return false, email doesn't exist");
        verify(repo).existsByEmail(testEmail);
    }

    @Test
    public void testFindUsername_exists() {
        String testUsername = "testUsername";
        when(repo.existsByUsername(testUsername)).thenReturn(true);
        assertTrue(service.findUsername(testUsername), "Should return true, username exists");
        verify(repo).existsByUsername(testUsername);
    }

    @Test
    public void testFindUsername_notExist() {
        String testUsername = "testUsername";
        when(repo.existsByUsername(testUsername)).thenReturn(false);
        assertFalse(service.findUsername(testUsername), "Should return false, username doesn't exist");
        verify(repo).existsByUsername(testUsername);
    }

    @Test
    public void testCheckIfUsernameSafe_withInappropriateUsername() {
        assertFalse(service.checkIfUsernameSafe("testCwel"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("testFrajer"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("testMurzyn"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("hitler12"), "Should return false, username is inappropriate");
    }

    @Test
    public void testCheckActive_withEmail_isActive() {
        String testEmail = "test@gmail.com";
        User mockedUser = new User();
        when(repo.findByEmail(testEmail)).thenReturn(mockedUser);
        mockedUser.setActive(true);

        assertTrue(service.checkActive(testEmail), "Should return true, user is active");
        verify(repo).findByEmail(testEmail);
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void testCheckActive_withUsername_isNotActive() {
        String testUsername = "testUsername";
        User mockedUser = new User();
        when(repo.findByUsername(testUsername)).thenReturn(mockedUser);
        mockedUser.setActive(false);

        assertFalse(service.checkActive(testUsername), "Should return false, user is not active");
        verify(repo).findByUsername(testUsername);
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void testCheckActive_withUsername_userNotFound() {
        String testLogin = "notExistingUser";
        when(repo.findByUsername(testLogin)).thenReturn(null);

        assertFalse(service.checkActive(testLogin), "Should return false, user not found");
        verify(repo).findByUsername(testLogin);
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void testCheckOauth2_withEmail_isOauth2User() {
        String testEmail = "test@gmail.com";
        User mockedUser = new User();
        when(repo.findByEmail(testEmail)).thenReturn(mockedUser);
        mockedUser.setOauth2User(true);

        assertTrue(service.checkOauth2(testEmail), "Should return true, it is an oauth2 user");
        verify(repo).findByEmail(testEmail);
        verify(repo, never()).findByUsername(anyString());
    }

    @Test
    public void testCheckOauth2_withUsername_isNotOauth2User() {
        String testUsername = "testUsername";
        User mockedUser = new User();
        when(repo.findByUsername(testUsername)).thenReturn(mockedUser);
        mockedUser.setOauth2User(false);

        assertFalse(service.checkOauth2(testUsername), "Should return false, it is not a oauth2 user");
        verify(repo).findByUsername(testUsername);
        verify(repo, never()).findByEmail(anyString());
    }

    @Test
    public void testCheckOauth2_withUsername_userNotFound() {
        String testLogin = "nonExistingUser";
        when(repo.findByUsername(testLogin)).thenReturn(null);

        assertFalse(service.checkOauth2(testLogin), "Should return false, user not found");
        verify(repo).findByUsername(testLogin);
        verify(repo, never()).findByEmail(anyString());
    }

    @Test
    public void testCheckGoogleAuth_isAuthViaGoogle() {
        User mockedUser = new User();
        mockedUser.setOauth2User(true);
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockedUser);

        boolean result = service.checkGoogleAuth(request);

        assertTrue(result, "Should return true, jwt is valid, user is auth via Google");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testCheckGoogleAuth_isNotAuthViaGoogle() {
        User mockedUser = new User();
        mockedUser.setOauth2User(false);

        when(jwtService.extractUserFromRequest(request)).thenReturn(mockedUser);

        boolean result = service.checkGoogleAuth(request);

        assertFalse(result, "Should return false, jwt is valid, user is not auth via Google");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testCheckGoogleAuth_problemWithRequest() {
        when(jwtService.extractUserFromRequest(request)).thenReturn(null);

        boolean result = service.checkGoogleAuth(request);

        assertFalse(result, "Should return false, problem with request");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testCheckPassword_passwordIsTheSame() {
        User mockedUser = new User();
        String password = "validPassword";
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockedUser);
        when(encoder.matches(password, mockedUser.getPassword())).thenReturn(true);

        boolean result = service.checkPassword(password, request);

        assertTrue(result, "Should return true, password is the same");
        verify(jwtService).extractUserFromRequest(request);
        verify(encoder).matches(password, mockedUser.getPassword());
        verifyNoMoreInteractions(jwtService, encoder);
    }

    @Test
    public void testCheckPassword_passwordIsDifferent() {
        User mockedUser = new User();
        String password = "validPassword";
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockedUser);
        when(encoder.matches(password, mockedUser.getPassword())).thenReturn(false);

        boolean result = service.checkPassword(password, request);

        assertFalse(result, "Should return false, password is not the same");
        verify(jwtService).extractUserFromRequest(request);
        verify(encoder).matches(password, mockedUser.getPassword());
        verifyNoMoreInteractions(jwtService, encoder);
    }

    @Test
    public void testCheckPassword_problemWithRequest() {
        String password = "testPassword";
        when(jwtService.extractUserFromRequest(request)).thenReturn(null);

        boolean result = service.checkPassword(password, request);

        assertFalse(result, "Should return false, problem with request");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testValidateUser_noLogin() {
        String testPassword = "testPassword";

        boolean result = service.validateUser(null, testPassword);

        assertFalse(result, "Should return false, no login");
    }

    @Test
    public void testValidateUser_userNotFound() {
        String testPassword = "testPassword";
        String username = "userNotFound";
        when(repo.findByUsername(username)).thenReturn(null);

        boolean result = service.validateUser(username, testPassword);

        assertFalse(result, "Should return false, user not found");
        verify(repo).findByUsername(username);
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void testValidateUser_noPassword() {
        String username = "userNotFound";
        User mockUser = new User();
        when(repo.findByUsername(username)).thenReturn(mockUser);

        boolean result = service.validateUser(username, null);
        assertFalse(result, "Should return false, no password");
        verify(repo).findByUsername(username);
        verifyNoMoreInteractions(repo);
    }

    @Test
    public void testValidateUser_invalidPassword() {
        String password = "testPassword";
        String username = "testUsername";
        User mockUser = new User();
        when(repo.findByUsername(username)).thenReturn(mockUser);
        when(encoder.matches(password, mockUser.getPassword())).thenReturn(false);

        boolean result = service.validateUser(username, password);

        assertFalse(result, "Should return false, password is invalid");
        verify(repo).findByUsername(username);
        verify(encoder).matches(password, mockUser.getPassword());
        verifyNoMoreInteractions(repo, encoder);
    }

    @Test
    public void testValidateUser_validPassword() {
        String testPassword = "testPassword";
        String username = "testUsername";
        User mockUser = new User();
        when(repo.findByUsername(username)).thenReturn(mockUser);
        when(encoder.matches(testPassword, mockUser.getPassword())).thenReturn(true);

        boolean result = service.validateUser(username, testPassword);

        assertTrue(result, "Should return true, password is valid");
        verify(repo).findByUsername(username);
        verify(encoder).matches(testPassword, mockUser.getPassword());
        verifyNoMoreInteractions(repo, encoder);
    }
}
