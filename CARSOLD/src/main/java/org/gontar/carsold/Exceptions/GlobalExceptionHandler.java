package org.gontar.carsold.Exceptions;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.ServletException;
import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Exceptions.CustomExceptions.*;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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

    @ExceptionHandler(UserDataException.class)
    public ResponseEntity<?> handleUserDataException(UserDataException ex) {
        log.error("User Data Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Data Error");
    }

    @ExceptionHandler(LogoutFailedException.class)
    public ResponseEntity<?> handleLogoutFailedException(LogoutFailedException ex) {
        log.error("Logout Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout Error");
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
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
    }

    //---Others---

    @ExceptionHandler(RegisterUserException.class)
    public ResponseEntity<?> handleRegisterUserException(RegisterUserException ex) {
        log.error("Register User Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Register User Error");
    }

    @ExceptionHandler(InappropriateValueException.class)
    public ResponseEntity<?> handleInappropriateValueException(InappropriateValueException ex) {
        log.error("Inappropriate Value: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Inappropriate Value");
    }

    @ExceptionHandler(ValueExternalCheckException.class)
    public ResponseEntity<?> handleValueExternalCheckException(ValueExternalCheckException ex) {
        log.error("Value External Check Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Value External Check Error");
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<?> handleEmailSendingException(EmailSendingException ex) {
        log.error("Email Sending Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Sending Error");
    }

    @ExceptionHandler(DeleteException.class)
    public ResponseEntity<?> handleDeleteException(DeleteException ex) {
        log.error("Delete Error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Delete Error");
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

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleIOException(IOException ex) {
        log.error("IOException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
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

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<?> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex) {
        log.error("Media type not supported: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Unsupported media type");
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleDataAccessException(DataAccessException ex) {
        log.error("Database error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("A database error occurred");
    }

    @ExceptionHandler(ServletException.class)
    public ResponseEntity<?> handleServletException(ServletException ex) {
        log.error("ServletException: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation error");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
    }
}
