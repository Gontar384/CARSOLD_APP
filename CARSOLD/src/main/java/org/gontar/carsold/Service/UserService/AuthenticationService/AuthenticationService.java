package org.gontar.carsold.Service.UserService.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface AuthenticationService {
    boolean checkAuth();
    void fetchJwt(HttpServletResponse response);
    void activateAccount(String token, HttpServletRequest request, HttpServletResponse response);
    void authenticate(String login, String password, HttpServletResponse response);
    void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
}
