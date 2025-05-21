package org.gontar.carsold.Controller.UserController;

import org.gontar.carsold.Domain.Model.User.RecoveryPasswordEmailDto;
import org.gontar.carsold.Service.UserService.EmailService.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EmailController {

    private final EmailService service;

    public EmailController(EmailService service) {
        this.service = service;
    }

    @PostMapping("/public/email/sendPasswordRecoveryEmail")
    public ResponseEntity<?> sendPasswordRecoveryEmail(@RequestBody RecoveryPasswordEmailDto emailDto) {
        service.sendPasswordRecoveryEmail(emailDto.getEmail(), emailDto.getTranslate());
        return ResponseEntity.ok().build();
    }
}
