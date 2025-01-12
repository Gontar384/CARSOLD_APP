package org.gontar.carsold.ServiceTest.UserManagementServiceTest;

import jakarta.servlet.http.Cookie;
import org.gontar.carsold.CarsoldApplication;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserManagementService.UserManagementServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
}
