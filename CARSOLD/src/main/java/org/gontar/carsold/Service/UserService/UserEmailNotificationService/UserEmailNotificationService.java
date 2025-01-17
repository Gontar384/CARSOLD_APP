package org.gontar.carsold.Service.UserService.UserEmailNotificationService;

public interface UserEmailNotificationService {
    void sendEmail(String email, String subject, String content);
    boolean sendPasswordRecoveryEmail(String email);
    boolean sendVerificationEmail(String email, String username, String link);
}
