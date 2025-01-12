package org.gontar.carsold.Service.UserService.UserManagementService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;


public interface UserManagementService {
    boolean registerUser(UserDto userDto);
    boolean recoveryChangePassword(String token, String password, HttpServletResponse response);
    boolean changePassword(String password, HttpServletRequest request);
    String fetchUsername(HttpServletRequest request);
    boolean deleteUserAccount(HttpServletRequest request);
}
