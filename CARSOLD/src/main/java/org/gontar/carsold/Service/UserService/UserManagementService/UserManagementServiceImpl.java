package org.gontar.carsold.Service.UserService.UserManagementService;

import com.google.cloud.storage.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

import java.util.*;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${PERSPECTIVE_API_KEY}")
    private String perspectiveApiKey;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final MyUserDetailsService userDetailsService;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationService authenticationService;

    public UserManagementServiceImpl(UserRepository userRepository, OfferRepository offerRepository, MyUserDetailsService userDetailsService, BCryptPasswordEncoder encoder,
                                     JwtService jwtService, EmailService emailService, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.userDetailsService = userDetailsService;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.authenticationService = authenticationService;
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
        for (String word : ForbiddenWords.WORDS) {
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
            throw new ExternalCheckException("Perspective API failed to check username  " + username + ": " + e.getMessage());
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
    public void changePassword(String oldPassword, String newPassword) {
        Objects.requireNonNull(oldPassword, "oldPassword cannot be null");
        Objects.requireNonNull(newPassword, "newPassword cannot be null");
        User user = userDetailsService.loadUser();
        if (!encoder.matches(oldPassword, user.getPassword())) throw new InvalidPasswordException("Passwords do not match");

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
            if (!encoder.matches(password, user.getPassword())) throw new InvalidPasswordException("Passwords do not match");
        }
        Set<Offer> followedOffers = userRepository.findFollowedOffersByUserId(user.getId());
        if (followedOffers != null) {
            followedOffers.forEach(offer -> {
                offer.setFollows(offer.getFollows() - 1);
                offerRepository.save(offer);
            });
        }
        List<Offer> userOffers = user.getOffers() != null ? new ArrayList<>(user.getOffers()) : Collections.emptyList();
        userOffers.forEach(offer -> {
            List<User> followers = userRepository.findByFollowedOffersContaining(offer);
            followers.forEach(follower -> {
                if (follower.getFollowedOffers() != null) {
                    follower.getFollowedOffers().removeIf(o -> o.getId().equals(offer.getId()));
                    userRepository.save(follower);
                }
            });
        });
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
