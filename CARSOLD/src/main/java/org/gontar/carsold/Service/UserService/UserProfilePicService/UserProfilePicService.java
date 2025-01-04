package org.gontar.carsold.Service.UserService.UserProfilePicService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserProfilePicService {
    String getProfilePic(HttpServletRequest request);
    String uploadProfilePicWithSafeSearch(MultipartFile file, HttpServletRequest request) throws IOException;
    void deleteProfilePic(HttpServletRequest request);
}
