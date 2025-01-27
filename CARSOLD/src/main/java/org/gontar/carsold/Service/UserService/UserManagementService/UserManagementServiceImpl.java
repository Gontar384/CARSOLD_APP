package org.gontar.carsold.Service.UserService.UserManagementService;

import com.google.cloud.storage.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.ErrorsAndExceptions.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
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
    private final UserEmailNotificationService userEmailNotificationService;
    private final CookieService cookieService;
    private final ErrorHandler errorHandler;

    public UserManagementServiceImpl(UserRepository repository, BCryptPasswordEncoder encoder,
                                     Mapper<User, UserDto> mapper, JwtService jwtService,
                                     UserEmailNotificationService userEmailNotificationService,
                                     CookieService cookieService, ErrorHandler errorHandler) {
        this.repository = repository;
        this.encoder = encoder;
        this.mapper = mapper;
        this.jwtService = jwtService;
        this.userEmailNotificationService = userEmailNotificationService;
        this.cookieService = cookieService;
        this.errorHandler = errorHandler;
    }

    // sends account activating token link via email
    @Override
    public boolean registerUser(UserDto userDto) {
        try {
            if (userDto == null) return false;

            User user = findOrCreateUser(userDto);
            if (user == null) return false;

            updateUserDetails(user, userDto);

            boolean emailSendingResult = sendActivationEmail(user);
            if (!emailSendingResult) return errorHandler.logBoolean("Email sending failed");

            repository.save(user);

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error registering user: " + e.getMessage());
        }
    }

    private User findOrCreateUser(UserDto userDto) {
        User existingEmail = repository.findByEmail(userDto.getEmail());
        if (existingEmail != null) {
            if (!existingEmail.getActive()) return existingEmail;
            return errorHandler.logObject("Account with email " + userDto.getEmail() + " already exists and it's active");
        }

        User existingUsername = repository.findByUsername(userDto.getUsername());
        if (existingUsername != null) {
            if (!existingUsername.getActive()) return existingUsername;
            return errorHandler.logObject("Account with username " + userDto.getUsername() + " already exists and it's active");
        }

        return mapper.mapToEntity(userDto);
    }

    private void updateUserDetails(User user, UserDto userDto) {
        if (user == null || userDto == null) return;

        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setPassword(encoder.encode(userDto.getPassword()));
        user.setActive(false);
        user.setOauth2User(false);
    }

    private boolean sendActivationEmail(User user) {
        if (user == null) return false;

        String token = jwtService.generateToken(user.getUsername(), 30);
        String link = frontendUrl + "activate?token=" + token;

        return userEmailNotificationService.sendVerificationEmail(user.getEmail(), user.getUsername(), link);
    }

    //changes password when recovery
    @Override
    public boolean recoveryChangePassword(String token, String password, HttpServletResponse response) {
        try {
            if (token == null) return false;

            User user = jwtService.extractUserFromToken(token);
            if (user == null) return false;

            user.setPassword(encoder.encode(password));
            repository.save(user);

            String newToken = jwtService.generateToken(user.getUsername(), 600);
            ResponseCookie authCookie = cookieService.createCookie(newToken, 10);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error recovery changing password: " + e.getMessage());
        }
    }

    //changes password
    @Override
    public boolean changePassword(String password, HttpServletRequest request) {
        try {
            if (password == null) return false;

            User user = jwtService.extractUserFromRequest(request);
            if (user == null) return false;

            user.setPassword(encoder.encode(password));
            repository.save(user);

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error changing password: " + e.getMessage());
        }
    }

    //sends username
    @Override
    public String fetchUsername(HttpServletRequest request) {
        return jwtService.extractUsernameFromRequest(request);
    }

    //deletes user, also his cloud storage
    @Override
    public boolean deleteUserAccount(HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user == null) return false;

            boolean result = deleteUserInCloud(user.getUsername());
            if (result) {
                repository.delete(user);

                return true;
            }

            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error deleting user: " + e.getMessage());
        }
    }

    private boolean deleteUserInCloud(String username) {
        try {
            String folderPrefix = username + "/";
            Storage storage = StorageOptions.getDefaultInstance().getService();

            storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                    .iterateAll()
                    .forEach(Blob::delete);

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error deleting user in cloud: " + e.getMessage());
        }
    }
}
