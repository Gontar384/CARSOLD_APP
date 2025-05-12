package org.gontar.carsold.Controller.UserController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Model.User.AuthDto;
import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
import org.gontar.carsold.Service.UserService.AuthenticationService.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @GetMapping("/public/auth/checkAuth")
    public ResponseEntity<?> checkAuth() {
        if (service.checkAuth()) return ResponseEntity.ok().build();
        else return ResponseEntity.noContent().build();
    }

    @GetMapping("/private/auth/fetchJwt")
    public ResponseEntity<?> fetchJwt(HttpServletResponse response) {
        service.fetchJwt(response);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/public/auth/activateAccount")
    public ResponseEntity<?> activateAccount(@RequestBody SingleStringDto singleStringDto, HttpServletRequest request, HttpServletResponse response) {
        String token = singleStringDto.getValue();
        service.activateAccount(token, request, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/public/auth/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthDto authDto, HttpServletResponse response) {
        String password = authDto.getPassword();
        String login = authDto.getLogin();
        service.authenticate(login, password, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/public/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        service.logout(request, response, authentication);
        return ResponseEntity.ok().build();
    }
}
