package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class CookieServiceException extends AuthenticationServiceException {
    public CookieServiceException(String message) {
        super(message);
    }
}
