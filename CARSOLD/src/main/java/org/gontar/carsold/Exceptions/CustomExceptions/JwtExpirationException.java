package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class JwtExpirationException extends AuthenticationServiceException {
    public JwtExpirationException(String message) {
        super(message);
    }
}
