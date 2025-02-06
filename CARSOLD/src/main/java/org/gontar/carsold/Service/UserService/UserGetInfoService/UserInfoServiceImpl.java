package org.gontar.carsold.Service.UserService.UserGetInfoService;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.Dto.UserInfoDto;
import org.gontar.carsold.Model.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserInfoServiceImpl implements UserInfoService {

    private final UserRepository repository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    public UserInfoServiceImpl(UserRepository repository,
                               JwtService jwtService, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.encoder = encoder;
    }

    @Override
    public boolean checkLogin(String login) {
        return login != null && (login.contains("@") ? repository.existsByEmail(login) : repository.existsByUsername(login));
    }

    @Override
    public UserInfoDto checkInfo(String login) {
        UserInfoDto userInfoDto = new UserInfoDto();
        if (login == null) {
            userInfoDto.setActive(false);
            userInfoDto.setOauth2(false);
            return userInfoDto;
        }
        User user = login.contains("@") ? repository.findByEmail(login) : repository.findByUsername(login);
        userInfoDto.setActive(user != null ? user.getActive() : false);
        userInfoDto.setOauth2(user != null ? user.getOauth2() : false);

        return userInfoDto;
    }

    @Override
    public boolean checkGoogleAuth(HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        return user != null && user.getOauth2();
    }

    @Override
    public boolean checkOldPassword(String password, HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        return user != null && encoder.matches(password, user.getPassword());
    }
}
