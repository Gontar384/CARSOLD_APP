package org.gontar.carsold.ServiceTest.JwtServiceTest;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Exception.CustomException.JwtServiceException;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtServiceUnitTest {

    @InjectMocks
    private JwtService jwtService;

    @Mock
    private UserRepository repository;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    public void setup() {
        SecretKey testSecretKey = Jwts.SIG.HS256.key().build();
        try {
            java.lang.reflect.Field secretKeyField = JwtService.class.getDeclaredField("secretKey");
            secretKeyField.setAccessible(true);
            secretKeyField.set(jwtService, testSecretKey);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException("Failed to set test secret key", e);
        }
    }

    @Test
    public void generateToken_success() {
        String username = "testUser";
        int timeInMinutes = 60;

        String token = jwtService.generateToken(username, timeInMinutes);

        assertNotNull(token);
    }

    @Test
    public void generateToken_failure_nullUsername() {
        assertThrows(NullPointerException.class, () -> jwtService.generateToken(null, 60));
    }

    @Test
    public void extractAllClaims_success() {
        String username = "testUser";
        int timeInMinutes = 60;
        String token = jwtService.generateToken(username,timeInMinutes);

        Claims claims = jwtService.extractAllClaims(token);

        assertNotNull(claims);
        assertEquals(username, claims.getSubject());
    }

    @Test
    public void extractAllClaims_failure_jwtException() {
        assertThrows(JwtServiceException.class, () -> jwtService.extractAllClaims("invalidToken"));
    }

    @Test
    public void extractUsername_success() {
        String username = "testUser";
        int timeInMinutes = 60;
        String token = jwtService.generateToken(username,timeInMinutes);

        String extractedUsername = jwtService.extractUsername(token);

        assertEquals(username, extractedUsername);
    }

    @Test
    public void validateToken_success() {
        String username = "testUser";
        int timeInMinutes = 60;
        String token = jwtService.generateToken(username,timeInMinutes);
        when(userDetails.getUsername()).thenReturn(username);

        boolean isValid = jwtService.validateToken(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    public void validateToken_failure() {
        String username = "testUser";
        int timeInMinutes = 60;
        String token = jwtService.generateToken(username, timeInMinutes);
        when(userDetails.getUsername()).thenReturn("differentUser");

        boolean isValid = jwtService.validateToken(token, userDetails);

        assertFalse(isValid);
    }

    @Test
    public void extractTokenFromCookie_success() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String token = "testToken";
        Cookie cookie = new Cookie("JWT", token);
        request.setCookies(cookie);

        Optional<String> extractedToken = jwtService.extractTokenFromCookie(request);

        assertTrue(extractedToken.isPresent());
        assertEquals(token, extractedToken.get());
    }

    @Test
    public void extractTokenFromCookie_failure_noCookie() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        Optional<String> extractedToken = jwtService.extractTokenFromCookie(request);

        assertTrue(extractedToken.isEmpty());
    }

    @Test
    public void extractTokenFromCookie_failure_nullCookieValue() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        Cookie cookie = new Cookie("JWT", null);
        request.setCookies(cookie);

        assertThrows(JwtServiceException.class, () -> jwtService.extractTokenFromCookie(request));
    }

    @Test
    public void extractUserFromToken_success() {
        String username = "testUser";
        int timeInMinutes = 60;
        String token = jwtService.generateToken(username,timeInMinutes);
        User user = new User();
        user.setUsername(username);
        when(repository.findByUsername(username)).thenReturn(user);

        User extractedUser = jwtService.extractUserFromToken(token);

        assertEquals(user, extractedUser);
    }

    @Test
    public void extractUserFromToken_failure_userNotFound() {
        String username = "testUser";
        int timeInMinutes = 60;
        String token = jwtService.generateToken(username,timeInMinutes);
        when(repository.findByUsername(username)).thenReturn(null);

        assertThrows(JwtServiceException.class, () -> jwtService.extractUserFromToken(token));
    }
}
