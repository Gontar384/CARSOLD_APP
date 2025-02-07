package org.gontar.carsold.Exceptions.CustomExceptions;

public class ExternalDeleteException extends RuntimeException {
    public ExternalDeleteException(String message) {
        super(message);
    }
}
