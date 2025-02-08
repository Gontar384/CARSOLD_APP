package org.gontar.carsold.Controller.UserController;

import org.gontar.carsold.Domain.Model.SingleStringDto;
import org.gontar.carsold.Service.UserService.ProfilePicService.ProfilePicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ProfilePicController {

    private final ProfilePicService service;

    public ProfilePicController(ProfilePicService service) {
        this.service = service;
    }

    @GetMapping("/fetchProfilePic")
    public ResponseEntity<SingleStringDto> fetchProfilePic() {
        String profilePic = service.fetchProfilePic();
        SingleStringDto response = new SingleStringDto(profilePic);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/uploadProfilePic")
    public ResponseEntity<?> uploadProfilePic(@RequestParam("file") MultipartFile file) {
        service.uploadProfilePic(file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteProfilePic")
    public ResponseEntity<String> deleteProfilePic() {
        service.deleteProfilePic();
        return ResponseEntity.ok().build();
    }
}
