package org.gontar.carsold.Controller.UserController.UserContactInfoController;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Service.UserService.UserContactInfoService.UserContactInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserContactInfoController {

    private final UserContactInfoService service;

    public UserContactInfoController(UserContactInfoService service) {
        this.service = service;
    }

    //updates contact name
    @PutMapping("/contact-set-name")
    public ResponseEntity<Boolean> updateName(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String name = payload.get("name");
        return ResponseEntity.ok(service.changeName(name, request));
    }

    //updates contact phone
    @PutMapping("/contact-set-phone")
    public ResponseEntity<Boolean> updatePhone(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String phone = payload.get("phone");
        return ResponseEntity.ok(service.changePhone(phone, request));
    }

    //updates contact city
    @PutMapping("/contact-set-city")
    public ResponseEntity<Boolean> updateCity(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String city = payload.get("city");
        return ResponseEntity.ok(service.changeCity(city, request));
    }

    //returns city suggestions
    @GetMapping("/get-city-suggestions")
    public ResponseEntity<List<String>> getCitySuggestions(@RequestParam String value) {
        return ResponseEntity.ok(service.fetchCitySuggestions(value));
    }

    //updates contactPublic, then returns its value
    @PutMapping("/change-contactInfoPublic")
    public ResponseEntity<Map<String, Boolean>> updateContactInfoPublic(HttpServletRequest request, @RequestBody Map<String, Boolean> payload) {
        Boolean isPublic = payload.get("isPublic");
        boolean changedValue = service.changeContactInfoPublic(request, isPublic);
        Map<String, Boolean> response = new HashMap<>();
        response.put("changedValue", changedValue);
        return ResponseEntity.ok(response);
    }

    //returns contactPublic
    @GetMapping("/fetch-contactInfoPublic")
    public ResponseEntity<Map<String, Boolean>> getContactInfoPublic(HttpServletRequest request) {
        Map<String, Boolean> response = new HashMap<>();
        boolean isPublic = service.fetchContactInfoPublic(request);
        response.put("isPublic", isPublic);
        return ResponseEntity.ok(response);
    }

    //returns contact info
    @GetMapping("/fetch-contact-info")
    public ResponseEntity<Map<String, String>> getContactInfo(HttpServletRequest request) {
        Map<String, String> response = service.fetchInfo(request);
        return ResponseEntity.ok(response);
    }
}
