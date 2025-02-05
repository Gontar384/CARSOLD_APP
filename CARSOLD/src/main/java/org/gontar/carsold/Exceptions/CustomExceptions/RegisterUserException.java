package org.gontar.carsold.Exceptions.CustomExceptions;

public class RegisterUserException extends RuntimeException {
    public RegisterUserException(String message) {
        super(message);
    }
}
