package org.gontar.carsold.Service.UserService.UserManagementService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;


public interface UserManagementService {
    void registerUser(UserDto userDto);
    String fetchUsername(HttpServletRequest request);
    void changePassword(String password, HttpServletRequest request);
    void changePasswordRecovery(String token, String password, HttpServletResponse response);
    void deleteUser(HttpServletRequest request);
}
