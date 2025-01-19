package org.gontar.carsold.ServiceTest.UserProfilePicServiceTest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.CarsoldApplication;
import org.gontar.carsold.ErrorsAndExceptions.InvalidTokenException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserProfilePicService.UserProfilePicServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

//need to set GOOGLE_APPLICATION_CREDENTIALS env manually in Test Configuration
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = CarsoldApplication.class)
public class UserProfilePicServiceIntegrationTest {

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Autowired
    private UserProfilePicServiceImpl service;

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    @Test
    public void testUploadProfilePic_failure_fileIsNotAnImage() throws IOException {
        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserProfilePicServiceTest/TestImages/fakeProfilePic.txt");
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        MockMultipartFile mockFile = new MockMultipartFile(
                "testFile",
                "fakeProfilePic.txt",
                "image/txt",
                fileBytes
        );

        boolean result = service.uploadProfilePicWithSafeSearch(mockFile, request);

        assertFalse(result, "Could not upload, this is not an image");
    }

    @Test
    public void testUploadProfilePicWithSafeSearch_failure_tooLargeImage() {
        byte[] largeFileBytes = new byte[4 * 1024 * 1024];
        largeFileBytes[0] = (byte) 0xFF;
        largeFileBytes[1] = (byte) 0xD8;
        largeFileBytes[2] = (byte) 0xFF;

        MockMultipartFile mockFile = new MockMultipartFile(
                "testFile",
                "largeProfilePic.jpg",
                "image/jpg",
                largeFileBytes
        );

        boolean result = service.uploadProfilePicWithSafeSearch(mockFile, request);

        assertFalse(result, "Could not upload, image is too large");
    }

    @Test
    public void testUploadProfilePicWithSafeSearch_failure_sensitiveImage() throws IOException {
        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserProfilePicServiceTest/TestImages/sensitiveProfilePic.png");
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        MockMultipartFile mockFile = new MockMultipartFile(
                "testFile",
                "sensitiveProfilePic.png",
                "image/png",
                fileBytes
        );

        boolean result = service.uploadProfilePicWithSafeSearch(mockFile, request);

        assertFalse(result, "Could not upload, image contains sensitive content");
    }

    @Test
    public void testUploadProfilePicWithSafeSearch_failure_problemWithRequest() throws IOException {
        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserProfilePicServiceTest/TestImages/profilePic.png");
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        MockMultipartFile mockFile = new MockMultipartFile(
                "testFile",
                "profilePic.png",
                "image/png",
                fileBytes
        );
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidTokenException("JWT token is missing or invalid"));

        boolean result = service.uploadProfilePicWithSafeSearch(mockFile, request);

        assertFalse(result, "Should return false, problem with request");
    }

    @Test
    public void testDeleteProfilePic_failure_problemWithRequest() {
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidTokenException("JWT token is missing or invalid"));

        boolean result = service.deleteProfilePic(request);

        assertFalse(result, "Should return false, problem with request");
    }

    @Test
    public void testUploadProfilePicWithSafeSearchAndDeleteProfilePicCombined_success() throws IOException {
        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserProfilePicServiceTest/TestImages/profilePic.png");
        byte[] fileBytes = Files.readAllBytes(file.toPath());
        MockMultipartFile mockFile = new MockMultipartFile(
                "testFile",
                "sensitiveProfilePic.png",
                "image/png",
                fileBytes
        );
        User user = new User();
        String testUsername = "testUsername";
        user.setUsername(testUsername);
        user.setEmail("test@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        boolean result = service.uploadProfilePicWithSafeSearch(mockFile, request);
        user = repo.findByUsername(testUsername);

        assertTrue(result, "Pic should be uploaded successfully");
        assertNotNull(user.getProfilePic(), "Pic URL should be saved in DB");
        String expectedUrlPrefix = "https://storage.googleapis.com/" + bucketName + "/" + user.getUsername();
        assertTrue(user.getProfilePic().startsWith(expectedUrlPrefix), "Pic URL should point to the cloud storage");

        boolean deleteResult = service.deleteProfilePic(request);
        user = repo.findByUsername(testUsername);

        assertTrue(deleteResult, "Pic should be deleted successfully");
        assertNull(user.getProfilePic(), "Pic URL should be removed from DB");

        //cleanup
        repo.delete(user);
    }

    //planned to add test which checks what happen when cloud storage fails, but it is too hard, since uploadProfilePic
    //method is private and I want to keep it private - provided well-structured logs, so this test is no so necessary
}
