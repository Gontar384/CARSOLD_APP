package org.gontar.carsold.Exception.CustomException;

public class MessageTooLargeException extends RuntimeException {
    public MessageTooLargeException(String message) {
        super(message);
    }
}
