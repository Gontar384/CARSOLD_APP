package org.gontar.carsold.ServiceTest.UserGetInfoServiceTest;

import org.gontar.carsold.CarsoldApplication;
import org.gontar.carsold.Service.UserService.UserGetInfoService.UserGetInfoServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = CarsoldApplication.class)
public class UserGetInfoServiceIntegrationTest {

    @Autowired
    private UserGetInfoServiceImpl service;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Test
    public void testCheckIfUsernameSafe_withToxicUsername() {
        assertFalse(service.checkIfUsernameSafe("n1gg3r"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("bitch"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("debilJebany"), "Should return false, username is inappropriate");
    }

    @Test
    public void testCheckIfUsernameSafe_withNonToxicUsername() {
        assertTrue(service.checkIfUsernameSafe("Mikey"), "Should return true, username is appropriate");
        assertTrue(service.checkIfUsernameSafe("CarEnjoyer23"), "Should return true, username is appropriate");
        assertTrue(service.checkIfUsernameSafe("Ziomal32"), "Should return true, username is appropriate");
    }
}
