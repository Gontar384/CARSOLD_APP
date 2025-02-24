package org.gontar.carsold.Service.UserService.UserManagementService;

import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Domain.Entity.User.User;

public interface UserManagementService {
    User registerUser(User user);
    String fetchUsername();
    void changePassword(String oldPassword, String newPassword);
    void changePasswordRecovery(String token, String password, HttpServletResponse response);
    void deleteUser(String password);
}
