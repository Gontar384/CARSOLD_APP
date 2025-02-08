package org.gontar.carsold.Controller.UserController;

import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Model.PasswordChangeDto;
import org.gontar.carsold.Domain.Model.RecoveryPasswordChangeDto;
import org.gontar.carsold.Domain.Model.SingleStringDto;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.UserDto;
import org.gontar.carsold.Service.UserService.ManagementService.ManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.validation.annotation.Validated;
import java.net.URI;

@RestController
@RequestMapping("/api")
@Validated
public class ManagementController {

    private final ManagementService service;
    private final Mapper<User, UserDto> mapper;

    public ManagementController(ManagementService service, Mapper<User, UserDto> mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping("/registerUser")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        User user = mapper.mapToEntity(userDto);
        User createdUser = service.registerUser(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();
        UserDto createdUserDto = mapper.mapToDto(createdUser);
        return ResponseEntity.created(location).body(createdUserDto);
    }

    @GetMapping("/fetchUsername")
    public ResponseEntity<SingleStringDto> fetchUsername() {
        String username = service.fetchUsername();
        SingleStringDto response = new SingleStringDto(username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDto passwordChangeDto) {
        String newPassword = passwordChangeDto.getNewPassword();
        String oldPassword = passwordChangeDto.getOldPassword();
        service.changePassword(oldPassword, newPassword);
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
    public ResponseEntity<?> deleteUser(@RequestParam("password") String password) {
        service.deleteUser(password);
        return ResponseEntity.ok().build();
    }
}
