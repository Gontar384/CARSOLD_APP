package org.gontar.carsold.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Service.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserServiceImpl service;

    public UserController(UserServiceImpl service) {
        this.service = service;
    }

    //checks if mail already exists
    @GetMapping("/auth/register/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam("email") String email) {
        Map<String, Boolean> response = new HashMap<>();
        boolean exists = service.findEmail(email);
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    //checks if username already exists
    @GetMapping("/auth/register/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam("username") String username) {
        Map<String, Boolean> response = new HashMap<>();
        boolean exists = service.findUsername(username);
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    //registers user, saves to DB
    @PostMapping("/auth/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto) {
        service.registerUser(userDto);
        return ResponseEntity.ok("User saved");
    }

    //activates account
    @GetMapping("/auth/activate")
    public ResponseEntity<String> activate(@RequestParam("token") String token,
                                           HttpServletResponse response) {
        service.activateAccount(token, response);
        return ResponseEntity.ok("Account activated");
    }

    //gets csrf token when app mounts
    @GetMapping("/auth/csrf")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }

    //checks user authentication
    @GetMapping("/auth/check-authentication")
    public ResponseEntity<Map<String, Boolean>> checkAuthentication(HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isAuth = service.checkAuthentication(request);
        response.put("isAuth", isAuth);
        return ResponseEntity.ok(response);
    }

    //logs out, deletes JWT
    @GetMapping("/auth/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        service.logout(response);
        return ResponseEntity.ok("Logged out");
    }

    //checks if account is active
    @GetMapping("/auth/check-active")
    public ResponseEntity<Map<String, Boolean>> checkActive(@RequestParam("login") String login) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkActive(login);
        response.put("checks", checks);
        return ResponseEntity.ok(response);
    }

    //checks if user was authenticated with OAuth2
    @GetMapping("/auth/check-oauth2")
    public ResponseEntity<Map<String, Boolean>> checkOauth2(@RequestParam("login") String login) {
        Map<String, Boolean> response = new HashMap<>();
        boolean checks = service.checkOauth2(login);
        response.put("checks", checks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/validate-user")
    public ResponseEntity<Map<String, Boolean>>validateUser(@RequestParam("login") String login,
                                                            @RequestParam("password") String password){
        Map<String, Boolean> response = new HashMap<>();
        boolean isValid = service.validateUser(login, password);
        response.put("isValid", isValid);
        return ResponseEntity.ok(response);
    }

    //login, authenticate and authorize user
    @GetMapping("/auth/login")
    public ResponseEntity<String>login(@RequestParam("login") String login, @RequestParam("password")
                                       String password, HttpServletResponse response) {
        service.authenticate(login, password, response);
        return ResponseEntity.ok("User logged in");
    }

    //refreshes JWT, sends new one with new expiration date
    @GetMapping("/auth/refresh")
    public ResponseEntity<String>refreshToken(HttpServletRequest request, HttpServletResponse response){
        service.refreshJwt(request, response);
        return ResponseEntity.ok("JWT refreshed");
    }

    //simple request to keep session alive
    @GetMapping("/auth/keep-alive")
    public ResponseEntity<Void>keepAlive(){
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/password-recovery")
    public ResponseEntity<String>passwordRecovery(@RequestParam("email") String email){
        service.sendPasswordRecoveryEmail(email);
        return ResponseEntity.ok("Email sent");
    }

    @PostMapping("/auth/password-recovery-change")
    public ResponseEntity<String>passwordRecoveryChange(
            @RequestBody Map<String, String> payload, HttpServletResponse response){
        String token = payload.get("token");
        String password = payload.get("password");
        service.recoveryChangePassword(token, password, response);
        return ResponseEntity.ok("Password changed");
    }

    @GetMapping("/get-username")
    public ResponseEntity<Map<String,String>>getUsername(HttpServletRequest request){
        HashMap<String, String> usernameResponse = new HashMap<>();
        String username = service.getUsername(request);
        usernameResponse.put("username", username);
        return ResponseEntity.ok(usernameResponse);
    }
}
