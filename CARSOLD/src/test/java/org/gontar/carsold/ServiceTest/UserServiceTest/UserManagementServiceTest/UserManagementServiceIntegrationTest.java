package org.gontar.carsold.ServiceTest.UserServiceTest.UserManagementServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Exception.CustomException.*;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

//need to set GOOGLE_APPLICATION_CREDENTIALS and JWT_SECRET_KEY env manually in Test Run Configuration
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class UserManagementServiceIntegrationTest {

    @Autowired
    private UserManagementServiceImpl userManagementService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private RestTemplate restTemplate;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Test
    public void registerUser_shouldFailRegistration_usernameContainsWrongCharacters () {
        User newUser = new User();
        newUser.setUsername("InvalidDot./");
        newUser.setEmail("test@email.com");
        newUser.setPassword("testPassword");

        Exception exception = assertThrows(InvalidValueException.class,
                () -> userManagementService.registerUser(newUser, false));
        assertTrue(exception.getMessage().contains("Username contains wrong characters: " + newUser.getUsername()));
    }

    @Test
    public void registerUser_shouldFailRegistration_inappropriateUsername() {
        User user = new User();
        user.setUsername("moron");
        user.setEmail("test@email.com");
        user.setPassword("testPassword");

        Exception exception = assertThrows(InappropriateContentException.class,
                () -> userManagementService.registerUser(user, false));
        assertTrue(exception.getMessage().contains("Username is inappropriate"));
    }

    @Test
    public void registerUser_success() {
        User newUser = new User();
        newUser.setUsername("testUser");
        newUser.setEmail("test@example.com");
        newUser.setPassword("testPassword");

        long countBefore = userRepository.count();
        User registeredUser = userManagementService.registerUser(newUser, false);
        long countAfter = userRepository.count();

        assertNotNull(registeredUser);
        assertEquals("testUser", registeredUser.getUsername());
        assertEquals("test@example.com", registeredUser.getEmail());
        assertFalse(registeredUser.getActive());
        assertNotNull(registeredUser.getPassword());

        User savedUser = userRepository.findByEmail("test@example.com");
        assertNotNull(savedUser);
        assertEquals("testUser", savedUser.getUsername());
        assertEquals(countBefore + 1, countAfter);
    }

    @Test
    public void deleteUser_isOAuth2User_success() {
        User user = new User();
        user.setUsername("oauth2user");
        user.setEmail("test@example.com");
        user.setActive(true);
        user.setOauth2(true);
        userRepository.save(user);

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Authentication authentication = mock(Authentication.class);

        OAuth2AuthenticationToken oauth2Token = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(oauth2Token.isAuthenticated()).thenReturn(true);
        when(oauth2Token.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttributes()).thenReturn(Map.of("email", "test@example.com"));
        when(securityContext.getAuthentication()).thenReturn(oauth2Token);
        SecurityContextHolder.setContext(securityContext);

        userManagementService.deleteUser(null, request, response, authentication);

        assertFalse(userRepository.existsByUsername("oauth2user"));
    }

    private void createAndAuthenticateUser() {
        String encodedPassword = encoder.encode("correct_password");
        User user = new User();
        user.setUsername("regularUser");
        user.setEmail("test@example.com");
        user.setActive(true);
        user.setOauth2(false);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void deleteUser_regularUser_success() {
        createAndAuthenticateUser();

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Authentication authentication = mock(Authentication.class);
        userManagementService.deleteUser("correct_password", request, response, authentication);

        assertFalse(userRepository.existsByUsername("regularUser"));
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void deleteUser_regularUser_incorrectPassword() {
        createAndAuthenticateUser();

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Authentication authentication = mock(Authentication.class);

        assertThrows(InvalidPasswordException.class, () ->
                userManagementService.deleteUser("incorrect_password", request, response, authentication));
        assertTrue(userRepository.existsByUsername("regularUser"));
        assertTrue(SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
    }
}
