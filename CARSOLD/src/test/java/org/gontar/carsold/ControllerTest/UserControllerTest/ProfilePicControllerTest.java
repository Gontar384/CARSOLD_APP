package org.gontar.carsold.ControllerTest.UserControllerTest;

import org.gontar.carsold.Controller.UserController.ProfilePicController;
import org.gontar.carsold.Service.UserService.ProfilePicService.ProfilePicService;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProfilePicControllerTest {

    @InjectMocks
    private ProfilePicController profilePicController;

    @Mock
    private ProfilePicService profilePicService;

    @Mock
    private MockMvc mockMvc;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(profilePicController).build();
    }

    @Test
    public void fetchProfilePic() throws Exception {
        String profilePicUrl = "https://example.com/profilePic.png";
        when(profilePicService.fetchProfilePic()).thenReturn(profilePicUrl);

        mockMvc.perform(get("/api/fetchProfilePic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(profilePicUrl));
    }

    @Test
    public void uploadProfilePic() throws Exception {
        byte[] imageBytes = Files.readAllBytes(Paths.get("src/test/java/org/gontar/carsold/ServiceTest/UserServiceTest/ProfilePicServiceTest/TestImage/profilePic.png"));
        MockMultipartFile file = new MockMultipartFile("file", "profilePic.png", "image/png", imageBytes);

        doNothing().when(profilePicService).uploadProfilePic(any(MultipartFile.class));

        mockMvc.perform(multipart("/api/uploadProfilePic").file(file)
                        .with(request -> { request.setMethod("PATCH"); return request; }))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteProfilePic() throws Exception {
        doNothing().when(profilePicService).deleteProfilePic();

        mockMvc.perform(delete("/api/deleteProfilePic"))
                .andExpect(status().isOk());
    }
}
