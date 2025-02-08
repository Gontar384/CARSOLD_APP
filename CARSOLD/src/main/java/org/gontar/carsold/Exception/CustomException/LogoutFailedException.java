package org.gontar.carsold.Exception.CustomException;

public class LogoutFailedException extends RuntimeException  {
    public LogoutFailedException(String message) {
        super(message);
    }
}
