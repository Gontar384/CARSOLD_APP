package org.gontar.carsold.ControllerTest.UserControllerTest;

import org.gontar.carsold.Controller.UserController.AuthenticationController;
import org.gontar.carsold.Service.UserService.AuthenticationService.AuthenticationService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @InjectMocks
    private AuthenticationController authenticationController;

    @Mock
    private AuthenticationService authenticationService;

    private MockMvc mockMvc;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authenticationController).build();
    }

    @Test
    public void checkAuth_authenticated() throws Exception {
        when(authenticationService.checkAuth()).thenReturn(true);

        mockMvc.perform(get("/api/public/auth/checkAuth"))
                .andExpect(status().isOk());
    }

    @Test
    public void checkAuth_notAuthenticated() throws Exception {
        when(authenticationService.checkAuth()).thenReturn(false);

        mockMvc.perform(get("/api/public/auth/checkAuth"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void fetchJwt() throws Exception {
        mockMvc.perform(get("/api/private/auth/fetchJwt"))
                .andExpect(status().isOk());
    }

    @Test
    public void activateAccount() throws Exception {
        String token = "sample-token";

        mockMvc.perform(patch("/api/public/auth/activateAccount")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":\"" + token + "\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void authenticate() throws Exception {
        String login = "user@example.com";
        String password = "password123";

        mockMvc.perform(post("/api/public/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"" + login + "\", \"password\":\"" + password + "\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void logout() throws Exception {
        mockMvc.perform(post("/api/public/auth/logout"))
                .andExpect(status().isOk());
    }
}