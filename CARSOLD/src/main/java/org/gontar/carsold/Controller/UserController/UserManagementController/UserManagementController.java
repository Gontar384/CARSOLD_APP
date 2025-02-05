package org.gontar.carsold.Controller.UserController.UserManagementController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserManagementController {

    private final UserManagementService service;

    public UserManagementController(UserManagementService service) {
        this.service = service;
    }

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        service.registerUser(userDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetchUsername")
    public ResponseEntity<Map<String, String>> fetchUsername(HttpServletRequest request) {
        HashMap<String, String> usernameResponse = new HashMap<>();
        String username = service.fetchUsername(request);
        usernameResponse.put("username", username);
        return ResponseEntity.ok(usernameResponse);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String password = payload.get("password");
        service.changePassword(password, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/changePasswordRecovery")
    public ResponseEntity<?> changePasswordRecovery(@RequestBody Map<String, String> payload, HttpServletResponse response) {
        String token = payload.get("token");
        String password = payload.get("password");
        service.changePasswordRecovery(token, password, response);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(HttpServletRequest request) {
        service.deleteUser(request);
        return ResponseEntity.ok().build();
    }
}
