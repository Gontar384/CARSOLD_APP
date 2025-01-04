package org.gontar.carsold.Service.UserService.UserGetInfoService;

import jakarta.servlet.http.HttpServletRequest;

public interface UserGetInfoService {
    boolean findEmail(String email);
    boolean findUsername(String username);
    boolean checkIfUsernameSafe(String username);
    boolean checkActive(String login);
    boolean checkOauth2(String login);
    boolean checkGoogleAuth(HttpServletRequest request);
    boolean checkPassword(String password, HttpServletRequest request);
    boolean validateUser(String login, String password);
}
