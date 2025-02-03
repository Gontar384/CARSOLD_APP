package org.gontar.carsold.Service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Exceptions.CustomExceptions.*;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    private final UserRepository repository;
    private final String secretKey;

    public JwtService(UserRepository repository) throws NoSuchAlgorithmException {
        this.repository = repository;
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        SecretKey sk = keyGen.generateKey();
        secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
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
            throw new JwtGenerationException("Error generating JWT");
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
            throw new JwtExtractionException("Invalid JWT");
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        if (!username.equals(userDetails.getUsername())) throw new InvalidUsernameException("Extracted username does not match expected one");
        if (isTokenExpired(token)) throw new JwtExpirationException("JWT has expired");

        return !isTokenExpired(token);
    }

    public Optional<String> extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();

        Optional<Cookie> jwtCookie = Arrays.stream(cookies)
                .filter(cookie -> "JWT".equals(cookie.getName()))
                .findFirst();

        if (jwtCookie.isEmpty()) return Optional.empty();

        String jwt = jwtCookie.get().getValue();
        if (jwt == null || jwt.isBlank()) throw new NoJwtInCookieException("JWT is missing in the cookie");

        return Optional.of(jwt);
    }

    public User extractUserFromRequest(HttpServletRequest request) {
        Optional<String> jwtOptional = extractTokenFromCookie(request);
        if (jwtOptional.isEmpty()) return null;

        String jwt = jwtOptional.get();
        String username = extractUsername(jwt);
        if (username == null) return null;

        User user = repository.findByUsername(username);
        if (user == null) throw new UserNotFoundInRequestException("User not found in request");

        return user;
    }

    public User extractUserFromToken(String token) {
        try {
            if (token == null) throw new InvalidJwtException("JWT is missing");
            if (isTokenExpired(token)) throw new JwtExpirationException("JWT has expired");

            String username = extractUsername(token);
            User user = repository.findByUsername(username);
            if (user == null) throw new UserNotFoundException("User not found");

            return user;
        } catch (InvalidJwtException | JwtExtractionException | JwtExpirationException | UserNotFoundException e) {
            throw new InvalidJwtException("Invalid JWT");
        }
    }
}