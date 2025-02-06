package org.gontar.carsold.Controller.UserController.UserManagementController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Model.User.User;
import org.gontar.carsold.Model.User.UserDto;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.validation.annotation.Validated;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@Validated
@RequestMapping("/api")
public class UserManagementController {

    private final UserManagementService service;
    private final Mapper<User, UserDto> mapper;

    public UserManagementController(UserManagementService service, Mapper<User, UserDto> mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping("/registerUser")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        User user = mapper.mapToEntity(userDto);
        User updatedUser = service.registerUser(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(updatedUser.getId())
                .toUri();
        UserDto updatedUserDto = mapper.mapToDto(updatedUser);
        return ResponseEntity.created(location).body(updatedUserDto);
    }

    @GetMapping("/fetchUsername")
    public ResponseEntity<Map<String, String>> fetchUsername(HttpServletRequest request) {
        HashMap<String, String> response = new HashMap<>();
        String username = service.fetchUsername(request);
        response.put("username", username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");
        service.changePassword(oldPassword, newPassword, request);
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
    public ResponseEntity<?> deleteUser(@RequestParam("password") String password, HttpServletRequest request) {
        service.deleteUser(password, request);
        return ResponseEntity.ok().build();
    }
}
