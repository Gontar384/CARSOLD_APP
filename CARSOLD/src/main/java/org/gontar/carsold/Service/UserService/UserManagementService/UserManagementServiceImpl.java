package org.gontar.carsold.Service.UserService.UserManagementService;

import com.google.cloud.storage.*;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder;
    private final Mapper<User, UserDto> mapper;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserEmailNotificationService userEmailNotificationService;
    private final CookieService cookieService;

    public UserManagementServiceImpl(UserRepository repository, BCryptPasswordEncoder encoder, Mapper<User, UserDto> mapper, JwtService jwtService, UserDetailsService userDetailsService, UserEmailNotificationService userEmailNotificationService, CookieService cookieService) {
        this.repository = repository;
        this.encoder = encoder;
        this.mapper = mapper;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userEmailNotificationService = userEmailNotificationService;
        this.cookieService = cookieService;
    }

    // sends account activating token link via email
    @Override
    public void registerUser(UserDto userDto) {
        User existingEmail = repository.findByEmail(userDto.getEmail());
        User existingUsername = repository.findByUsername(userDto.getUsername());
        User user;
        if (existingEmail != null && !existingEmail.getActive()) {
            user = existingEmail;
            user.setUsername(userDto.getUsername());
            user.setPassword(encoder.encode(userDto.getPassword()));
            user.setActive(false);
            user.setOauth2User(false);
        } else if (existingUsername != null && !existingUsername.getActive()) {
            user = existingUsername;
            user.setEmail(userDto.getEmail());
            user.setPassword(encoder.encode(userDto.getPassword()));
            user.setActive(false);
            user.setOauth2User(false);
        } else {
            user = mapper.mapToEntity(userDto);
            user.setEmail(userDto.getEmail());
            user.setUsername(userDto.getUsername());
            user.setPassword(encoder.encode(userDto.getPassword()));
            user.setActive(false);
            user.setOauth2User(false);
        }
        repository.save(user);

        String token = jwtService.generateToken(user.getUsername(), 30);
        String link = frontendUrl + "activate?token=" + token;
        userEmailNotificationService.sendVerificationEmail(user.getEmail(), link);
    }

    //changes password when recovery
    @Override
    public String recoveryChangePassword(String token, String password, HttpServletResponse response) {
        try {
            Claims claims = jwtService.extractAllClaims(token);    //gets info about user and token
            String username = claims.getSubject();                 //gets username from claims
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            boolean isValid = jwtService.validateToken(token, userDetails);
            if (isValid) {
                User user = repository.findByUsername(username);
                user.setPassword(encoder.encode(password));
                repository.save(user);

                String newToken = jwtService.generateToken(user.getUsername(), 600);    //generates new token for authenticated session
                ResponseCookie authCookie = cookieService.createCookie(newToken, 10);
                response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());   //adds cookie to response
                return "success";
            }
            return "fail";
        } catch (Exception e) {
            System.err.println("Failed to change authenticated user and change password: " + e.getMessage());
            return "fail";
        }
    }

    //changes password
    @Override
    public String changePassword(String password, HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt != null) {
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            user.setPassword(encoder.encode(password));
            repository.save(user);
            return "success";
        }
        return "fail";
    }

    //sends username
    @Override
    public String getUsername(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        if (token != null) {
            return jwtService.extractUsername(token);
        }
        return null;
    }

    //deletes user, also his cloud storage
    @Override
    public boolean deleteUserAccount(HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);

            String folderPrefix = username + "/";
            Storage storage = StorageOptions.getDefaultInstance().getService();

            storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                    .iterateAll()
                    .forEach(Blob::delete);

            repository.delete(user);

            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
