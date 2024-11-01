package org.gontar.carsold.Controller;

import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Service.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserServiceImpl service;

    public UserController(UserServiceImpl service) {
        this.service = service;
    }

    //checks if mail already exists
    @GetMapping("/auth/register/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam("email") String email) {
        Map<String, Boolean> response = new HashMap<>();
        boolean exists = service.findEmail(email);
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    //checks if username already exists
    @GetMapping("/auth/register/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam("username") String username) {
        Map<String, Boolean> response = new HashMap<>();
        boolean exists = service.findUsername(username);
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    //registering user, saving to DB
    @PostMapping("auth/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto) {
        service.registerUser(userDto);
        return ResponseEntity.ok("User saved");
    }

    //activating account
    @GetMapping("auth/activate")
    public ResponseEntity<String> activate(@RequestParam("token") String token,
                                           HttpServletResponse response) {
        service.activateAccount(token, response);
        return ResponseEntity.ok("Account activated");
    }
}
