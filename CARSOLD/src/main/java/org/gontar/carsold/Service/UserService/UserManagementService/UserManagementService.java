package org.gontar.carsold.Service.UserService.UserManagementService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Entity.User.User;
import org.springframework.security.core.Authentication;

public interface UserManagementService {
    User registerUser(User user, boolean translate);
    String fetchUsername();
    String fetchEmail();
    void changePassword(String oldPassword, String newPassword);
    void changePasswordRecovery(String token, String password, HttpServletRequest request, HttpServletResponse response);
    void deleteUser(String password, HttpServletRequest request, HttpServletResponse response, Authentication authentication);
}
