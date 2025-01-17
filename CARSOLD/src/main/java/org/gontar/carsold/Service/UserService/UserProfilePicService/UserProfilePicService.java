package org.gontar.carsold.Service.UserService.UserProfilePicService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfilePicService {
    String getProfilePic(HttpServletRequest request);
    boolean uploadProfilePicWithSafeSearch(MultipartFile file, HttpServletRequest request);
    boolean deleteProfilePic(HttpServletRequest request);
}
