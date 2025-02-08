package org.gontar.carsold.Service.UserService.EmailService;

public interface EmailService {
    void sendAccountActivationEmail(String email, String username, String link);
    void sendPasswordRecoveryEmail(String email);
}
