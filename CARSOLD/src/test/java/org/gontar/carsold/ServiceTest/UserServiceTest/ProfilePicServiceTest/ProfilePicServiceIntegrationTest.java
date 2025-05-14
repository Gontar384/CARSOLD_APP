//package org.gontar.carsold.ServiceTest.UserServiceTest.ProfilePicServiceTest;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.transaction.Transactional;
//import org.gontar.carsold.CarsoldApplication;
//import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
//import org.gontar.carsold.Domain.Entity.User.User;
//import org.gontar.carsold.Exception.CustomException.InappropriateContentException;
//import org.gontar.carsold.Exception.CustomException.MediaNotSupportedException;
//import org.gontar.carsold.Repository.UserRepository;
//import org.gontar.carsold.Service.UserService.ProfilePicService.ProfilePicServiceImpl;
//import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import java.io.File;
//import java.io.IOException;
//import java.nio.file.Files;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
////need to set GOOGLE_APPLICATION_CREDENTIALS and JWT_SECRET_KEY env manually in Test Run Configuration
//@ExtendWith(SpringExtension.class)
//@SpringBootTest(classes = CarsoldApplication.class)
//@Transactional
//public class ProfilePicServiceIntegrationTest {
//
//    @BeforeAll
//    public static void init() {
//        TestEnvConfig.loadEnv();
//    }
//
//    @Autowired
//    private ProfilePicServiceImpl profilePicService;
//
//    @Autowired
//    private UserRepository repository;
//
//    @Mock
//    private SecurityContext securityContext;
//
//    @Mock
//    private HttpServletRequest request;
//
//    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
//    private String bucketName;
//
//    @Test
//    public void uploadProfilePic_fileIsNotAnImage() throws IOException {
//        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserServiceTest/ProfilePicServiceTest/TestImage/fakeProfilePic.txt");
//        byte[] fileBytes = Files.readAllBytes(file.toPath());
//        MockMultipartFile mockFile = new MockMultipartFile(
//                "testFile",
//                "fakeProfilePic.txt",
//                "image/txt",
//                fileBytes
//        );
//
//        MediaNotSupportedException exception = assertThrows(MediaNotSupportedException.class, () -> profilePicService.uploadProfilePic(mockFile));
//
//        assertEquals("This is not an acceptable image", exception.getMessage());
//    }
//
//    @Test
//    public void uploadProfilePic_tooLargeImage() {
//        byte[] largeFileBytes = new byte[4 * 1024 * 1024];
//        largeFileBytes[0] = (byte) 0xFF;
//        largeFileBytes[1] = (byte) 0xD8;
//        largeFileBytes[2] = (byte) 0xFF;
//
//        MockMultipartFile mockFile = new MockMultipartFile(
//                "testFile",
//                "largeProfilePic.jpg",
//                "image/jpg",
//                largeFileBytes
//        );
//
//        MediaNotSupportedException exception = assertThrows(MediaNotSupportedException.class, () -> profilePicService.uploadProfilePic(mockFile));
//
//        assertEquals("Image is too large", exception.getMessage());
//    }
//
//    @Test
//    public void uploadProfilePic_sensitiveImage() throws IOException {
//        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserServiceTest/ProfilePicServiceTest/TestImage/sensitiveProfilePic.png");
//        byte[] fileBytes = Files.readAllBytes(file.toPath());
//        MockMultipartFile mockFile = new MockMultipartFile(
//                "testFile",
//                "sensitiveProfilePic.png",
//                "image/png",
//                fileBytes
//        );
//
//        InappropriateContentException exception = assertThrows(InappropriateContentException.class, () -> profilePicService.uploadProfilePic(mockFile));
//
//        assertEquals("Image contains sensitive content", exception.getMessage());
//    }
//
//    @Test
//    public void uploadProfilePic_deleteProfilePic_combined_success() throws IOException {
//        File file = new File("src/test/java/org/gontar/carsold/ServiceTest/UserServiceTest/ProfilePicServiceTest/TestImage/profilePic.png");
//        byte[] fileBytes = Files.readAllBytes(file.toPath());
//        MockMultipartFile mockFile = new MockMultipartFile(
//                "testFile",
//                "profilePic.png",
//                "image/png",
//                fileBytes
//        );
//        User user = new User();
//        String testUsername = "testUsername";
//        user.setUsername(testUsername);
//        user.setEmail("test@gmail.com");
//        user.setActive(true);
//        user.setOauth2(false);
//        repository.save(user);
//
//        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
//        when(authentication.isAuthenticated()).thenReturn(true);
//        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
//        when(securityContext.getAuthentication()).thenReturn(authentication);
//        SecurityContextHolder.setContext(securityContext);
//
//        profilePicService.uploadProfilePic(mockFile);
//
//        assertNotNull(user.getProfilePic(), "Pic URL should be saved in DB");
//        String expectedUrlPrefix = "https://storage.googleapis.com/" + bucketName + "/" + user.getUsername();
//        assertTrue(user.getProfilePic().startsWith(expectedUrlPrefix), "Pic URL should point to the cloud storage");
//
//        profilePicService.deleteProfilePic();
//
//        assertNull(user.getProfilePic(), "Pic URL should be removed from DB");
//    }
//}