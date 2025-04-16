package org.gontar.carsold.Exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.ServletException;
import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Exception.CustomException.*;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    //---Authentication---

    @ExceptionHandler
    public ResponseEntity<?> handleJwtServiceException(JwtServiceException ex) {
        log.error("JWT Service Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT Service Error");
    }

    @ExceptionHandler(CookieServiceException.class)
    public ResponseEntity<?> handleCookieServiceException(CookieServiceException ex) {
        log.error("Cookie Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cookie Error");
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        log.error("Username Not Found: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username Not Found");
    }

    @ExceptionHandler(UserDetailsException.class)
    public ResponseEntity<?> handleUserDetailsException(UserDetailsException ex) {
        log.error("User Details Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Details Error");
    }

    @ExceptionHandler
    public ResponseEntity<?> handleAccountActivationException(AccountActivationException ex) {
        log.error("Account Activation Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account Activation Error");
    }

    @ExceptionHandler(AuthFailedException.class)
    public ResponseEntity<?> handleAuthFailedException(AuthFailedException ex) {
        log.error("Authentication Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication Error");
    }

    @ExceptionHandler(LogoutFailedException.class)
    public ResponseEntity<?> handleLogoutFailedException(LogoutFailedException ex) {
        log.error("Logout Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout Error");
    }

    @ExceptionHandler(UserDataException.class)
    public ResponseEntity<?> handleUserDataException(UserDataException ex) {
        log.error("User Data Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Data Error");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        log.error("Authentication General Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication General error");
    }

    @ExceptionHandler(OAuth2AuthenticationException.class)
    public ResponseEntity<?> handleOAuth2AuthenticationException(OAuth2AuthenticationException ex) {
        log.error("OAuth2 Authentication Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OAuth2 Authentication Error");
    }

    @ExceptionHandler
    public ResponseEntity<?> handleJwtException(JwtException ex) {
        log.error("JWT General Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT General Error");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        log.error("Access Denied: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("Access Denied");
    }

    @ExceptionHandler(InappropriateActionException.class)
    public ResponseEntity<?> handleInappropriateActionException(InappropriateActionException ex) {
        log.error("Inappropriate Action: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("Inappropriate Action");
    }

    @ExceptionHandler(WrongActionException.class)
    public ResponseEntity<?> handleWrongActionException(WrongActionException ex) {
        log.error("Wrong Action: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wrong Action Exception");
    }

    @ExceptionHandler(NoPermissionException.class)
    public ResponseEntity<?> handleNoPermissionException(NoPermissionException ex) {
        log.error("No Permission: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No Permission");
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<?> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        log.error("Authorization Denied: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("Authorization Denied");
    }

    //---Others---

    @ExceptionHandler(RegisterUserException.class)
    public ResponseEntity<?> handleRegisterUserException(RegisterUserException ex) {
        log.error("Register User Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Register User Error");
    }

    @ExceptionHandler(InvalidValueException.class)
    public ResponseEntity<?> handleInvalidValueException(InvalidValueException ex) {
        log.error("Invalid Value: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Invalid Value");
    }

    @ExceptionHandler(InappropriateContentException.class)
    public ResponseEntity<?> handleInappropriateContentException(InappropriateContentException ex) {
        log.error("Inappropriate Content: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Inappropriate Content");
    }

    @ExceptionHandler(ExternalCheckException.class)
    public ResponseEntity<?> handleExternalCheckException(ExternalCheckException ex) {
        log.error("External Check Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("External Check Error");
    }

    @ExceptionHandler(ExternalDeleteException.class)
    public ResponseEntity<?> handleExternalDeleteException(ExternalDeleteException ex) {
        log.error("External Delete Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("External Delete Error");
    }

    @ExceptionHandler(ImageUploadException.class)
    public ResponseEntity<?> handleImageUploadException(ImageUploadException ex) {
        log.error("Image Upload Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image Upload Error");
    }

    @ExceptionHandler(MediaNotSupportedException.class)
    public ResponseEntity<?> handleMediaNotSupportedException(MediaNotSupportedException ex) {
        log.error("Media Not Supported: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Media Not Supported");
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<?> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex) {
        log.error("Unsupported Media Type: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Unsupported media type");
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<?> handleEmailSendingException(EmailSendingException ex) {
        log.error("Email Sending Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Sending Error");
    }

    @ExceptionHandler(PasswordRecoveryChangeException.class)
    public ResponseEntity<?> handlePasswordRecoveryChangeException(PasswordRecoveryChangeException ex) {
        log.error("Password Recovery Change Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password Recovery Change Error");
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<?> handleInvalidPasswordException(InvalidPasswordException ex) {
        log.error("Invalid Password: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid Password");
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFoundException(UserNotFoundException ex) {
        log.error("User Not Found: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
    }

    @ExceptionHandler(MessageTooLargeException.class)
    public ResponseEntity<?> handleMessageTooLongException(MessageTooLargeException ex) {
        log.error("Message Too Long: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Message Too Long");
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleIOException(IOException ex) {
        log.error("IOException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
    }

    @ExceptionHandler(OfferNotFound.class)
    public ResponseEntity<?> handleOfferNotFound(OfferNotFound ex) {
        log.error("Offer Not Found: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Offer Not Found");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("IllegalArgumentException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request parameters");
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalStateException(IllegalStateException ex) {
        log.error("IllegalStateException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> handleNullPointerException(NullPointerException ex) {
        log.error("NullPointerException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<?> handleJsonProcessingException(JsonProcessingException ex) {
        log.error("Json Processing Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Json Processing Error");
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleDataAccessException(DataAccessException ex) {
        log.error("Database Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database Error");
    }

    @ExceptionHandler(ServletException.class)
    public ResponseEntity<?> handleServletException(ServletException ex) {
        log.error("ServletException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        log.error("Validation Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation Error");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        log.error("Unexpected Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error");
    }
}
