package org.gontar.carsold.Controller.UserController.UserInfoController;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.Dto.SingleBooleanDto;
import org.gontar.carsold.Model.Dto.UserInfoDto;
import org.gontar.carsold.Service.UserService.UserInfoService.UserInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api")
public class UserInfoController {

    private final UserInfoService service;

    public UserInfoController(UserInfoService service) {
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
    public ResponseEntity<SingleBooleanDto> checkGoogleAuth(HttpServletRequest request) {
        boolean isGoogleAuth = service.checkGoogleAuth(request);
        SingleBooleanDto response = new SingleBooleanDto(isGoogleAuth);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkOldPassword")
    public ResponseEntity<SingleBooleanDto> checkOldPassword(@RequestParam("password") String password, HttpServletRequest request) {
        boolean passwordMatches = service.checkOldPassword(password, request);
        SingleBooleanDto response = new SingleBooleanDto(passwordMatches);
        return ResponseEntity.ok(response);
    }
}
