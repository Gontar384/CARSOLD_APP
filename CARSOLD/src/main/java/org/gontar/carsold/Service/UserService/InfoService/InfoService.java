package org.gontar.carsold.Service.UserService.InfoService;

import org.gontar.carsold.Domain.Model.User.UserInfoDto;

public interface InfoService {
    boolean checkLogin(String login);
    UserInfoDto checkInfo(String login);
    boolean checkGoogleAuth();
    boolean checkOldPassword(String password);
    boolean checkAdmin();
}
