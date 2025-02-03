package org.gontar.carsold.Exceptions.CustomExceptions;

import org.springframework.security.authentication.AuthenticationServiceException;

public class UserNotFoundInRequestException extends AuthenticationServiceException {
    public UserNotFoundInRequestException(String message) {
        super(message);
    }
}
