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
    public ResponseEntity<Boolean> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(service.registerUser(userDto));
    }

    //changes password
    @PutMapping("/auth/password-recovery-change")
    public ResponseEntity<Map<String, Boolean>> updatePasswordRecovery(
            @RequestBody Map<String, String> payload, HttpServletResponse response) {
        String token = payload.get("token");
        String password = payload.get("password");
        Map<String, Boolean> responseMap = new HashMap<>();
        responseMap.put("success", service.recoveryChangePassword(token, password, response));
        return ResponseEntity.ok(responseMap);
    }

    @PutMapping("/auth/password-change")
    public ResponseEntity<Map<String, Boolean>> updatePassword(
            @RequestBody Map<String, String> payload, HttpServletRequest request) {
        String password = payload.get("password");
        Map<String, Boolean> responseMap = new HashMap<>();
        responseMap.put("success", service.changePassword(password, request));
        return ResponseEntity.ok(responseMap);
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
