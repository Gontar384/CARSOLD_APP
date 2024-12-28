package org.gontar.carsold.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Service.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserServiceImpl service;

    public UserController(UserServiceImpl service) {
        this.service = service;
    }

    //checks if email already exists
    @GetMapping("/auth/register/check-email")
    public ResponseEntity<Map<String, Boolean>> getEmail(@RequestParam("email") String email) {
        Map<String, Boolean> response = new HashMap<>();
        boolean exists = service.findEmail(email);
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    //checks if username already exists
    @GetMapping("/auth/register/check-username")
    public ResponseEntity<Map<String, Boolean>> getUsername(@RequestParam("username") String username) {
        Map<String, Boolean> response = new HashMap<>();
        boolean exists = service.findUsername(username);
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    //checks if username is appropriate
    @GetMapping("/auth/register/is-username-safe")
    public ResponseEntity<Map<String, Boolean>> getIfUsernameSafe(@RequestParam("username") String username) {
        HashMap<String, Boolean> response = new HashMap<>();
        boolean isSafe = service.checkIfUsernameSafe(username);
        response.put("isSafe", isSafe);
        return ResponseEntity.ok(response);
    }

    //registers user, saves to DB
    @PostMapping("/auth/register")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {
        service.registerUser(userDto);
        return ResponseEntity.ok("User saved");
    }

    //activates account
    @GetMapping("/auth/activate")
    public ResponseEntity<String> getUserActivated(@RequestParam("token") String token,
                                                   HttpServletResponse response) {
        String message = service.activateAccount(token, response);
        return ResponseEntity.ok(message);
    }

    //gets csrf token when app mounts
    @GetMapping("/auth/csrf")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }

    //checks user authentication
    @GetMapping("/auth/check-authentication")
    public ResponseEntity<Map<String, Boolean>> getAuthentication(HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isAuth = service.checkAuthentication(request);
        response.put("isAuth", isAuth);
        return ResponseEntity.ok(response);
    }

    //logs out, deletes JWT
    @GetMapping("/auth/logout")
    public ResponseEntity<String> getLogout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        service.logout(request, response, authentication);
        return ResponseEntity.ok("Logged out");
    }

    //checks if account is active
    @GetMapping("/auth/check-active")
    public ResponseEntity<Map<String, Boolean>> getUserActive(@RequestParam("login") String login) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkActive(login);
        response.put("checks", checks);
        return ResponseEntity.ok(response);
    }

    //checks if user was authenticated with OAuth2
    @GetMapping("/auth/check-oauth2")
    public ResponseEntity<Map<String, Boolean>> getUserOAuth2(@RequestParam("login") String login) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkOauth2(login);
        response.put("checks", checks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/check-google-auth")
    public ResponseEntity<Map<String, Boolean>> getUserGoogleAuth(HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkGoogleAuth(request);
        response.put("checks", checks);
        return ResponseEntity.ok(response);
    }

    //checks if login and password matches, used before proper auth
    @GetMapping("/auth/validate-user")
    public ResponseEntity<Map<String, Boolean>> getUserValidation(@RequestParam("login") String login,
                                                                  @RequestParam("password") String password) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isValid = service.validateUser(login, password);
        response.put("isValid", isValid);
        return ResponseEntity.ok(response);
    }

    //login, authenticate and authorize user
    @GetMapping("/auth/login")
    public ResponseEntity<String> getAuthentication(@RequestParam("login") String login, @RequestParam("password")
    String password, HttpServletResponse response) {
        service.authenticate(login, password, response);
        return ResponseEntity.ok("User logged in");
    }

    //refreshes JWT, sends new one with new expiration date
    @GetMapping("/auth/refresh")
    public ResponseEntity<String> getRefreshedToken(HttpServletRequest request, HttpServletResponse response) {
        service.refreshJwt(request, response);
        return ResponseEntity.ok("JWT refreshed");
    }

    //simple request to keep session alive
    @GetMapping("/auth/keep-alive")
    public ResponseEntity<Void> getSessionActive() {
        return ResponseEntity.ok().build();
    }

    //sends password recovery email
    @GetMapping("/auth/password-recovery")
    public ResponseEntity<String> getPasswordRecoveryEmail(@RequestParam("email") String email) {
        service.sendPasswordRecoveryEmail(email);
        return ResponseEntity.ok("Email sent");
    }

    //changes password
    @PutMapping("/auth/password-recovery-change")
    public ResponseEntity<String> updatePasswordRecovery(
            @RequestBody Map<String, String> payload, HttpServletResponse response) {
        String token = payload.get("token");
        String password = payload.get("password");
        String message = service.recoveryChangePassword(token, password, response);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/auth/password-change")
    public ResponseEntity<String> updatePassword(
            @RequestBody Map<String, String> payload, HttpServletRequest request) {
        String password = payload.get("password");
        System.out.println(password);
        String message = service.changePassword(password, request);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/auth/validate-password")
    public ResponseEntity<Map<String, Boolean>> getPasswordValidation(@RequestParam("password") String password, HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkPassword(password, request);
        response.put("checks", checks);
        return ResponseEntity.ok(response);
    }

    //fetches username
    @GetMapping("/get-username")
    public ResponseEntity<Map<String, String>> getUsername(HttpServletRequest request) {
        HashMap<String, String> usernameResponse = new HashMap<>();
        String username = service.getUsername(request);
        usernameResponse.put("username", username);
        return ResponseEntity.ok(usernameResponse);
    }

    //fetches profile pic
    @GetMapping("/get-profilePic")
    public ResponseEntity<Map<String, String>> getProfilePic(HttpServletRequest request) {
        HashMap<String, String> profilePicResponse = new HashMap<>();
        String profilePic = service.getProfilePic(request);
        profilePicResponse.put("profilePic", profilePic);
        return ResponseEntity.ok(profilePicResponse);
    }

    //uploads images to cloud and checks for sensitive content
    @PostMapping("/storage-upload-profilePic")
    public ResponseEntity<Map<String, String>> createImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        try {
            Map<String, String> response = new HashMap<>();
            String info = service.uploadProfilePicWithSafeSearch(file, request);
            response.put("info", info);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("Error uploading image: ", e.getMessage()));
        }
    }

    //deletes profilePic
    @DeleteMapping("/storage-delete-profilePic")
    public ResponseEntity<String> deleteImage(HttpServletRequest request) {
        service.deleteProfilePic(request);
        return ResponseEntity.ok("Image deleted");
    }

    @PostMapping("/contact-set-name")
    public ResponseEntity<String> cratedOrUpdateName(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String name = payload.get("name");
        String response = service.changeName(name, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/contact-set-phone")
    public ResponseEntity<String> createOrUpdatePhone(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String phone = payload.get("phone");
        String response = service.changePhone(phone, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/contact-set-city")
    public ResponseEntity<String> createOrUpdateCity(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String city = payload.get("city");
        String response = service.changeCity(city, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fetch-contact-info")
    public ResponseEntity<Map<String, String>> getContactInfo(HttpServletRequest request) {
        Map<String, String> response = service.fetchInfo(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Boolean> deleteUser(HttpServletRequest request) {
        return ResponseEntity.ok(service.deleteUserAccount(request));
    }
}
