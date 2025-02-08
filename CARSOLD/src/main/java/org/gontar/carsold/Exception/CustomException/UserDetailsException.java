package org.gontar.carsold.Exception.CustomException;

import org.springframework.security.authentication.AuthenticationServiceException;

public class UserDetailsException extends AuthenticationServiceException {
    public UserDetailsException(String message) {
        super(message);
    }
}
