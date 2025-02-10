package org.gontar.carsold.ServiceTest.UserServiceTest.EmailServiceTest;

import jakarta.mail.internet.MimeMessage;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Exception.CustomException.UserDataException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.EmailService.EmailServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceUnitTest {

    @InjectMocks
    private EmailServiceImpl emailService;

    @Mock
    private UserRepository repository;

    @Mock
    private JwtService jwtService;

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private MimeMessage mimeMessage;

    @Mock
    private MimeMessageHelper mimeMessageHelper;

    @Captor
    private ArgumentCaptor<MimeMessage> mimeMessageCaptor;

    @Test
    public void sendAccountActivationEmail_success() {
        String email = "test@example.com";
        String username = "testUser";
        String link = "http://activationlink";
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendAccountActivationEmail(email, username, link);

        verify(emailSender).send(mimeMessageCaptor.capture());
    }

    @Test
    public void sendPasswordRecoveryEmail_success() {
        String email = "test@example.com";
        User user = new User();
        user.setUsername("testUser");
        user.setActive(true);
        user.setOauth2(false);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        when(repository.findByEmail(email)).thenReturn(user);
        when(jwtService.generateToken(anyString(), anyInt())).thenReturn("test_token");

        emailService.sendPasswordRecoveryEmail(email);

        verify(emailSender).send(mimeMessageCaptor.capture());
    }

    @Test
    public void sendPasswordRecoveryEmail_failure_userNotFound() {
        String email = "test@example.com";
        when(repository.findByEmail(email)).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> emailService.sendPasswordRecoveryEmail(email));
    }

    @Test
    public void sendPasswordRecoveryEmail_failure_userNotActive() {
        String email = "test@example.com";
        User user = new User();
        user.setUsername("testUser");
        user.setActive(false);
        when(repository.findByEmail(email)).thenReturn(user);

        assertThrows(UserDataException.class, () -> emailService.sendPasswordRecoveryEmail(email));
    }

    @Test
    public void sendPasswordRecoveryEmail_failure_userIsOAuth2() {
        String email = "test@example.com";
        User user = new User();
        user.setUsername("testUser");
        user.setActive(true);
        user.setOauth2(true);
        when(repository.findByEmail(email)).thenReturn(user);

        assertThrows(UserDataException.class, () -> emailService.sendPasswordRecoveryEmail(email));
    }

    @Test
    public void sendEmail_failure_nullEmail(){
        assertThrows(NullPointerException.class, () -> emailService.sendAccountActivationEmail(null,"testUser","testLink"));
        assertThrows(NullPointerException.class, () -> emailService.sendPasswordRecoveryEmail(null));
    }
}
