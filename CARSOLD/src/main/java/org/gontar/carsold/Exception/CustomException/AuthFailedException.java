package org.gontar.carsold.Exception.CustomException;

public class AuthFailedException extends RuntimeException  {
    public AuthFailedException(String message) {
        super(message);
    }
}
