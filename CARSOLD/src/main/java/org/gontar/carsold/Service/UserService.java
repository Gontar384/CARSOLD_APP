package org.gontar.carsold.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.springframework.security.web.csrf.CsrfToken;

public interface UserService {
    boolean findUsername(String username);
    boolean findEmail(String email);
    void registerUser(UserDto userDto);
    void sendVerificationEmail(String email, String link);
    void activateAccount(String token, HttpServletResponse response);
    boolean checksAuthentication(HttpServletRequest request);
}
