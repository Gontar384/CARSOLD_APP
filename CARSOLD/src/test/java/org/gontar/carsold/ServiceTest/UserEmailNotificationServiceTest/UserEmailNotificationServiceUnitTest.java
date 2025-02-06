package org.gontar.carsold.ServiceTest.UserEmailNotificationServiceTest;

import jakarta.mail.internet.MimeMessage;
import org.gontar.carsold.Exceptions.ErrorHandler;
import org.gontar.carsold.Model.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserEmailNotificationService.UserEmailNotificationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserEmailNotificationServiceUnitTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtService jwtService;

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private ErrorHandler errorHandler;

    @InjectMocks
    private UserEmailNotificationServiceImpl emailService;

    @Test
    void testSendEmail() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String content = "Test Content";
        MimeMessage mockMessage = mock(MimeMessage.class);

        when(emailSender.createMimeMessage()).thenReturn(mockMessage);
        doNothing().when(emailSender).send(mockMessage);

        emailService.sendEmail(email, subject, content);

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mockMessage);
        verifyNoMoreInteractions(emailSender, errorHandler);
    }

    @Test
    void testSendEmail_failure() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String content = "Test Content";

        when(emailSender.createMimeMessage()).thenThrow(new RuntimeException("Error during sending"));

        emailService.sendEmail(email, subject, content);

        verify(errorHandler).logVoid(contains("Failed to send email: Error during sending"));
        verifyNoMoreInteractions(errorHandler);
    }

    @Test
    void testSendVerificationEmail_success() {
        String email = "test@example.com";
        String link = "frontendUrl.com/activate?token=testJwt";
        String username = "testUser";
        User mockUser = new User();
        mockUser.setUsername(username);
        MimeMessage mimeMessage = mock(MimeMessage.class);

        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        boolean result = emailService.sendVerificationEmail(email, username, link);

        assertTrue(result, "Should return true, message sent successfully");
        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
        verifyNoMoreInteractions(emailSender, errorHandler);
    }

    @Test
    void testSendVerificationEmail_failure() {
        String email = "test@example.com";
        String username = "testUser";
        String link = "frontendUrl.com/activate?token=testJwt";

        when(emailService.sendVerificationEmail(email, username, link)).thenThrow(new RuntimeException("Error during sending"));

        boolean result = emailService.sendVerificationEmail(email, username, link);

        assertFalse(result, "Should return false, message cannot be sent");
        verify(errorHandler).logBoolean(contains("Failed to send email: Error during sending"));
        verifyNoMoreInteractions(errorHandler);
    }

    @Test
    void testSendPasswordRecoveryEmail_success() {
        String email = "test@example.com";
        String token = "testToken";
        User mockUser = new User();
        mockUser.setUsername("TestUser");
        MimeMessage mimeMessage = mock(MimeMessage.class);

        when(repo.findByEmail(email)).thenReturn(mockUser);
        when(jwtService.generateToken(mockUser.getUsername(), 10L)).thenReturn(token);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(emailSender).send(mimeMessage);

        boolean result = emailService.sendPasswordRecoveryEmail(email);

        assertTrue(result, "Should return true, message sent successfully");
        verify(repo).findByEmail(email);
        verify(jwtService).generateToken(mockUser.getUsername(), 10L);
        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
        verifyNoMoreInteractions(emailSender);
    }

    @Test
    void testSendPasswordRecoveryEmail_failure_userNotFound() {
        String email = "test@example.com";
        when(repo.findByEmail(email)).thenReturn(null);

        boolean result = emailService.sendPasswordRecoveryEmail(email);

        assertFalse(result, "Should return false, message cannot be sent");
        verify(repo).findByEmail(email);
        verifyNoMoreInteractions(repo, emailSender, jwtService);
    }
}
