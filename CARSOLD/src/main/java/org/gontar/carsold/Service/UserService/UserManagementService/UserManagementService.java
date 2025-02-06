package org.gontar.carsold.Service.UserService.UserManagementService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.User.User;


public interface UserManagementService {
    User registerUser(User user);
    String fetchUsername(HttpServletRequest request);
    void changePassword(String oldPassword, String newPassword, HttpServletRequest request);
    void changePasswordRecovery(String token, String password, HttpServletResponse response);
    void deleteUser(String password, HttpServletRequest request);
}
