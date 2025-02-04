package org.gontar.carsold.Service.JwtService;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Exceptions.CustomExceptions.*;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    private final UserRepository repository;
    private SecretKey secretKey;

    public JwtService(UserRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.configure().load();
        String jwtSecretKey = dotenv.get("JWT_SECRET_KEY");
        if (jwtSecretKey == null || jwtSecretKey.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY env is not set");
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
            throw new JwtServiceException("Error during claims extraction: " + e.getMessage());
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject().equals(userDetails.getUsername());
    }

    public Optional<String> extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();

        Optional<Cookie> jwtCookie = Arrays.stream(cookies)
                .filter(cookie -> "JWT".equals(cookie.getName()))
                .findFirst();

        if (jwtCookie.isEmpty()) return Optional.empty();

        String jwt = jwtCookie.get().getValue();
        if (jwt == null || jwt.isBlank()) throw new JwtServiceException("Token is missing in cookie");

        return Optional.of(jwt);
    }

    public User extractUserFromRequest(HttpServletRequest request) {
        Optional<String> jwtOptional = extractTokenFromCookie(request);
        if (jwtOptional.isEmpty()) throw new JwtServiceException("Token is missing in request");

        String jwt = jwtOptional.get();
        String username = extractUsername(jwt);
        if (username == null) throw new JwtServiceException("Problem with username extraction (fallback)");

        User user = repository.findByUsername(username);
        if (user == null) throw new JwtServiceException("User not found");

        return user;
    }

    public User extractUserFromToken(String token) throws IllegalArgumentException {
        String username = extractUsername(token);
        if (username == null) throw new JwtServiceException("Problem with username extraction (fallback)");
        User user = repository.findByUsername(username);
        if (user == null) throw new JwtServiceException("User not found");

        return user;
    }
}