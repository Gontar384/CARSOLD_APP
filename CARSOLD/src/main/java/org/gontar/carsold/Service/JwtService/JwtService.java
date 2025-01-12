package org.gontar.carsold.Service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.ErrorHandler.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {

    private final UserRepository repository;
    private final ErrorHandler errorHandler;
    private final String secretKey;

    public JwtService(UserRepository repository, ErrorHandler errorHandler) {
        this.repository = repository;
        this.errorHandler = errorHandler;
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();                                     //generates HMAC SHA-256 key
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());         //encodes it to Base64 string
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
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

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);       //decodes from Base64 string to byte array
        return Keys.hmacShaKeyFor(keyBytes);                       //generates secret key for JWT signing
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);                     //extracts username from token
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);                                //extracts claims
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()                                       //parses entire JWT and extracts all claims
                .verifyWith(getKey())                              //verifies token using secret key
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);                                     //validates token, extracts username and checks if it matches
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));      //provided UserDetails username, ensures token didn't expire
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());                        //checks if token expired
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);                   //extract expiration date
    }

    //extracts token from cookie
    public String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("JWT".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    //helper method for user extraction
    public User extractUserFromRequest(HttpServletRequest request) {
        String jwt = extractTokenFromCookie(request);
        if (jwt == null) return errorHandler.logObject("Invalid jwt token");
        String username = extractUsername(jwt);
        if (username == null) return errorHandler.logObject("Username not found");
        User user = repository.findByUsername(username);
        if (user == null) return errorHandler.logObject("User not found");
        return user;
    }
}