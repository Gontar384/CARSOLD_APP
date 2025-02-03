package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class JwtGenerationException extends AuthenticationServiceException {
    public JwtGenerationException(String message) {
        super(message);
    }
}
