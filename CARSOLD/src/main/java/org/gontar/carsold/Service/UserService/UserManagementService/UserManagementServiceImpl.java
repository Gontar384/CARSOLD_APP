package org.gontar.carsold.Service.UserService.UserManagementService;

import com.google.cloud.storage.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Exceptions.CustomExceptions.DeleteException;
import org.gontar.carsold.Exceptions.CustomExceptions.EmailSendingException;
import org.gontar.carsold.Exceptions.CustomExceptions.RegisterUserException;
import org.gontar.carsold.Exceptions.CustomExceptions.UserDataException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

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

    public UserManagementServiceImpl(UserRepository repository, BCryptPasswordEncoder encoder,
                                     Mapper<User, UserDto> mapper, JwtService jwtService,
                                     UserEmailNotificationService userEmailNotificationService,
                                     CookieService cookieService) {
        this.repository = repository;
        this.encoder = encoder;
        this.mapper = mapper;
        this.jwtService = jwtService;
        this.userEmailNotificationService = userEmailNotificationService;
        this.cookieService = cookieService;
    }

    @Override
    public void registerUser(UserDto userDto) {
        Objects.requireNonNull(userDto, "userDto cannot be null");
        try {
            User user = findOrCreateUser(userDto);

            updateUserDetails(user, userDto);
            sendActivationEmail(user);

            repository.save(user);
        } catch (UserDataException | EmailSendingException | RegisterUserException e) {
            throw new RegisterUserException("Registration process failed: " + e.getMessage());
        }
    }

    private User findOrCreateUser(UserDto userDto) {
        User existingEmail = repository.findByEmail(userDto.getEmail());
        if (existingEmail != null) {
            if (existingEmail.getActive())
                throw new UserDataException("User with email " + userDto.getEmail() + " already exists and it's active");
            return existingEmail;
        }

        User existingUsername = repository.findByUsername(userDto.getUsername());
        if (existingUsername != null) {
            if (existingUsername.getActive())
                throw new UserDataException("User with email " + userDto.getEmail() + " already exists and it's active");
            return existingUsername;
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

        userEmailNotificationService.sendAccountActivationEmail(user.getEmail(), user.getUsername(), link);
    }

    @Override
    public String fetchUsername(HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        return user.getUsername();
    }

    @Override
    public void changePassword(String password, HttpServletRequest request) {
        Objects.requireNonNull(password, "password cannot be null");
        User user = jwtService.extractUserFromRequest(request);

        user.setPassword(encoder.encode(password));
        repository.save(user);
    }

    @Override
    public void changePasswordRecovery(String token, String password, HttpServletResponse response) {
        Objects.requireNonNull(token, "token cannot be null");
        Objects.requireNonNull(password, "password cannot be null");
        User user = jwtService.extractUserFromToken(token);

        user.setPassword(encoder.encode(password));
        repository.save(user);

        cookieService.addCookieWithNewTokenToResponse(user.getUsername(), response);
    }

    @Override
    public void deleteUser(HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        try {
            deleteUserInCloud(user.getUsername());
            repository.delete(user);
        } catch (StorageException e) {
            throw new DeleteException("Failed to delete user: " + e.getMessage());
        }
    }

    private void deleteUserInCloud(String username) {
        String folderPrefix = username + "/";
        Storage storage = StorageOptions.getDefaultInstance().getService();
        storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                .iterateAll()
                .forEach(Blob::delete);
    }
}
