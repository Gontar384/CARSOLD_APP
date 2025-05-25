package org.gontar.carsold.ControllerTest.UserControllerTest;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Controller.UserController.UserManagementController;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.User.PasswordChangeDto;
import org.gontar.carsold.Domain.Model.User.RecoveryPasswordChangeDto;
import org.gontar.carsold.Domain.Model.User.UserDto;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementService;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserManagementControllerTest {

    @InjectMocks
    private UserManagementController userManagementController;

    @Mock
    private UserManagementService userManagementService;

    private MockMvc mockMvc;

    @Mock
    private Mapper<User, UserDto> mapper;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userManagementController).build();
    }

    @Test
    public void registerUser() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setUsername("newUser");

        User user = new User();
        user.setId(1L);
        user.setUsername("newUser");

        when(mapper.mapToEntity(any(UserDto.class))).thenReturn(user);
        when(userManagementService.registerUser(any(User.class), eq(false))).thenReturn(user);
        when(mapper.mapToDto(any(User.class))).thenReturn(userDto);

        String userDtoJson = """
        {
            "username": "newUser"
        }
        """;

        mockMvc.perform(post("/api/public/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userDtoJson))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.username").value("newUser"));
    }

    @Test
    public void fetchUsername() throws Exception {
        String username = "existingUser";
        when(userManagementService.fetchUsername()).thenReturn(username);

        mockMvc.perform(get("/api/private/user/fetchUsername"))
                .andExpect(status().isOk());
    }

    @Test
    public void changePassword() throws Exception {
        PasswordChangeDto passwordChangeDto = new PasswordChangeDto();
        passwordChangeDto.setOldPassword("oldPassword");
        passwordChangeDto.setNewPassword("newPassword");

        doNothing().when(userManagementService).changePassword("oldPassword", "newPassword");

        mockMvc.perform(patch("/api/private/user/changePassword")
                        .contentType("application/json")
                        .content("{\"oldPassword\":\"oldPassword\", \"newPassword\":\"newPassword\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void changePasswordRecovery() throws Exception {
        RecoveryPasswordChangeDto recoveryPasswordChangeDto = new RecoveryPasswordChangeDto();
        recoveryPasswordChangeDto.setToken("recoveryToken");
        recoveryPasswordChangeDto.setPassword("newPassword");

        doNothing().when(userManagementService).changePasswordRecovery(eq("recoveryToken"), eq("newPassword"), any(), any());

        mockMvc.perform(patch("/api/public/user/changePasswordRecovery")
                        .contentType("application/json")
                        .content("{\"token\":\"recoveryToken\", \"password\":\"newPassword\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteUser() throws Exception {
        String password = "userPassword";

        doNothing().when(userManagementService).deleteUser(eq(password), any(), any(), any());

        mockMvc.perform(delete("/api/private/user/delete")
                        .param("password", password))
                .andExpect(status().isOk());
    }
}