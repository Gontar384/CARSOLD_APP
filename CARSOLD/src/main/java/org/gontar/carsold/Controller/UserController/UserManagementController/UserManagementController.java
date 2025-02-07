package org.gontar.carsold.Controller.UserController.UserManagementController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Model.Dto.PasswordChangeDto;
import org.gontar.carsold.Model.Dto.RecoveryPasswordChangeDto;
import org.gontar.carsold.Model.Dto.SingleStringDto;
import org.gontar.carsold.Model.User.User;
import org.gontar.carsold.Model.Dto.UserDto;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.validation.annotation.Validated;
import java.net.URI;

@RestController
@RequestMapping("/api")
@Validated
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
    public ResponseEntity<SingleStringDto> fetchUsername(HttpServletRequest request) {
        String username = service.fetchUsername(request);
        SingleStringDto response = new SingleStringDto(username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDto passwordChangeDto, HttpServletRequest request) {
        String newPassword = passwordChangeDto.getNewPassword();
        String oldPassword = passwordChangeDto.getOldPassword();
        service.changePassword(oldPassword, newPassword, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/changePasswordRecovery")
    public ResponseEntity<?> changePasswordRecovery(@RequestBody RecoveryPasswordChangeDto recoveryPasswordChangeDto, HttpServletResponse response) {
        String token = recoveryPasswordChangeDto.getToken();
        String password = recoveryPasswordChangeDto.getPassword();
        service.changePasswordRecovery(token, password, response);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam("password") String password, HttpServletRequest request) {
        service.deleteUser(password, request);
        return ResponseEntity.ok().build();
    }
}
