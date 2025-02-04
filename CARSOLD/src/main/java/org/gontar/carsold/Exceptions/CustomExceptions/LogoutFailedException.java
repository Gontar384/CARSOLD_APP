package org.gontar.carsold.Exceptions.CustomExceptions;

public class LogoutFailedException extends RuntimeException  {
    public LogoutFailedException(String message) {
        super(message);
    }
}
