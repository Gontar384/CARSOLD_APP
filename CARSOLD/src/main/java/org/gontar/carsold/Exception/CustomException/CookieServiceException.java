package org.gontar.carsold.Exception.CustomException;

import org.springframework.security.authentication.AuthenticationServiceException;

public class CookieServiceException extends AuthenticationServiceException {
    public CookieServiceException(String message) {
        super(message);
    }
}
