package org.gontar.carsold.Service.UserService.UserEmailNotificationService;

import jakarta.mail.internet.MimeMessage;
import org.gontar.carsold.ErrorHandler.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class UserEmailNotificationServiceImpl implements UserEmailNotificationService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final UserRepository repository;
    private final JwtService jwtService;
    private final JavaMailSender emailSender;
    private final ErrorHandler errorHandler;

    public UserEmailNotificationServiceImpl(UserRepository repository, JwtService jwtService, JavaMailSender emailSender, ErrorHandler errorHandler) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.emailSender = emailSender;
        this.errorHandler = errorHandler;
    }

    //sends email message
    @Override
    public void sendEmail(String email, String subject, String content) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);

            emailSender.send(message);
        } catch (Exception e) {
            errorHandler.logVoid("Failed to send email: " + e.getMessage());
        }
    }

    //sends email to activate account
    @Override
    public boolean sendVerificationEmail(String email, String username, String link) {
        try {
            String subject = "CAR$OLD Account Activation";
            String content = "<p style='font-size: 25px;'>Thank you for registering " + username +
                    "! To activate your account, please click here:</p>" +
                    "<div style='background-color: #caf04f; width: 407px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                    "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' href=\"" + link + "\">" +
                    "Activate Account" +
                    "</a>" +
                    "</div>" +
                    "<p>If link expired - register again.<br><br><hr>" +
                    "<p>This message was sent automatically. Do not reply.</p>";
            sendEmail(email, subject, content);
            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Failed to send email: " + e.getMessage());
        }
    }

    //sends email message with link to change password
    @Override
    public boolean sendPasswordRecoveryEmail(String email) {
        try {
            User user = repository.findByEmail(email);
            if (user == null) return errorHandler.logBoolean("User not found");
            String token = jwtService.generateToken(user.getUsername(), 10);
            String link = frontendUrl + "very3secret8password4change?token=" + token;
            String subject = "CAR$OLD Password Recovery";
            String content = "<p style='font-size: 25px;'>Hello " + user.getUsername() +
                    "! To change your password, please click the following link:</p>" +
                    "<div style='background-color: #d3d61c; width: 435px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                    "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' href=\"" + link + "\">" +
                    "Change password" +
                    "</a>" +
                    "</div><hr>" +
                    "<p>This message was sent automatically. Do not reply.</p>";
            sendEmail(email, subject, content);
            return true;
        }
        catch (Exception e) {
            return errorHandler.logBoolean("Failed to send email: " + e.getMessage());
        }
    }
}
