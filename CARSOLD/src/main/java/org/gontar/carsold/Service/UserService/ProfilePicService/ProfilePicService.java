package org.gontar.carsold.Service.UserService.ProfilePicService;

import org.springframework.web.multipart.MultipartFile;

public interface ProfilePicService {
    String fetchProfilePic();
    void uploadProfilePic(MultipartFile file);
    void deleteProfilePic();
}
