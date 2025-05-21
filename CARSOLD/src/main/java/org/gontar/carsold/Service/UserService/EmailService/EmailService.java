package org.gontar.carsold.Service.UserService.EmailService;

public interface EmailService {
    void sendAccountActivationEmail(String email, String username, String link, boolean translate);
    void sendPasswordRecoveryEmail(String email, boolean translate);
}
