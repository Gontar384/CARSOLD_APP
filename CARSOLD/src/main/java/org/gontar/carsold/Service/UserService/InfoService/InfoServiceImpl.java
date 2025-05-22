package org.gontar.carsold.Service.UserService.InfoService;

import org.gontar.carsold.Domain.Model.User.UserInfoDto;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class InfoServiceImpl implements InfoService {

    private final UserRepository repository;
    private final MyUserDetailsService userDetailsService;
    private final BCryptPasswordEncoder encoder;

    public InfoServiceImpl(UserRepository repository, MyUserDetailsService userDetailsService, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.userDetailsService = userDetailsService;
        this.encoder = encoder;
    }

    @Override
    public boolean checkLogin(String login) {
        if (login == null) return false;
        String normalizedLogin = login.toLowerCase();
        return login.contains("@") ? repository.existsByEmailLower(normalizedLogin) : repository.existsByUsernameLower(normalizedLogin);
    }

    @Override
    public UserInfoDto checkAccount(String login) {
        UserInfoDto userInfoDto = new UserInfoDto();
        if (login == null) {
            userInfoDto.setActive(false);
            userInfoDto.setOauth2(false);
            return userInfoDto;
        }
        String normalizedLogin = login.toLowerCase();
        User user = login.contains("@") ? repository.findByEmailLower(normalizedLogin) : repository.findByUsernameLower(normalizedLogin);
        userInfoDto.setActive(user != null ? user.getActive() : false);
        userInfoDto.setOauth2(user != null ? user.getOauth2() : false);

        return userInfoDto;
    }

    @Override
    public boolean checkGoogleAuth() {
        User user = userDetailsService.loadUser();
        return user != null && user.getOauth2();
    }

    @Override
    public boolean checkOldPassword(String password) {
        User user = userDetailsService.loadUser();
        return user != null && encoder.matches(password, user.getPassword());
    }

    @Override
    public boolean checkAdmin() {
        User user = userDetailsService.loadUser();
        return user != null && user.getRole().name().equals("ADMIN");
    }
}
