package org.gontar.carsold.ControllerTest.UserControllerTest;

import org.gontar.carsold.Controller.UserController.InfoController;
import org.gontar.carsold.Domain.Model.User.UserInfoDto;
import org.gontar.carsold.Service.UserService.InfoService.InfoService;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class InfoControllerTest {

    @InjectMocks
    private InfoController infoController;

    @Mock
    private InfoService infoService;

    private MockMvc mockMvc;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(infoController).build();
    }

    @Test
    public void checkLogin_exists() throws Exception {
        String login = "existingLogin";
        when(infoService.checkLogin(login)).thenReturn(true);

        mockMvc.perform(get("/api/public/userInfo/checkLogin")
                        .param("login", login))
                .andExpect(status().isOk());
    }

    @Test
    public void checkLogin_notExists() throws Exception {
        String login = "nonExistingLogin";
        when(infoService.checkLogin(login)).thenReturn(false);

        mockMvc.perform(get("/api/public/userInfo/checkLogin")
                        .param("login", login))
                .andExpect(status().isOk());
    }

    @Test
    public void checkInfo() throws Exception {
        String login = "userLogin";
        when(infoService.checkAccount(login)).thenReturn(new UserInfoDto());

        mockMvc.perform(get("/api/public/userInfo/checkAccount")
                        .param("login", login))
                .andExpect(status().isOk());
    }

    @Test
    public void checkGoogleAuth_true() throws Exception {
        when(infoService.checkGoogleAuth()).thenReturn(true);

        mockMvc.perform(get("/api/private/userInfo/checkGoogleAuth"))
                .andExpect(status().isOk());
    }

    @Test
    public void checkGoogleAuth_false() throws Exception {
        when(infoService.checkGoogleAuth()).thenReturn(false);

        mockMvc.perform(get("/api/private/userInfo/checkGoogleAuth"))
                .andExpect(status().isOk());
    }

    @Test
    public void checkOldPassword_correct() throws Exception {
        String password = "oldPassword";
        when(infoService.checkOldPassword(password)).thenReturn(true);

        mockMvc.perform(get("/api/private/userInfo/checkOldPassword")
                        .param("password", password))
                .andExpect(status().isOk());
    }

    @Test
    public void checkOldPassword_incorrect() throws Exception {
        String password = "wrongPassword";
        when(infoService.checkOldPassword(password)).thenReturn(false);

        mockMvc.perform(get("/api/private/userInfo/checkOldPassword")
                        .param("password", password))
                .andExpect(status().isOk());
    }

    @Test
    public void checkAdmin_true() throws Exception {
        when(infoService.checkAdmin()).thenReturn(true);

        mockMvc.perform(get("/api/private/userInfo/checkAdmin"))
                .andExpect(status().isOk());
    }

    @Test
    public void checkAdmin_false() throws Exception {
        when(infoService.checkAdmin()).thenReturn(false);

        mockMvc.perform(get("/api/private/userInfo/checkAdmin"))
                .andExpect(status().isOk());
    }
}