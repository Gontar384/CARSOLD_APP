package org.gontar.carsold.Service.UserService.UserAuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface UserAuthenticationService {
    boolean activateAccount(String token, HttpServletResponse response);
    boolean authenticate(String login, String password, HttpServletResponse response);
    boolean checkAuthentication(HttpServletRequest request);
    boolean logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
    void refreshJwt(HttpServletRequest request, HttpServletResponse response);
}
