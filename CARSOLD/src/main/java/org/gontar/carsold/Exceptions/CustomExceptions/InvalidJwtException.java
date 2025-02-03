package org.gontar.carsold.Exceptions.CustomExceptions;


import org.springframework.security.authentication.AuthenticationServiceException;

public class InvalidJwtException extends AuthenticationServiceException {
    public InvalidJwtException(String message) {
        super(message);
    }
}
