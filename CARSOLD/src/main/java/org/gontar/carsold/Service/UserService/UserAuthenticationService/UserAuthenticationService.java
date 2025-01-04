package org.gontar.carsold.Service.UserService.UserAuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface UserAuthenticationService {
    String activateAccount(String token, HttpServletResponse response);
    boolean checkAuthentication(HttpServletRequest request);
    void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
    void authenticate(String login, String password, HttpServletResponse response);
    void refreshJwt(HttpServletRequest request, HttpServletResponse response);
}
