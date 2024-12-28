package org.gontar.carsold.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface UserService {
    boolean findEmail(String email);
    boolean findUsername(String username);
    boolean checkIfUsernameSafe(String username);
    void registerUser(UserDto userDto);
    void sendVerificationEmail(String email, String link);
    String activateAccount(String token, HttpServletResponse response);
    boolean checkAuthentication(HttpServletRequest request);
    void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication);
    boolean checkActive(String login);
    boolean checkOauth2(String login);
    boolean checkGoogleAuth(HttpServletRequest request);
    boolean validateUser(String login, String password);
    void authenticate(String login, String password, HttpServletResponse response);
    void refreshJwt(HttpServletRequest request, HttpServletResponse response);
    void sendPasswordRecoveryEmail(String email);
    String recoveryChangePassword(String token, String password, HttpServletResponse response);
    String changePassword(String password, HttpServletRequest request);
    boolean checkPassword(String password, HttpServletRequest request);
    String getUsername(HttpServletRequest request);
    String getProfilePic(HttpServletRequest request);
    String uploadProfilePicWithSafeSearch(MultipartFile file, HttpServletRequest request) throws IOException;
    void deleteProfilePic(HttpServletRequest request);
    String changeName(String name, HttpServletRequest request);
    String changePhone(String phone, HttpServletRequest request);
    String changeCity(String address, HttpServletRequest request);
    Map<String, String>fetchInfo(HttpServletRequest request);
    boolean deleteUserAccount(HttpServletRequest request);
}
