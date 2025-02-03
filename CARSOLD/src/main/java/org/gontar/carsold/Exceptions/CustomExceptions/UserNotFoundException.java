package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class UserNotFoundException extends AuthenticationServiceException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
