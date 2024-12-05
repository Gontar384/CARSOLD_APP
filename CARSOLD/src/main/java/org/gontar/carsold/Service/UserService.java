package org.gontar.carsold.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;

public interface UserService {
    boolean findUsername(String username);
    boolean findEmail(String email);
    void registerUser(UserDto userDto);
    void sendVerificationEmail(String email, String link);
    String activateAccount(String token, HttpServletResponse response);
    boolean checkAuthentication(HttpServletRequest request);
    void logout(HttpServletResponse response);
    boolean checkActive(String login);
    boolean checkOauth2(String login);
    void authenticate(String login, String password, HttpServletResponse response);
    void refreshJwt(HttpServletRequest request, HttpServletResponse response);
    boolean validateUser(String login, String password);
    void sendPasswordRecoveryEmail(String email);
    void recoveryChangePassword(String token, String password, HttpServletResponse response);
    String getUsername(HttpServletRequest request);
}
