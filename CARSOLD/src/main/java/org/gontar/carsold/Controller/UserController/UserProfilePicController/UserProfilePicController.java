package org.gontar.carsold.Controller.UserController.UserProfilePicController;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.Dto.SingleStringDto;
import org.gontar.carsold.Service.UserService.UserProfilePicService.UserProfilePicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class UserProfilePicController {

    private final UserProfilePicService service;

    public UserProfilePicController(UserProfilePicService service) {
        this.service = service;
    }

    @GetMapping("/fetchProfilePic")
    public ResponseEntity<SingleStringDto> fetchProfilePic(HttpServletRequest request) {
        String profilePic = service.fetchProfilePic(request);
        SingleStringDto response = new SingleStringDto(profilePic);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/uploadProfilePic")
    public ResponseEntity<?> uploadProfilePic(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        service.uploadProfilePic(file, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteProfilePic")
    public ResponseEntity<String> deleteProfilePic(HttpServletRequest request) {
        service.deleteProfilePic(request);
        return ResponseEntity.ok().build();
    }
}
