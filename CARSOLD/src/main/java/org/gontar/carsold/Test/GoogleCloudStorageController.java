package org.gontar.carsold.Test;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("storage")
public class GoogleCloudStorageController {

    private final GoogleCloudStorageService service;

    public GoogleCloudStorageController(GoogleCloudStorageService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        try {
            Map<String, String> response = new HashMap<>();
            String info = service.uploadFileWithSafeSearch(file, request);
            response.put("info", info);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("Error uploading image: ", e.getMessage()));
        }
    }
}