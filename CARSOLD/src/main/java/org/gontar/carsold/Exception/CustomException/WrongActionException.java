package org.gontar.carsold.Exception.CustomException;

public class WrongActionException extends RuntimeException {
  public WrongActionException(String message) {
    super(message);
  }
}
