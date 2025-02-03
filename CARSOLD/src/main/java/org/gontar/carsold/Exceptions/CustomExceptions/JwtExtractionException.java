package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class JwtExtractionException extends AuthenticationServiceException {
    public JwtExtractionException(String message) {
        super(message);
    }
}
