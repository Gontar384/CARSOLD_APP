package org.gontar.carsold.Service.UserService.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.gontar.carsold.Exception.CustomException.EmailSendingException;
import org.gontar.carsold.Exception.CustomException.UserDataException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final UserRepository repository;
    private final JwtService jwtService;
    private final JavaMailSender emailSender;

    public EmailServiceImpl(UserRepository repository, JwtService jwtService, JavaMailSender emailSender) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.emailSender = emailSender;
    }

    private void sendEmail(String email, String subject, String content) throws MessagingException {
        Objects.requireNonNull(email, "Email cannot be null");

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(message);
    }

    @Override
    public void sendAccountActivationEmail(String email, String username, String link, boolean translate) {
        String subject;
        String content;
        try {
            if (!translate) {
                subject = "CAR$OLD Aktywacja Konta";
                content = "<p style='font-size: 25px;'>Witaj " + username +
                        "! Aby aktywować konto, kliknij poniższy link:</p>" +
                        "<div style='background-color: #caf04f; width: 345px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                        "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' target=\"_blank\" href=\"" + link + "\">" +
                        "Aktywuj konto" +
                        "</a>" +
                        "</div>" +
                        "<br><p>Jeśli link wygasł, należy zarejestrować się ponownie.</p>" +
                        "<p>W przypadku problemów z aktywacją, otwórz link w przeglądarce (Chrome, Firefox, Safari) – nie wewnątrz aplikacji pocztowej.</p><br><hr>" +
                        "<p>Wiadomość wysłana automatycznie. Prosimy nie odpowiadać.</p>";
            } else {
                subject = "CAR$OLD Account Activation";
                content = "<p style='font-size: 25px;'>Welcome " + username +
                        "! To activate account, click the following link:</p>" +
                        "<div style='background-color: #caf04f; width: 410px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                        "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' target=\"_blank\" href=\"" + link + "\">" +
                        "Activate Account" +
                        "</a>" +
                        "</div>" +
                        "<br><p>If link has expired, register again.</p>" +
                        "<p>If you experience any issues with activation, open the link in a browser (Chrome, Firefox, Safari) — not inside a mail application.</p><br><hr>" +
                        "<p>This message was sent automatically. Please do not reply.</p>";
            }

            sendEmail(email, subject, content);
        } catch (MessagingException e) {
            throw new EmailSendingException("Account activation email sending failed: " + e.getMessage());
        }
    }

    @Override
    public void sendPasswordRecoveryEmail(String email, boolean translate) {
        Objects.requireNonNull(email, "Email cannot be null");

        User user = repository.findByEmail(email);
        if (user == null) throw new UserNotFoundException("User not found with email: " + email);

        if (!user.getActive()) throw new UserDataException("Account \"" + user.getUsername() + "\" is not active");
        if (user.getOauth2()) throw new UserDataException("Account \"" + user.getUsername() + "\" is OAuth2 account");

        String token = jwtService.generateToken(user.getUsername(), 10);
        String link = frontendUrl + "/very3secret8password4change?token=" + token;

        String subject;
        String content;
        try {
            if (!translate) {
                subject = "CAR$OLD Odzyskiwanie Hasła";
                content = "<p style='font-size: 25px;'>Witaj " + user.getUsername() + ", miło Cię znowu widzieć! " +
                        "Aby zmienić hasło, kliknij poniższy link:</p>" +
                        "<div style='background-color: #d3d61c; width: 295px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                        "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' target=\"_blank\" href=\"" + link + "\">" +
                        "Zmień hasło" +
                        "</a>" +
                        "</div><br>" +
                        "<p>W przypadku problemów ze zmianą hasła, otwórz link w przeglądarce (Chrome, Firefox, Safari) – nie wewnątrz aplikacji pocztowej.</p><br><hr>" +
                        "<p>Wiadomość wysłana automatycznie. Prosimy nie odpowiadać.</p>";
            } else {
                subject = "CAR$OLD Password Recovery";
                content = "<p style='font-size: 25px;'>Hello " + user.getUsername() + ", good to see you again! " +
                        "To change password, click the following link:</p>" +
                        "<div style='background-color: #d3d61c; width: 435px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                        "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' target=\"_blank\" href=\"" + link + "\">" +
                        "Change password" +
                        "</a>" +
                        "</div><br>" +
                        "<p>If you experience any issues changing your password, open the link in a browser (Chrome, Firefox, Safari) — not inside a mail application.</p><br><hr>" +
                        "<p>This message was sent automatically. Please do not reply.</p>";
            }
            sendEmail(email, subject, content);
        } catch (MessagingException e) {
            throw new EmailSendingException("Password recovery email sending failed: " + e.getMessage());
        }
    }
}
