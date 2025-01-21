package org.gontar.carsold.Service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.ErrorsAndExceptions.ErrorHandler;
import org.gontar.carsold.ErrorsAndExceptions.InvalidTokenException;
import org.gontar.carsold.ErrorsAndExceptions.InvalidUsernameException;
import org.gontar.carsold.ErrorsAndExceptions.UserNotFoundException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;


@Service
public class JwtService {

    private final UserRepository repository;
    private final ErrorHandler errorHandler;
    private final String secretKey;
    private final UserDetailsService userDetailsService;

    public JwtService(UserRepository repository, ErrorHandler errorHandler, UserDetailsService userDetailsService) {
        this.repository = repository;
        this.errorHandler = errorHandler;
        this.userDetailsService = userDetailsService;
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();                                     //generates HMAC SHA-256 key
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());         //encodes it to Base64 string
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);       //decodes from Base64 string to byte array
        return Keys.hmacShaKeyFor(keyBytes);                       //generates secret key for JWT signing
    }

    //creates token for username
    public String generateToken(String username, long minutesToExpire){
        Map<String, Object> claims = new HashMap<>();
        long expirationTime = System.currentTimeMillis() + (1000 * 60 * minutesToExpire);
        return Jwts.builder()
                .claims()               //statements about entity and additional metadata
                .add(claims)
                .subject(username)  //includes username in token
                .issuedAt(new Date(System.currentTimeMillis()))   //creation time
                .expiration(new Date(expirationTime))   //expiration time
                .and()
                .signWith(getKey())   //signed with secret key
                .compact();           //returned as string
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);                     //extracts username from token
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);                                //extracts claims
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()                                       //parses entire JWT and extracts all claims
                    .verifyWith(getKey())                              //verifies token using secret key
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            errorHandler.logVoid("Error parsing JWT: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails){
        try {
            final String username = extractUsername(token);                                     //validates token, extracts username and checks if it matches
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));      //provided UserDetails username, ensures token didn't expire
        } catch (Exception e) {
            return errorHandler.logBoolean("Error validating JWT: " + e.getMessage());
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());                        //checks if token expired
        } catch (Exception e) {
            return errorHandler.logBoolean("Error checking JWT expiration: " + e.getMessage());
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);                   //extract expiration date
    }

    //extracts token from cookie
    public Optional<String> extractTokenFromCookie(HttpServletRequest request) throws InvalidTokenException {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();

        Optional<Cookie> jwtCookie = Arrays.stream(cookies)
                .filter(cookie -> "JWT".equals(cookie.getName()))
                .findFirst();

        if (jwtCookie.isEmpty()) return Optional.empty();

        String jwt = jwtCookie.get().getValue();
        if (jwt == null || jwt.isBlank()) throw new InvalidTokenException("JWT is missing in the cookie");

        return Optional.of(jwt);
    }

    //extracts username from request
    public String extractUsernameFromRequest(HttpServletRequest request) throws InvalidUsernameException{
        try {
            Optional<String> jwtOptional = extractTokenFromCookie(request);
            if (jwtOptional.isEmpty()) return null;
            String jwt = jwtOptional.get();
            String username = extractUsername(jwt);
            if (username == null) throw new InvalidUsernameException("Username not found in token");

            return username;
        } catch (InvalidTokenException e) {
            return errorHandler.logString("Problem with token extraction: " + e.getMessage());
        } catch (InvalidUsernameException e) {
            return errorHandler.logString("Problem with username extraction: " + e.getMessage());
        } catch (Exception e) {
            return errorHandler.logString("Unexpected error: " + e.getMessage());
        }
    }

    //extracts user from request
    public User extractUserFromRequest(HttpServletRequest request) throws UserNotFoundException{
        try {
            String username = extractUsernameFromRequest(request);
            User user = repository.findByUsername(username);
            if (user == null) throw new UserNotFoundException("User not found");

            return user;
        } catch (InvalidTokenException | InvalidUsernameException | UserNotFoundException e) {
            return errorHandler.logObject("Problem with request: " + e.getMessage());
        } catch (Exception e) {
            return errorHandler.logObject("Unexpected error: " + e.getMessage());
        }
    }

    //extracts and validates token
    public boolean extractAndValidateTokenFromRequest(HttpServletRequest request) {
        try {
            Optional<String> jwtOptional = extractTokenFromCookie(request);

            if (jwtOptional.isEmpty()) return false;

            String jwt = jwtOptional.get();
            String username = extractUsername(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            return userDetails != null && validateToken(jwt, userDetails);
        } catch (InvalidTokenException | InvalidUsernameException e) {
            return errorHandler.logBoolean("Problem with token: " + e.getMessage());
        } catch (Exception e) {
            return errorHandler.logBoolean("Unexpected error: " + e.getMessage());
        }
    }
}