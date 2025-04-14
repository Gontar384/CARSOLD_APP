package org.gontar.carsold.Controller.UserController;

import org.gontar.carsold.Domain.Model.Universal.SingleBooleanDto;
import org.gontar.carsold.Domain.Model.User.UserInfoDto;
import org.gontar.carsold.Service.UserService.InfoService.InfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class InfoController {

    private final InfoService service;

    public InfoController(InfoService service) {
        this.service = service;
    }

    @GetMapping("/checkLogin")
    public ResponseEntity<SingleBooleanDto> checkLogin(@RequestParam("login") String login) {
        boolean loginExists = service.checkLogin(login);
        SingleBooleanDto response = new SingleBooleanDto(loginExists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkInfo")
    public ResponseEntity<UserInfoDto> checkInfo(@RequestParam("login") String login) {
        return ResponseEntity.ok(service.checkInfo(login));
    }

    @GetMapping("/checkGoogleAuth")
    public ResponseEntity<SingleBooleanDto> checkGoogleAuth() {
        boolean isGoogleAuth = service.checkGoogleAuth();
        SingleBooleanDto response = new SingleBooleanDto(isGoogleAuth);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkOldPassword")
    public ResponseEntity<SingleBooleanDto> checkOldPassword(@RequestParam("password") String password) {
        boolean passwordMatches = service.checkOldPassword(password);
        SingleBooleanDto response = new SingleBooleanDto(passwordMatches);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkAdmin")
    public ResponseEntity<SingleBooleanDto> checkAdmin() {
        boolean isAdmin = service.checkAdmin();
        SingleBooleanDto response = new SingleBooleanDto(isAdmin);
        return ResponseEntity.ok(response);
    }
}
