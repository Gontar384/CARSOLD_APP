package org.gontar.carsold.Controller.UserController.UserProfilePicController;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Service.UserService.UserProfilePicService.UserProfilePicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserProfilePicController {

    private final UserProfilePicService service;

    public UserProfilePicController(UserProfilePicService service) {
        this.service = service;
    }

    //fetches profile pic
    @GetMapping("/get-profilePic")
    public ResponseEntity<Map<String, String>> getProfilePic(HttpServletRequest request) {
        HashMap<String, String> profilePicResponse = new HashMap<>();
        String profilePic = service.getProfilePic(request);
        profilePicResponse.put("profilePic", profilePic);
        return ResponseEntity.ok(profilePicResponse);
    }

    //uploads images to cloud and checks for sensitive content
    @PutMapping("/storage-upload-profilePic")
    public ResponseEntity<Map<String, Boolean>> updateImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean result = service.uploadProfilePicWithSafeSearch(file, request);
        response.put("info", result);
        return ResponseEntity.ok(response);
    }

    //deletes profilePic
    @DeleteMapping("/storage-delete-profilePic")
    public ResponseEntity<String> deleteImage(HttpServletRequest request) {
        boolean result = service.deleteProfilePic(request);
        return ResponseEntity.ok(result ? "Image deleted" : "Error deleting image");
    }
}
