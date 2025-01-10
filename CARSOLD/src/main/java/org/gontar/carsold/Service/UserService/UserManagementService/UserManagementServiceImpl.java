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
    public boolean registerUser(UserDto userDto) {
        try {
            User user = findOrCreateUser(userDto);
            updateUserDetails(user, userDto);
            repository.save(user);

            sendActivationEmail(user);
            return true;
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            return false;
        }
    }

    private User findOrCreateUser(UserDto userDto) {
        User existingEmail = repository.findByEmail(userDto.getEmail());
        if (existingEmail != null) {
            if (!existingEmail.getActive()) {
                return existingEmail;
            } else {
                throw new IllegalStateException("Account with email " + userDto.getEmail() + " already exists and it's active");
            }
        }

        User existingUsername = repository.findByUsername(userDto.getUsername());
        if (existingUsername != null) {
            if (!existingUsername.getActive()) {
                return existingUsername;
            }
            throw new IllegalStateException("Account with username " + userDto.getUsername() + " already exists and it's active");
        }

        return mapper.mapToEntity(userDto);
    }

    private void updateUserDetails(User user, UserDto userDto) {
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setPassword(encoder.encode(userDto.getPassword()));
        user.setActive(false);
        user.setOauth2User(false);
    }

    private void sendActivationEmail(User user) {
        String token = jwtService.generateToken(user.getUsername(), 30);
        String link = frontendUrl + "activate?token=" + token;
        userEmailNotificationService.sendVerificationEmail(user.getEmail(), link);
    }

    //changes password when recovery
    @Override
    public boolean recoveryChangePassword(String token, String password, HttpServletResponse response) {
        Claims claims = jwtService.extractAllClaims(token);
        if (claims == null) {
            return false;
        }

        String username = claims.getSubject();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!jwtService.validateToken(token, userDetails)) {
            return false;
        }

        User user = repository.findByUsername(username);
        if (user == null) {
            return false;
        }

        user.setPassword(encoder.encode(password));
        repository.save(user);

        String newToken = jwtService.generateToken(username, 600);
        ResponseCookie authCookie = cookieService.createCookie(newToken, 10);
        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());

        return true;
    }

    //changes password
    @Override
    public boolean changePassword(String password, HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt != null) {
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            user.setPassword(encoder.encode(password));
            repository.save(user);
            return true;
        }
        return false;
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
