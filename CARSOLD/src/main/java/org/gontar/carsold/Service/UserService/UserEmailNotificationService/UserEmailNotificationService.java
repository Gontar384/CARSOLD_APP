package org.gontar.carsold.Service.UserService.UserEmailNotificationService;

public interface UserEmailNotificationService {
    void sendVerificationEmail(String email, String link);
    void sendPasswordRecoveryEmail(String email);
}
