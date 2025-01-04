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

@Service
public class UserGetInfoServiceImpl implements UserGetInfoService {

    @Value("${PERSPECTIVE_API_KEY}")
    private String perspectiveApiKey;

    private final UserRepository repository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    public UserGetInfoServiceImpl(UserRepository repository, JwtService jwtService, BCryptPasswordEncoder encoder) {
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

        //custom additional check
        String[] inappropriateWords = {"cwel", "frajer", "chuj"};
        for (String word : inappropriateWords) {
            if (username.toLowerCase().contains(word)) {
                return false;
            }
        }

        String apiUrl = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
        List<String> languages = List.of("en", "pl");

        RestTemplate restTemplate = new RestTemplate();

        try {
            JSONObject payload = new JSONObject();
            payload.put("comment", new JSONObject().put("text", username));
            payload.put("languages", languages);
            payload.put("requestedAttributes", new JSONObject().put("TOXICITY", new JSONObject()));
            //sets headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            //builds API url
            String fullUrl = apiUrl + "?key=" + perspectiveApiKey;
            //makes request
            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, request, String.class);
            //parses response
            JSONObject jsonResponse = new JSONObject(response.getBody());
            double toxicityScore = jsonResponse
                    .getJSONObject("attributeScores")
                    .getJSONObject("TOXICITY")
                    .getJSONObject("summaryScore")
                    .getDouble("value");

            return toxicityScore < 0.5;
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return false;
        }
    }

    //checks if user's account is active
    @Override
    public boolean checkActive(String login) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        if (user != null) {
            return user.getActive();
        }
        return false;
    }

    //checks if user auth with OAuth2
    @Override
    public boolean checkOauth2(String login) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        if (user != null) {
            return user.getOauth2User();
        }
        return false;
    }

    @Override
    public boolean checkGoogleAuth(HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt != null) {
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            return user.getOauth2User();
        }
        return false;
    }

    //validates password
    @Override
    public boolean checkPassword(String password, HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt != null) {
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            return encoder.matches(password, user.getPassword());
        }
        return false;
    }

    //checks if username and password is valid before letting user authenticate
    @Override
    public boolean validateUser(String login, String password) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        return encoder.matches(password, user.getPassword());
    }
}
