package org.gontar.carsold.ServiceTest.UserManagementServiceTest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.CarsoldApplication;
import org.gontar.carsold.Exceptions.CustomExceptions.InvalidJwtException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

//need to set GOOGLE_APPLICATION_CREDENTIALS env manually in Test Configuration
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = CarsoldApplication.class)
public class UserManagementServiceIntegrationTest {

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Autowired
    private UserManagementServiceImpl service;

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Test
    public void deleteUserAccount_success() {
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

        boolean result = service.deleteUserAccount(request);

        assertTrue(result, "User should be deleted");
        assertFalse(repo.existsByUsername(testUsername), "User should not exist in the database");
    }

    @Test
    public void deleteUserAccount_failure_problemWithRequest() {
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidJwtException("JWT is missing in the cookie"));

        boolean result = service.deleteUserAccount(request);

        assertFalse(result, "Should return false, problem with request");
    }
}
