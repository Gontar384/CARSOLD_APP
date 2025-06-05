package org.gontar.carsold.Service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Exception.CustomException.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.*;

@Service
public class JwtService {

    @Value("${SESSION_TIME:24}")
    private int sessionTime;

    @Value("${DEPLOYMENT:false}")
    private boolean deployment;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        String jwtSecretKey = System.getenv("JWT_SECRET_KEY");
        if (jwtSecretKey == null || jwtSecretKey.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY environment variable is not set");
        }
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
            secretKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Invalid JWT_SECRET_KEY: " + e.getMessage(), e);
        }
    }

    private SecretKey getKey() {
        return secretKey;
    }

    public String generateToken(String username, int timeInMinutes) {
        try {
            Map<String, Object> claims = new HashMap<>();
            long expirationTime = System.currentTimeMillis() + (1000L * 60 * (long) timeInMinutes);
            return Jwts.builder()
                    .claims()
                    .add(claims)
                    .subject(username)
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(expirationTime))
                    .and()
                    .signWith(getKey())
                    .compact();
        } catch (JwtException e) {
            throw new JwtServiceException("JWT generation failed: " + e.getMessage());
        }
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            throw new JwtServiceException("Error when extracting JWT claims: " + e.getMessage());
        }
    }

    public String extractUsername(String token) {
        String username = extractAllClaims(token).getSubject();
        if (username == null) throw new JwtServiceException("No username found in JWT");
        return username;
    }

    public String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if ("AUTH".equals(cookie.getName())) {
                String jwt = cookie.getValue();
                if (jwt != null && !jwt.isBlank()) {
                    return jwt;
                }
            }
        }
        return null;
    }

    public ResponseCookie createCookie(String token, int timeInHours) {
        try {
            return ResponseCookie.from("AUTH", token)
                    .httpOnly(true)
                    .secure(deployment)
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
            String newToken = generateToken(username, sessionTime * 60);
            ResponseCookie jwtCookie = createCookie(newToken, sessionTime);
            response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        }  catch (CookieServiceException | JwtServiceException e) {
            throw new CookieServiceException("Response not sent: " + e.getMessage());
        }
    }
}