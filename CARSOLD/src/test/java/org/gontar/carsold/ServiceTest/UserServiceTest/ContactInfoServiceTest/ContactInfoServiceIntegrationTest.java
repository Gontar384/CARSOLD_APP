package org.gontar.carsold.ServiceTest.UserServiceTest.ContactInfoServiceTest;

import jakarta.transaction.Transactional;
import org.gontar.carsold.CarsoldApplication;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Domain.Model.User.CitySuggestionsDto;
import org.gontar.carsold.Exception.CustomException.InvalidValueException;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.UserService.ContactInfoService.ContactInfoServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

//need to set GOOGLE_APPLICATION_CREDENTIALS env manually in Test Configuration
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = CarsoldApplication.class)
@Transactional
public class ContactInfoServiceIntegrationTest {

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Autowired
    private ContactInfoServiceImpl contactInfoService;

    @Autowired
    private UserRepository repository;

    @Mock
    private SecurityContext securityContext;

    private User createAuthenticatedUser() {
        User user = new User();
        String testUsername = "testUsername";
        user.setUsername(testUsername);
        user.setEmail("test@gmail.com");
        user.setActive(true);
        user.setOauth2(false);
        repository.save(user);

        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        return user;
    }

    @Test
    public void updateName_deleteName() {
        User user = createAuthenticatedUser();
        user.setName("Matty");
        String testName = "";

        contactInfoService.updateName(testName);

        assertNull(user.getName());
    }

    @Test
    public void updateName_notRealName() {
        User user = createAuthenticatedUser();

        String testName = "inappropriateName";
        InvalidValueException exception = assertThrows(InvalidValueException.class, () -> contactInfoService.updateName(testName));

        assertEquals("Invalid name", exception.getMessage());
        assertNull(user.getName(), "User's name should remain null");
    }

    @Test
    public void updateName_isPolishName_success() {
        User user = createAuthenticatedUser();

        String testName = "Marcin";
        contactInfoService.updateName(testName);

        assertEquals("Marcin", user.getName());
    }

    @Test
    public void updateName_isValidName_success() {
        User user = createAuthenticatedUser();

        String testName = "Paul";
        contactInfoService.updateName(testName);

        assertEquals("Paul", user.getName());
    }

    @Test
    public void updatePhone_deletePhone () {
        User user = createAuthenticatedUser();
        user.setPhone("123456789");
        String testPhone = "";

        contactInfoService.updatePhone(testPhone);

        assertNull(user.getPhone());
    }

    @Test
    public void updatePhone_wrongPhoneFormat() {
        User user = createAuthenticatedUser();

        String testPhone = "123123123123";
        InvalidValueException exception = assertThrows(InvalidValueException.class, () -> contactInfoService.updatePhone(testPhone));

        assertEquals("Invalid phone number", exception.getMessage());
        assertNull(user.getPhone(), "User's name should remain null");
    }

    @Test
    public void updatePhone_withoutCountryNumber_success() {
        User user = createAuthenticatedUser();

        String testPhone = "721721721";
        contactInfoService.updatePhone(testPhone);

        assertEquals("+48 721 721 721", user.getPhone(), "Returns reformated number with default polish country number");
    }

    @Test
    public void updatePhone_withCountryNumber_success() {
        User user = createAuthenticatedUser();

        String testPhone = "+48 721 721 721";
        contactInfoService.updatePhone(testPhone);

        assertEquals("+48 721 721 721", user.getPhone(), "Returns reformated number with default polish country number");
    }

    @Test
    public void updateCity_failure_wrongCity() {
        User user = createAuthenticatedUser();

        String incorrectCity = "wrongCity";

        InvalidValueException exception = assertThrows(InvalidValueException.class, () -> contactInfoService.updateCity(incorrectCity));
        assertEquals("Invalid city", exception.getMessage());

        assertNull(user.getCity());
    }

    @Test
    public void updateCity_success() {
        User user = createAuthenticatedUser();

        String city = "Warsaw, Poland";

        contactInfoService.updateCity(city);
        assertEquals(city, user.getCity());
    }

    @Test
    public void fetchCitySuggestions() {
        String input = "Ber";
        List<String> expectedCityNames = Arrays.asList("Berlin, Germany", "Bergamo, Province of Bergamo, Italy", "Bergen, Norway", "Bern, Switzerland", "Berkeley, CA, USA");
        CitySuggestionsDto citySuggestions = contactInfoService.fetchCitySuggestions(input);
        System.out.println(citySuggestions);

        assertTrue(citySuggestions.getCitySuggestions().containsAll(expectedCityNames), "City suggestions should match");
    }
}
