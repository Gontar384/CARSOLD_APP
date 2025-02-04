package org.gontar.carsold.Exceptions.CustomExceptions;

import io.jsonwebtoken.JwtException;

public class JwtServiceException extends JwtException {
    public JwtServiceException(String message) {
        super(message);
    }
}
