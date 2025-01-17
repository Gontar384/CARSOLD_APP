package org.gontar.carsold.Controller.UserController.UserAuthenticationController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Service.UserService.UserAuthenticationService.UserAuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserAuthenticationController {

    private final UserAuthenticationService service;

    public UserAuthenticationController(UserAuthenticationService service) {
        this.service = service;
    }

    //activates account
    @GetMapping("/auth/activate")
    public ResponseEntity<Boolean> getUserActivated(@RequestParam("token") String token, HttpServletResponse response) {
        boolean result = service.activateAccount(token, response);
        return ResponseEntity.ok(result);
    }

    //gets csrf token when app mounts
    @GetMapping("/auth/csrf")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }

    //login, authenticate and authorize user
    @GetMapping("/auth/login")
    public ResponseEntity<Boolean> getAuthentication(@RequestParam("login") String login, @RequestParam("password")
    String password, HttpServletResponse response) {
        boolean result = service.authenticate(login, password, response);
        return ResponseEntity.ok(result);
    }

    //checks user authentication
    @GetMapping("/auth/check-authentication")
    public ResponseEntity<Map<String, Boolean>> getAuthenticationCheck(HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isAuth = service.checkAuthentication(request);
        response.put("isAuth", isAuth);
        return ResponseEntity.ok(response);
    }

    //logs out, deletes JWT
    @GetMapping("/auth/logout")
    public ResponseEntity<Boolean> getLogout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        boolean result = service.logout(request, response, authentication);
        return ResponseEntity.ok(result);
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
}
