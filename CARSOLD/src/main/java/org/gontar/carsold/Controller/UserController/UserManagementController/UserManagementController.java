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

    //registers user, saves to DB
    @PostMapping("/auth/register")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto) {
        service.registerUser(userDto);
        return ResponseEntity.ok("User saved");
    }

    //changes password
    @PutMapping("/auth/password-recovery-change")
    public ResponseEntity<String> updatePasswordRecovery(
            @RequestBody Map<String, String> payload, HttpServletResponse response) {
        String token = payload.get("token");
        String password = payload.get("password");
        String message = service.recoveryChangePassword(token, password, response);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/auth/password-change")
    public ResponseEntity<String> updatePassword(
            @RequestBody Map<String, String> payload, HttpServletRequest request) {
        String password = payload.get("password");
        System.out.println(password);
        String message = service.changePassword(password, request);
        return ResponseEntity.ok(message);
    }

    //fetches username
    @GetMapping("/get-username")
    public ResponseEntity<Map<String, String>> getUsername(HttpServletRequest request) {
        HashMap<String, String> usernameResponse = new HashMap<>();
        String username = service.getUsername(request);
        usernameResponse.put("username", username);
        return ResponseEntity.ok(usernameResponse);
    }

    //deletes user
    @DeleteMapping("/delete-user")
    public ResponseEntity<Boolean> deleteUser(HttpServletRequest request) {
        return ResponseEntity.ok(service.deleteUserAccount(request));
    }
}
