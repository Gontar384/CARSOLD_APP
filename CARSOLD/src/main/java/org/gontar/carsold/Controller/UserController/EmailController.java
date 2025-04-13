package org.gontar.carsold.Controller.UserController;

import org.gontar.carsold.Service.UserService.EmailService.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Validated
public class EmailController {

    private final EmailService service;

    public EmailController(EmailService service) {
        this.service = service;
    }

    @GetMapping("/sendPasswordRecoveryEmail")
    public ResponseEntity<?> sendPasswordRecoveryEmail(@RequestParam("email") String email) {
        service.sendPasswordRecoveryEmail(email);
        return ResponseEntity.ok().build();
    }
}
