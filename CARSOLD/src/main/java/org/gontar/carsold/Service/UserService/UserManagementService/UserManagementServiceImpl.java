package org.gontar.carsold.Service.UserService.UserManagementService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Exception.CustomException.*;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.UserService.AuthenticationService.AuthenticationService;
import org.gontar.carsold.Service.UserService.EmailService.EmailService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${CLOUD_NATURAL_LANGUAGE_API_KEY}")
    private String cloudNaturalLanguageApiKey;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final MyUserDetailsService userDetailsService;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationService authenticationService;
    private final List<String> forbiddenWords;

    public UserManagementServiceImpl(UserRepository userRepository, OfferRepository offerRepository, MyUserDetailsService userDetailsService, BCryptPasswordEncoder encoder,
                                     JwtService jwtService, EmailService emailService, AuthenticationService authenticationService) throws IOException {
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.userDetailsService = userDetailsService;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.authenticationService = authenticationService;
        ObjectMapper mapper = new ObjectMapper();
        ForbiddenWords words;
        try (InputStream is = new ClassPathResource("forbidden-words.json").getInputStream()) {
            words = mapper.readValue(is, ForbiddenWords.class);
        }
        this.forbiddenWords = words.FORBIDDEN_WORDS;
    }

    @Transactional
    @Override
    public User registerUser(User user, boolean translate) {
        Objects.requireNonNull(user, "user cannot be null");
        user.setUsername(user.getUsername().trim());
        user.setEmail(user.getEmail().trim());
        try {
            if (!user.getUsername().matches("^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$")) {
                throw new InvalidValueException("Username contains wrong characters: " + user.getUsername());
            }
            User processedUser = findOrCreateUser(user);

            boolean result = checkIfUsernameSafe(user.getUsername());
            if (!result) throw new InappropriateContentException("Username is inappropriate");

            updateUser(processedUser, user);
            userRepository.save(processedUser);
            sendActivationEmail(processedUser, translate);

            return processedUser;
        } catch (UserDataException | EmailSendingException | RegisterUserException e) {
            throw new RegisterUserException("Registration process failed: " + e.getMessage());
        }
    }

    private User findOrCreateUser(User user) {
        String normalizedUsername = user.getUsername().toLowerCase();
        String normalizedEmail = user.getEmail().toLowerCase();

        User userByUsername = userRepository.findByUsernameLower(normalizedUsername);
        User userByEmail = userRepository.findByEmailLower(normalizedEmail);

        if (userByEmail != null && userByUsername != null && !userByEmail.getId().equals(userByUsername.getId())) {
            throw new UserDataException("Email and username belong to different existing accounts");
        }
        if (userByUsername != null) {
            if (userByUsername.getActive()) {
                throw new UserDataException("User with username " + user.getUsername() + " already exists and it's active");
            }
            return userByUsername;
        }
        if (userByEmail != null) {
            if (userByEmail.getActive()) {
                throw new UserDataException("User with email " + user.getEmail() + " already exists and it's active");
            }
            return userByEmail;
        }
        return user;
    }

    public boolean checkIfUsernameSafe(String username) {
        if (!isUsernameFreeOfInappropriateWords(username)) return false;
        return isUsernameNonToxic(username);
    }

    private boolean isUsernameFreeOfInappropriateWords(String username) {
        String lowered = username.toLowerCase();
        LevenshteinDistance levenshtein = LevenshteinDistance.getDefaultInstance();
        for (String word : forbiddenWords) {
            String w = word.toLowerCase();
            if (lowered.contains(w)) return false;
            int len = w.length();
            if (len >= 5) {
                for (int i = 0; i <= lowered.length() - len; i++) {
                    String sub = lowered.substring(i, i + len);
                    if (sub.matches(".*\\d.*")) continue;
                    int distance = levenshtein.apply(sub, w);
                    if (distance <= 1) return false;
                }
            }
        }
        return true;
    }

    private boolean isUsernameNonToxic(String username) {
        try {
            String apiUrl = "https://language.googleapis.com/v1/documents:moderateText?key=" + cloudNaturalLanguageApiKey;

            JSONObject document = new JSONObject();
            document.put("type", "PLAIN_TEXT");
            document.put("content", username);

            JSONObject payload = new JSONObject();
            payload.put("document", document);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            JSONObject json = new JSONObject(Objects.requireNonNull(response.getBody()));

            JSONArray categories = json.getJSONArray("moderationCategories");

            for (Object obj : categories) {
                JSONObject cat = (JSONObject) obj;
                String name = cat.getString("name");
                double confidence = cat.getDouble("confidence");

                if ((name.equals("Toxic") ||
                        name.equals("Insult") ||
                        name.equals("Profanity") ||
                        name.equals("Sexual") ||
                        name.equals("Hate")) && confidence > 0.25) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            throw new ExternalCheckException("Natural Language failed to check username " + username + ": " + e.getMessage());
        }
    }

    private void updateUser(User processedUser, User user) {
        processedUser.setEmail(user.getEmail());
        processedUser.setUsername(user.getUsername());
        processedUser.setPassword(encoder.encode(user.getPassword()));
        processedUser.setActive(false);
        processedUser.setOauth2(false);
    }

    private void sendActivationEmail(User user, boolean translate) {
        String token = jwtService.generateToken(user.getUsername(), 30);
        String link = frontendUrl + "/activate?token=" + token;

        emailService.sendAccountActivationEmail(user.getEmail(), user.getUsername(), link, translate);
    }

    @Override
    public String fetchUsername() {
        User user = userDetailsService.loadUser();
        return user.getUsername();
    }

    @Override
    public String fetchEmail() {
        User user = userDetailsService.loadUser();
        return user.getEmail();
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        Objects.requireNonNull(oldPassword, "oldPassword cannot be null");
        Objects.requireNonNull(newPassword, "newPassword cannot be null");
        User user = userDetailsService.loadUser();
        if (!encoder.matches(oldPassword, user.getPassword()))
            throw new InvalidPasswordException("Passwords do not match");

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void changePasswordRecovery(String token, String password, HttpServletRequest request, HttpServletResponse response) {
        Objects.requireNonNull(token, "token cannot be null");
        Objects.requireNonNull(password, "password cannot be null");
        try {
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByUsername(username);
            if (user == null) throw new UsernameNotFoundException("User not found");
            user.setPassword(encoder.encode(password));
            userRepository.save(user);

            UserDetails userDetails = new UserPrincipal(user);

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

            jwtService.addCookieWithNewTokenToResponse(user.getUsername(), response);
        } catch (JwtServiceException | AuthenticationException e) {
            throw new PasswordRecoveryChangeException("Changing password failed: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public void deleteUser(String password, HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        User user = userDetailsService.loadUser();
        if (!user.getOauth2()) {
            if (!encoder.matches(password, user.getPassword()))
                throw new InvalidPasswordException("Passwords do not match");
        }

        if (user.getOffers() != null) {
            for (Offer offer : user.getOffers()) {
                List<User> followers = userRepository.findByFollowedOffersContaining(offer);
                followers.forEach(follower -> follower.getFollowedOffers().remove(offer));
                userRepository.saveAll(followers);
            }
        }

        deleteUserInCloudStorage(user.getUsername());

        offerRepository.flush();
        userRepository.flush();
        userRepository.delete(user);

        authenticationService.logout(request, response, authentication);
    }

    private void deleteUserInCloudStorage(String username) {
        try {
            String folderPrefix = username + "/";
            Storage storage = StorageOptions.getDefaultInstance().getService();
            storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                    .iterateAll()
                    .forEach(Blob::delete);
        } catch (StorageException e) {
            throw new ExternalDeleteException("Failed to delete user in Google Cloud: " + e.getMessage());
        }
    }
}
