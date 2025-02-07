package org.gontar.carsold.Service.UserService.UserProfilePicService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfilePicService {
    String fetchProfilePic(HttpServletRequest request);
    void uploadProfilePic(MultipartFile file, HttpServletRequest request);
    void deleteProfilePic(HttpServletRequest request);
}
