package org.gontar.carsold.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {
    boolean findUsername(String username);
    boolean findEmail(String email);
    void registerUser(UserDto userDto);
    void sendVerificationEmail(String email, String link);
    String activateAccount(String token, HttpServletResponse response);
    boolean checkAuthentication(HttpServletRequest request);
    void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
    boolean checkActive(String login);
    boolean checkOauth2(String login);
    void authenticate(String login, String password, HttpServletResponse response);
    void refreshJwt(HttpServletRequest request, HttpServletResponse response);
    boolean validateUser(String login, String password);
    void sendPasswordRecoveryEmail(String email);
    String recoveryChangePassword(String token, String password, HttpServletResponse response);
    String getUsername(HttpServletRequest request);
    String getProfilePic(HttpServletRequest request);
    String uploadImageWithSafeSearch(MultipartFile file, HttpServletRequest request) throws IOException;
}
