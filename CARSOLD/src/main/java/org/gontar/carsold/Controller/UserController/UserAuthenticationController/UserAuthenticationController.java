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

@RestController
@RequestMapping("/api")
public class UserAuthenticationController {

    private final UserAuthenticationService service;

    public UserAuthenticationController(UserAuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/auth/csrf")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }

    @GetMapping("/auth/checkAuth")
    public ResponseEntity<?> getAuthCheck(HttpServletRequest request) {
        if (service.checkAuthentication(request)) return ResponseEntity.ok().build();
        else return ResponseEntity.noContent().build();
    }

    @GetMapping("/auth/refreshJwt")
    public ResponseEntity<?> getJwtRefreshed(HttpServletRequest request, HttpServletResponse response) {
        service.refreshJwt(request, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/keepSessionAlive")
    public ResponseEntity<?> getSessionActive() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/activateAccount")
    public ResponseEntity<?> getAccountActive(@RequestParam("token") String token, HttpServletResponse response) {
        service.activateAccount(token, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/authenticate")
    public ResponseEntity<?> getAuthentication(@RequestParam("login") String login, @RequestParam("password")
    String password, HttpServletResponse response) {
        service.authenticate(login, password, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/logout")
    public ResponseEntity<?> getLogout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        service.logout(request, response, authentication);
        return ResponseEntity.ok().build();
    }
}
