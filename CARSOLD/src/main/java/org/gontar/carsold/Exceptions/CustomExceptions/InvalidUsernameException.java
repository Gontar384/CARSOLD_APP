package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class InvalidUsernameException extends AuthenticationServiceException {
    public InvalidUsernameException(String message) {
        super(message);
    }
}
