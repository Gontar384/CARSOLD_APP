package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class CookieCreationException extends AuthenticationServiceException {
    public CookieCreationException(String message) {
        super(message);
    }
}
