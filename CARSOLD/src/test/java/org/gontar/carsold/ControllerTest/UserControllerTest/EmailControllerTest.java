package org.gontar.carsold.ControllerTest.UserControllerTest;

import org.gontar.carsold.Controller.UserController.EmailController;
import org.gontar.carsold.Service.UserService.EmailService.EmailService;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
public class EmailControllerTest {

    @InjectMocks
    private EmailController emailController;

    @Mock
    private EmailService emailService;

    private MockMvc mockMvc;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(emailController).build();
    }

    @Test
    public void sendPasswordRecoveryEmail() throws Exception {
        String json = """
        {
          "email": "test@gmail.com",
          "translate": "false"
        }
        """;

        mockMvc.perform(post("/api/public/email/sendPasswordRecoveryEmail")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }
}
