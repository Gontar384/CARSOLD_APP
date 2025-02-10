package org.gontar.carsold.Controller.UserController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Model.AuthDto;
import org.gontar.carsold.Domain.Model.SingleStringDto;
import org.gontar.carsold.Service.UserService.AuthenticationService.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/auth/getCsrfToken")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }

    @GetMapping("/auth/checkAuth")
    public ResponseEntity<?> checkAuth() {
        if (service.checkAuth()) return ResponseEntity.ok().build();
        else return ResponseEntity.noContent().build();
    }

    @GetMapping("/auth/refreshJwt")
    public ResponseEntity<?> refreshJwt(HttpServletResponse response) {
        service.refreshJwt(response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/keepSessionAlive")
    public ResponseEntity<?> keepSessionAlive() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/activateAccount")
    public ResponseEntity<?> activateAccount(@RequestBody SingleStringDto singleStringDto, HttpServletResponse response) {
        String token = singleStringDto.getValue();
        service.activateAccount(token, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthDto authDto, HttpServletResponse response) {
        String password = authDto.getPassword();
        String login = authDto.getLogin();
        service.authenticate(login, password, response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        service.logout(request, response, authentication);
        return ResponseEntity.ok().build();
    }
}
