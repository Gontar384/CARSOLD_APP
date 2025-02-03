package org.gontar.carsold.Exceptions;

import org.springframework.stereotype.Component;

@Component
public class ErrorHandler {

    public boolean logBoolean(String message) {
        System.err.println(message);
        return false;
    }

    public String logString(String message) {
        System.err.println(message);
        return null;
    }

    public <T> T logObject(String message) {
        System.err.println(message);
        return null;
    }

    public void logVoid(String message) {
        System.err.println(message);
    }
}
