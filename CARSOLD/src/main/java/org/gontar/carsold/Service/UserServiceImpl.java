package org.gontar.carsold.Service;

import com.google.cloud.storage.*;
import com.google.cloud.vision.v1.*;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.google.protobuf.ByteString;
import io.jsonwebtoken.Claims;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${PERSPECTIVE_API_KEY}")
    private String perspectiveApiKey;

    @Value("${CLOUD_NATURAL_LANGUAGE_API_KEY}")
    private String cloudNaturalLanguageApiKey;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    @Value("${PLACES_API_KEY}")
    private String placesApiKey;

    private final UserRepository repository;
    private final Mapper<User, UserDto> mapper;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender emailSender;
    private final UserDetailsService userDetailsService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public UserServiceImpl(UserRepository repository, Mapper<User, UserDto> mapper,
                           BCryptPasswordEncoder encoder, JwtService jwtService, AuthenticationManager authenticationManager,
                           JavaMailSender emailSender, UserDetailsService userDetailsService, OAuth2AuthorizedClientService authorizedClientService) {
        this.repository = repository;
        this.mapper = mapper;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailSender = emailSender;
        this.userDetailsService = userDetailsService;
        this.authorizedClientService = authorizedClientService;
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
        String[] inappropriateWords = {"cwel"};
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
        sendVerificationEmail(user.getEmail(), link);
    }

    //creates email message
    @Override
    public void sendVerificationEmail(String email, String link) {
        User user = repository.findByEmail(email);
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("CAR$OLD Account Activation");

            String emailContent = "<p style='font-size: 25px;'>Thank you for registering " + user.getUsername() + "! To activate your account, please click here:</p>" +
                    "<div style='background-color: #caf04f; width: 407px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                    "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' href=\"" + link + "\">" +
                    "Activate Account" +
                    "</a>" +
                    "</div>" +
                    "<p>If link expired - register again.<br><br><hr>" +
                    "<p>This message was sent automatically. Do not reply.</p>";

            helper.setText(emailContent, true);

            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    //activates account
    @Override
    public String activateAccount(String token, HttpServletResponse response) {
        try {
            Claims claims = jwtService.extractAllClaims(token);
            String username = claims.getSubject();
            User user = repository.findByUsername(username);

            if (!user.getActive()) {
                user.setActive(true);
                repository.save(user);
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String newToken = jwtService.generateToken(user.getUsername(), 600);
            ResponseCookie authCookie = createCookie(newToken, 10);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
            return "Activation success";
        } catch (Exception e) {
            System.err.println("Failed to activate account: " + e.getMessage());
            return "Activation failed";
        }
    }

    //checks user's auth
    @Override
    public boolean checkAuthentication(HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt == null) {
            return false; // No token found
        }
        String username = jwtService.extractUsername(jwt);
        if (username == null) {
            return false; // Username not found in token
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtService.validateToken(jwt, userDetails);
    }

    //logs user out (deletes jwt and delete OAuth2 session if needed)
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    oauth2Token.getAuthorizedClientRegistrationId(),
                    oauth2Token.getName()
            );
            if (client != null) {
                String tokenValue = client.getAccessToken().getTokenValue();
                revokeGoogleToken(tokenValue);
                authorizedClientService.removeAuthorizedClient(
                        oauth2Token.getAuthorizedClientRegistrationId(),
                        oauth2Token.getName()
                );
            }
        }
        HttpSession session = request.getSession(false);    //deletes session
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        ResponseCookie deleteCookie = createCookie("", 0);
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }

    //deletes OAuth2 token
    private void revokeGoogleToken(String token) {
        RestTemplate restTemplate = new RestTemplate();
        String revokeUrl = "https://oauth2.googleapis.com/revoke";
        try {
            restTemplate.postForEntity(revokeUrl, Map.of("token", token), String.class);
        } catch (Exception e) {
            System.err.println("Error revoking Google token: " + e.getMessage());
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

    //auth user using email or username
    @Override
    public void authenticate(String login, String password, HttpServletResponse response) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), password));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getUsername(), 600);
            ResponseCookie authCookie = createCookie(token, 10);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
        }
    }

    //refreshes JWT, checks previous one validation and sends new one
    @Override
    public void refreshJwt(HttpServletRequest request, HttpServletResponse response) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt != null) {
            String username = jwtService.extractUsername(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            boolean isValid = jwtService.validateToken(jwt, userDetails);
            if (isValid) {
                String newToken = jwtService.generateToken(username, 600);
                ResponseCookie jwtCookie = createCookie(newToken, 10);
                response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
            }
        }
    }

    //sends email with link with JWT to where user can change password
    @Override
    public void sendPasswordRecoveryEmail(String email) {
        User user = repository.findByEmail(email);
        String token = jwtService.generateToken(user.getUsername(), 10);
        String link = frontendUrl + "very3secret8password4change?token=" + token;
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("CAR$OLD Password Recovery");

            String emailContent = "<p style='font-size: 25px;'>Hello " + user.getUsername() + "! To change your password, please click the following link:</p>" +
                    "<div style='background-color: #d3d61c; width: 435px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                    "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' href=\"" + link + "\">" +
                    "Change password" +
                    "</a>" +
                    "</div><hr>" +
                    "<p>This message was sent automatically. Do not reply.</p>";

            helper.setText(emailContent, true);

            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
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
                ResponseCookie authCookie = createCookie(newToken, 10);
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


    //sends username
    @Override
    public String getUsername(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        if (token != null) {
            return jwtService.extractUsername(token);
        }
        return null;
    }

    //sends profile pic
    @Override
    public String getProfilePic(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        if (token != null) {
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            return user.getProfilePic();
        }
        return null;
    }

    //checks for profilePic sensitive content and then uploads profilePic to cloud
    @Override
    public String uploadProfilePicWithSafeSearch(MultipartFile file, HttpServletRequest request) throws IOException {

        if (file.getSize() > 3 * 1024 * 1024) {
            return "Could not upload, image is too large.";
        }
        if (isImageSensitive(file)) {
            return "Could not upload, image contains sensitive content.";
        }

        String token = jwtService.extractTokenFromCookie(request);
        String username = jwtService.extractUsername(token);
        User user = repository.findByUsername(username);
        user.setProfilePic(uploadProfilePic(file, username));
        repository.save(user);

        return null;
    }

    //uploads image to Google Cloud
    private String uploadProfilePic(MultipartFile file, String username) throws IOException {

        String fileName = username + "/" + username + ".profilePic";

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, file.getBytes());

        return String.format("https://storage.googleapis.com/%s/%s?timestamp=%d", bucketName, fileName, System.currentTimeMillis());
    }

    //checks if image contains sensitive content
    private boolean isImageSensitive(MultipartFile file) throws IOException {
        ByteString imgBytes = ByteString.copyFrom(file.getBytes());

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            Image img = Image.newBuilder().setContent(imgBytes).build();

            Feature feature = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(img)
                    .build();

            BatchAnnotateImagesRequest batchRequest = BatchAnnotateImagesRequest.newBuilder()
                    .addRequests(request)
                    .build();

            BatchAnnotateImagesResponse batchResponse = vision.batchAnnotateImages(batchRequest);
            AnnotateImageResponse response = batchResponse.getResponsesList().getFirst();
            SafeSearchAnnotation safeSearch = response.getSafeSearchAnnotation();

            //uses SafeSearch values
            return (safeSearch.getAdultValue() >= 3 ||
                    safeSearch.getViolenceValue() >= 3 ||
                    safeSearch.getRacyValue() >= 3);
        }
    }

    //deletes profile pic in cloud and repository
    @Override
    public void deleteProfilePic(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        String username = jwtService.extractUsername(token);

        String fileName = username + "/" + username + ".profilePic";

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);

        storage.delete(blobId);

        User user = repository.findByUsername(username);
        user.setProfilePic(null);
        repository.save(user);
    }

    //updates contact name, checks if name is proper name
    @Override
    public boolean changeName(String name, HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);

            boolean apiResponse = isValidName(name);
            if (apiResponse) {
                user.setName(name);
                repository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //checks if the name is proper
    public boolean isValidName(String name) {
        try {
            String apiUrl = "https://language.googleapis.com/v1/documents:analyzeEntities?key=" + cloudNaturalLanguageApiKey;

            //creates payload
            JSONObject document = new JSONObject();
            document.put("content", name);
            document.put("type", "PLAIN_TEXT");

            JSONObject requestPayload = new JSONObject();
            requestPayload.put("document", document);

            //crates headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            //sets up and sends request
            HttpEntity<String> requestEntity = new HttpEntity<>(requestPayload.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

            //parses response
            JSONObject responseJson = new JSONObject(responseEntity.getBody());
            for (Object entityObj : responseJson.getJSONArray("entities")) {
                JSONObject entity = (JSONObject) entityObj;
                String entityType = entity.getString("type");
                if ("PERSON".equals(entityType)) {
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //updates contact phone, checks if number is proper
    @Override
    public boolean changePhone(String phone, HttpServletRequest request) {
        try {
            if (!phone.startsWith("+")) {
                phone = "+48" + phone;
            }

            PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();
            Phonenumber.PhoneNumber phoneNumber = phoneNumberUtil.parse(phone, "");

            //checks if valid
            if (!phoneNumberUtil.isValidNumber(phoneNumber)) {
                return false;
            }

            //formats
            String formattedPhoneNumber = phoneNumberUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);

            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            user.setPhone(formattedPhoneNumber);
            repository.save(user);

            return true;
        } catch (Exception e) {
            System.out.println("Error changing phone number: " + e.getMessage());
            return false;
        }
    }

    //updates contact city
    @Override
    public boolean changeCity(String city, HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            user.setCity(city);
            repository.save(user);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //returns contact info using map
    @Override
    public Map<String, String>fetchInfo(HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            HashMap<String, String> info = new HashMap<>();
            info.put("name", user.getName());
            info.put("phone", user.getPhone());
            info.put("city", user.getCity());
            return info;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
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

    //updates contactPublic
    @Override
    public boolean changeContactInfoPublic(HttpServletRequest request, boolean isPublic) {
        try {
            String jwt = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            user.setContactPublic(isPublic);
            repository.save(user);
            return user.getContactPublic();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //returns contactPublic
    @Override
    public boolean fetchContactInfoPublic(HttpServletRequest request) {
        try {
            String jwt = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            return user.getContactPublic();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //fetches suggestions from Places API
    @Override
    public String fetchCitySuggestions(String value) {
        System.out.println("city: " + value);
        RestTemplate restTemplate = new RestTemplate();
        String url = UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/place/autocomplete/json")
                .queryParam("input", value)
                .queryParam("components", "country:pl")
                .queryParam("key", placesApiKey)
                .queryParam("types", "geocode")
                .build()
                .toString();

        return restTemplate.getForObject(url, String.class);
    }

    //creates cookie
    private ResponseCookie createCookie(String token, long time) {
        return ResponseCookie.from("JWT", token)
                .httpOnly(true)
                .secure(false)                                  //enabled only for production
                .path("/")
                .sameSite("Lax")                                //restricts cookies sending via cross-site requests
                .maxAge(Duration.ofHours(time))
                .build();
    }
}

