package org.gontar.carsold.Service.UserService.UserEmailNotificationService;

import jakarta.mail.MessagingException;

public interface UserEmailNotificationService {
    void sendEmail(String email, String subject, String content) throws MessagingException;
    void sendAccountActivationEmail(String email, String username, String link);
    boolean sendPasswordRecoveryEmail(String email);
}
