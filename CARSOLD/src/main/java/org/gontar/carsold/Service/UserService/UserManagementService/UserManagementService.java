package org.gontar.carsold.Service.UserService.UserManagementService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;


public interface UserManagementService {
    void registerUser(UserDto userDto);
    String recoveryChangePassword(String token, String password, HttpServletResponse response);
    String changePassword(String password, HttpServletRequest request);
    String getUsername(HttpServletRequest request);
    boolean deleteUserAccount(HttpServletRequest request);
}
