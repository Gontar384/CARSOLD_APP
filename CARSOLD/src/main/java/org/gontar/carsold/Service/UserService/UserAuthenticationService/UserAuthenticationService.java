package org.gontar.carsold.Service.UserService.UserAuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface UserAuthenticationService {
    boolean checkAuth(HttpServletRequest request);
    void refreshJwt(HttpServletRequest request, HttpServletResponse response);
    void activateAccount(String token, HttpServletResponse response);
    void authenticate(String login, String password, HttpServletResponse response);
    void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
}
