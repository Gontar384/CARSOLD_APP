package org.gontar.carsold.ServiceTest.JwtServiceTest;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Exception.CustomException.CookieServiceException;
import org.gontar.carsold.Exception.CustomException.JwtServiceException;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.lang.reflect.Field;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtServiceUnitTest {

    @InjectMocks
    private JwtService jwtService;

    @Mock
    private UserRepository repository;

    @Mock
    private UserDetails userDetails;

    @Mock
    HttpServletResponse response;

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
    public void extractTokenFromCookie_success() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String token = "testToken";
        Cookie cookie = new Cookie("AUTH", token);
        request.setCookies(cookie);

        String extractedToken = jwtService.extractTokenFromCookie(request);

        assertNotNull(extractedToken);
        assertEquals(token, extractedToken);
    }

    @Test
    public void createCookie_success() {
        String token = "test_token";
        int timeInHours = 24;

        ResponseCookie cookie = jwtService.createCookie(token, timeInHours);

        assertNotNull(cookie);
        assertEquals("AUTH", cookie.getName());
        assertTrue(cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals("Lax", cookie.getSameSite());
        assertEquals(Duration.ofHours(timeInHours).getSeconds(), cookie.getMaxAge().getSeconds());
    }

    @Test
    public void addCookieWithNewTokenToResponse_success() throws Exception {
        JwtService jwtServiceSpy = Mockito.spy(jwtService);

        String username = "testUser";
        String token = "testToken";
        int sessionTimeInHours = 24;

        Field sessionTimeField = JwtService.class.getDeclaredField("sessionTime");
        sessionTimeField.setAccessible(true);
        sessionTimeField.set(jwtServiceSpy, sessionTimeInHours);

        when(jwtServiceSpy.generateToken(username, sessionTimeInHours * 60)).thenReturn(token);

        MockHttpServletResponse response = new MockHttpServletResponse();
        jwtServiceSpy.addCookieWithNewTokenToResponse(username, response);

        String cookieHeader = response.getHeader(HttpHeaders.SET_COOKIE);
        assertNotNull(cookieHeader);
        assertTrue(cookieHeader.contains("AUTH=" + token));
    }

    @Test
    public void addCookieWithNewTokenToResponse_failure_shouldThrowException_whenTokenGenerationFails() throws Exception {
        JwtService jwtServiceSpy = Mockito.spy(jwtService);

        String username = "testUser";
        int sessionTimeInHours = 24;

        Field sessionTimeField = JwtService.class.getDeclaredField("sessionTime");
        sessionTimeField.setAccessible(true);
        sessionTimeField.set(jwtServiceSpy, sessionTimeInHours);

        doThrow(new JwtServiceException("JWT generation failed"))
                .when(jwtServiceSpy).generateToken(eq(username), eq(sessionTimeInHours * 60));

        HttpServletResponse response = new MockHttpServletResponse();
        CookieServiceException exception = assertThrows(
                CookieServiceException.class,
                () -> jwtServiceSpy.addCookieWithNewTokenToResponse(username, response)
        );

        assertTrue(exception.getMessage().contains("Response not sent"));
    }
}
