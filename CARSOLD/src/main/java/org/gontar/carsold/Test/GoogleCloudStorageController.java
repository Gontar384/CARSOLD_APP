package org.gontar.carsold.Test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("storage")
public class GoogleCloudStorageController {

    private final GoogleCloudStorageService service;

    public GoogleCloudStorageController(GoogleCloudStorageService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Attempt to upload the image and check for SafeSearch sensitivity
            String imageUrl = service.uploadFileWithSafeSearch(file);
            return ResponseEntity.ok("Upload successful: " + imageUrl);
        } catch (Exception e) {
            // Handle errors such as sensitive content detection
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}