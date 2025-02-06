package org.gontar.carsold.Service.UserService.UserEmailNotificationService;

public interface UserEmailNotificationService {
    void sendAccountActivationEmail(String email, String username, String link);
    void sendPasswordRecoveryEmail(String email);
}
