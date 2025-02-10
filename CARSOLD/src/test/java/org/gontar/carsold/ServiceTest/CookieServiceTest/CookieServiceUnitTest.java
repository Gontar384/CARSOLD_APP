package org.gontar.carsold.ServiceTest.CookieServiceTest;

import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Exception.CustomException.CookieServiceException;
import org.gontar.carsold.Exception.CustomException.JwtServiceException;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CookieServiceUnitTest {

    @InjectMocks
    private CookieService cookieService;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletResponse response;

    @Test
    public void createCookie_success() {
        String token = "test_token";
        int timeInHours = 24;

        ResponseCookie cookie = cookieService.createCookie(token, timeInHours);

        assertNotNull(cookie);
        assertEquals("JWT", cookie.getName());
        assertTrue(cookie.isHttpOnly());
        assertFalse(cookie.isSecure()); // Adjust if your setup requires secure cookies
        assertEquals("/", cookie.getPath());
        assertEquals("Lax", cookie.getSameSite());
        assertEquals(Duration.ofHours(timeInHours).getSeconds(), cookie.getMaxAge().getSeconds());
    }

    @Test
    public void addCookieWithNewTokenToResponse_success() throws Exception {
        String username = "testUser";
        String token = "testToken";
        MockHttpServletResponse response = new MockHttpServletResponse();

        java.lang.reflect.Field sessionTimeField = CookieService.class.getDeclaredField("sessionTime");
        sessionTimeField.setAccessible(true);
        sessionTimeField.set(cookieService, 24);

        when(jwtService.generateToken(username, 24 * 60)).thenReturn(token);

        cookieService.addCookieWithNewTokenToResponse(username, response);

        assertEquals(1, response.getHeaderValues(HttpHeaders.SET_COOKIE).size());

        String cookieHeader = response.getHeader(HttpHeaders.SET_COOKIE);

        assert cookieHeader != null;
        assertTrue(cookieHeader.contains("JWT=" + token));
        assertTrue(cookieHeader.contains("HttpOnly"));
        assertFalse(cookieHeader.contains("Secure"));
        assertTrue(cookieHeader.contains("Path=/"));
        assertTrue(cookieHeader.contains("SameSite=Lax"));
        assertTrue(cookieHeader.contains("Max-Age=" + Duration.ofHours(24).getSeconds()));
    }

    @Test
    public void addCookieWithNewTokenToResponse_failure_shouldThrowException_whenCookieServiceFails() {
        String username = "testUser";

        when(jwtService.generateToken(eq(username), anyInt())).thenThrow(new JwtServiceException("JWT generation failed"));

        assertThrows(CookieServiceException.class, () -> cookieService.addCookieWithNewTokenToResponse(username, response));
    }
}
