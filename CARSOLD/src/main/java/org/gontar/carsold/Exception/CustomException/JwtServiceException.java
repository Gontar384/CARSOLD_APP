package org.gontar.carsold.Exception.CustomException;

import io.jsonwebtoken.JwtException;

public class JwtServiceException extends JwtException {
    public JwtServiceException(String message) {
        super(message);
    }
}
