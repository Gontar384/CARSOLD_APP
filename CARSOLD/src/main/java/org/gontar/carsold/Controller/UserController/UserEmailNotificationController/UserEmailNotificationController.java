package org.gontar.carsold.Controller.UserController.UserEmailNotificationController;

import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserEmailNotificationController {

    private final UserEmailNotificationService service;

    public UserEmailNotificationController(UserEmailNotificationService service) {
        this.service = service;
    }

    //sends password recovery email
    @GetMapping("/auth/password-recovery")
    public ResponseEntity<String> getPasswordRecoveryEmail(@RequestParam("email") String email) {
        service.sendPasswordRecoveryEmail(email);
        return ResponseEntity.ok("Email sent");
    }
}
