package org.gontar.carsold.Controller.UserController.UserGetInfoController;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Service.UserService.UserGetInfoService.UserGetInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserGetInfoController {

    private final UserGetInfoService service;

    public UserGetInfoController(UserGetInfoService service) {
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

    @GetMapping("/auth/validate-password")
    public ResponseEntity<Map<String, Boolean>> getPasswordValidation(@RequestParam("password") String password, HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkPassword(password, request);
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
}
