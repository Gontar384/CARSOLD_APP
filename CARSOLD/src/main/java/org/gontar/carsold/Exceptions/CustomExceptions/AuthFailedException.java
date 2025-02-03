package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class AuthFailedException extends AuthenticationServiceException {
    public AuthFailedException(String message) {
        super(message);
    }
}
