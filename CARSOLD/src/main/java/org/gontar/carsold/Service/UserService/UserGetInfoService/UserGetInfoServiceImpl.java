package org.gontar.carsold.Service.UserService.UserGetInfoService;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
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
public class UserGetInfoServiceImpl implements UserGetInfoService {

    @Value("${PERSPECTIVE_API_KEY}")
    private String perspectiveApiKey;

    private final UserRepository repository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    public UserGetInfoServiceImpl(UserRepository repository,
                                  JwtService jwtService, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.encoder = encoder;
    }

    //checks if email exists
    @Override
    public boolean findEmail(String email) {
        return repository.existsByEmail(email);
    }

    //checks if username exists
    @Override
    public boolean findUsername(String username) {
        return repository.existsByUsername(username);
    }

    //checks if username is appropriate
    @Override
    public boolean checkIfUsernameSafe(String username) {
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
            //sets headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            //builds API url
            String fullUrl = apiUrl + "?key=" + perspectiveApiKey;
            //creates request
            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, request, String.class);
            //parses response
            JSONObject jsonResponse = new JSONObject(Objects.requireNonNull(response.getBody()));
            double toxicityScore = jsonResponse
                    .getJSONObject("attributeScores")
                    .getJSONObject("TOXICITY")
                    .getJSONObject("summaryScore")
                    .getDouble("value");

            return toxicityScore < 0.5;
        } catch (Exception e) {
            System.err.println("Error checking if username is toxic: " + e.getMessage());
            return false;
        }
    }

    //helper method to find user by email or username
    private User manageLogin(String login) {
        if (login == null) return null;
        return login.contains("@") ? repository.findByEmail(login) : repository.findByUsername(login);
    }

    //checks if account is active
    @Override
    public boolean checkActive(String login) {
        User user = manageLogin(login);
        return user != null && user.getActive();
    }

    //checks if user auth with OAuth2 being non aut
    @Override
    public boolean checkOauth2(String login) {
        User user = manageLogin(login);
        return user != null && user.getOauth2User();
    }

    //checks if user auth with OAuth2 being auth
    @Override
    public boolean checkGoogleAuth(HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        return user != null && user.getOauth2User();
    }

    //validates password
    @Override
    public boolean checkPassword(String password, HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        return user != null && encoder.matches(password, user.getPassword());
    }

    //checks if username and password is valid before letting user authenticate
    @Override
    public boolean validateUser(String login, String password) {
        User user = manageLogin(login);
        return user != null && encoder.matches(password, user.getPassword());
    }
}
