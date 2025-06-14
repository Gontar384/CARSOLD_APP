package org.gontar.carsold;

import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

//need to set GOOGLE_APPLICATION_CREDENTIALS and JWT_SECRET_KEY env manually in Test Run Configuration
@SpringBootTest
class CarsoldApplicationTests {

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Test
    void applicationStartsSuccessfully() {
        assertTrue(true, "The application context should load without exceptions");
    }
}
