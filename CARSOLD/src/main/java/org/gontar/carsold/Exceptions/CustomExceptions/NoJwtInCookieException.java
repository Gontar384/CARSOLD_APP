package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class NoJwtInCookieException extends AuthenticationServiceException {
    public NoJwtInCookieException(String message) {
        super(message);
    }
}
