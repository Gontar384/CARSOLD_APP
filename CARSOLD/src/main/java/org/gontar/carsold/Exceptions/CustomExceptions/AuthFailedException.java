package org.gontar.carsold.Exceptions.CustomExceptions;

public class AuthFailedException extends RuntimeException  {
    public AuthFailedException(String message) {
        super(message);
    }
}
