package org.gontar.carsold.Service.CookieService;

import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Exceptions.CustomExceptions.CookieServiceException;
import org.gontar.carsold.Exceptions.CustomExceptions.JwtServiceException;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {

    @Value("${SESSION_TIME:24}")
    private int sessionTime;

    private final JwtService jwtService;

    public CookieService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public ResponseCookie createCookie(String token, int timeInHours) {
        try {
            return ResponseCookie.from("JWT", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(Duration.ofHours(timeInHours))
                    .build();
        }  catch (IllegalArgumentException | IllegalStateException e) {
            throw new CookieServiceException("Cookie creation failed: " + e.getMessage());
        }
    }

    public void addCookieWithNewTokenToResponse(String username, HttpServletResponse response) {
        try {
            String newToken = jwtService.generateToken(username, sessionTime * 60);
            ResponseCookie jwtCookie = createCookie(newToken, sessionTime);
            response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        }  catch (CookieServiceException | JwtServiceException e) {
            throw new CookieServiceException("Response not sent: " + e.getMessage());
        }
    }
}
