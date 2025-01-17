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

//need to set GOOGLE_APPLICATION_CREDENTIALS env manually in Test Configuration
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
    public void testCheckIfUsernameSafe_withInappropriateUsername() {
        assertFalse(service.checkIfUsernameSafe("testCwel"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("testFrajer"));
        assertFalse(service.checkIfUsernameSafe("testMurzyn"));
        assertFalse(service.checkIfUsernameSafe("hitler12"));
    }

    @Test
    public void testCheckIfUsernameSafe_withToxicUsername() {
        assertFalse(service.checkIfUsernameSafe("n1gg3r"), "Should return false, username is inappropriate");
        assertFalse(service.checkIfUsernameSafe("bitch"));
        assertFalse(service.checkIfUsernameSafe("debilJebany"));
    }

    @Test
    public void testCheckIfUsernameSafe_withNonToxicUsername() {
        assertTrue(service.checkIfUsernameSafe("Mikey"), "Should return true, username is appropriate");
        assertTrue(service.checkIfUsernameSafe("CarEnjoyer23"));
        assertTrue(service.checkIfUsernameSafe("Ziomal32"));
    }
}
