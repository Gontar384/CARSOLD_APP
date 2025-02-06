package org.gontar.carsold.Service.UserService.UserGetInfoService;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.Dto.UserInfoDto;

public interface UserInfoService {
    boolean checkLogin(String login);
    UserInfoDto checkInfo(String login);
    boolean checkGoogleAuth(HttpServletRequest request);
    boolean checkOldPassword(String password, HttpServletRequest request);
}
