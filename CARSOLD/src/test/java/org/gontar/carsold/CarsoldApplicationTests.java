package org.gontar.carsold;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class CarsoldApplicationTests {

    @Test
    void applicationStartsSuccessfully() {
        assertTrue(true, "The application context should load without exceptions");
    }
}
