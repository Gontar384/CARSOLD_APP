package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class LogoutFailedException extends AuthenticationServiceException {
    public LogoutFailedException(String message) {
        super(message);
    }
}
