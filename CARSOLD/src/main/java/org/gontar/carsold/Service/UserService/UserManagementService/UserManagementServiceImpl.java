package org.gontar.carsold.Service.UserService.UserManagementService;

import com.google.cloud.storage.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Exceptions.CustomExceptions.*;
import org.gontar.carsold.Model.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Objects;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${PERSPECTIVE_API_KEY}")
    private String perspectiveApiKey;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;
    private final UserEmailNotificationService userEmailNotificationService;
    private final CookieService cookieService;

    public UserManagementServiceImpl(UserRepository repository, BCryptPasswordEncoder encoder,
                                     JwtService jwtService, UserEmailNotificationService userEmailNotificationService,
                                     CookieService cookieService) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.userEmailNotificationService = userEmailNotificationService;
        this.cookieService = cookieService;
    }

    @Override
    public User registerUser(User user) {
        Objects.requireNonNull(user, "user cannot be null");
        Objects.requireNonNull(user.getPassword(), "password cannot be null");
        try {
            if (!user.getUsername().matches("^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$")) {
                throw new InappropriateValueException("Username contains wrong characters: " + user.getUsername());
            }
            boolean result = checkIfUsernameSafe(user.getUsername());
            if (!result) throw new InappropriateValueException("Username is inappropriate");

            User processedUser = findOrCreateUser(user);

            updateUser(processedUser, user);
            sendActivationEmail(processedUser);

            repository.save(processedUser);
            return processedUser;
        } catch (UserDataException | EmailSendingException | RegisterUserException e) {
            throw new RegisterUserException("Registration process failed: " + e.getMessage());
        }
    }

    public boolean checkIfUsernameSafe(String username) {
        Objects.requireNonNull(username, "username cannot be null");
        if (!isUsernameFreeOfInappropriateWords(username)) return false;
        return isUsernameNonToxic(username);
    }

    private boolean isUsernameFreeOfInappropriateWords(String username) {
        String[] inappropriateWords = {"cwel", "frajer", "chuj", "murzyn", "hitler"};
        for (String word : inappropriateWords) {
            if (username.toLowerCase().contains(word)) return false;
        }

        return true;
    }

    private boolean isUsernameNonToxic(String username) {
        try {
            String apiUrl = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
            List<String> languages = List.of("en", "pl");

            RestTemplate restTemplate = new RestTemplate();

            JSONObject payload = new JSONObject();
            payload.put("comment", new JSONObject().put("text", username));
            payload.put("languages", languages);
            payload.put("requestedAttributes", new JSONObject().put("TOXICITY", new JSONObject()));

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");

            String fullUrl = apiUrl + "?key=" + perspectiveApiKey;

            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, request, String.class);

            JSONObject jsonResponse = new JSONObject(Objects.requireNonNull(response.getBody()));
            double toxicityScore = jsonResponse
                    .getJSONObject("attributeScores")
                    .getJSONObject("TOXICITY")
                    .getJSONObject("summaryScore")
                    .getDouble("value");

            return toxicityScore < 0.5;
        } catch (Exception e) {
            throw new ValueExternalCheckException("Perspective API failed to check username  " + username + ": " + e.getMessage());
        }
    }

    private User findOrCreateUser(User user) {
        User existingUserByEmail = repository.findByEmail(user.getEmail());
        User existingUserByUsername = repository.findByUsername(user.getUsername());

        if (existingUserByEmail != null && existingUserByUsername != null && !existingUserByEmail.equals(existingUserByUsername)) {
            throw new UserDataException("Email and username belong to different existing accounts");
        }

        if (existingUserByEmail != null) {
            if (existingUserByEmail.getActive()) {
                throw new UserDataException("User with email " + user.getEmail() + " already exists and it's active");
            }
            return existingUserByEmail;
        }
        if (existingUserByUsername != null) {
            if (existingUserByUsername.getActive()) {
                throw new UserDataException("User with username " + user.getUsername() + " already exists and it's active");
            }
            return existingUserByUsername;
        }

        return user;
    }

    private void updateUser(User processedUser, User user) {
        processedUser.setEmail(user.getEmail());
        processedUser.setUsername(user.getUsername());
        processedUser.setPassword(encoder.encode(user.getPassword()));
        processedUser.setActive(false);
        processedUser.setOauth2(false);
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
    public void changePassword(String oldPassword, String newPassword, HttpServletRequest request) {
        Objects.requireNonNull(oldPassword, "oldPassword cannot be null");
        Objects.requireNonNull(newPassword, "newPassword cannot be null");
        User user = jwtService.extractUserFromRequest(request);
        if (!encoder.matches(oldPassword, user.getPassword())) throw new InvalidPasswordException("Passwords do not match");

        user.setPassword(encoder.encode(newPassword));
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
    public void deleteUser(String password, HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        if (!user.getOauth2()) {
            Objects.requireNonNull(password, "password cannot be null");
            if (!encoder.matches(password, user.getPassword())) throw new InvalidPasswordException("Passwords do not match");
        }
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
