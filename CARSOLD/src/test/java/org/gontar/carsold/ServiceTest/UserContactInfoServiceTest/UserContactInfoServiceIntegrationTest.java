package org.gontar.carsold.ServiceTest.UserContactInfoServiceTest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.CarsoldApplication;
import org.gontar.carsold.ErrorsAndExceptions.InvalidTokenException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserContactInfoService.UserContactInfoServiceImpl;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

//need to set GOOGLE_APPLICATION_CREDENTIALS env manually in Test Configuration
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = CarsoldApplication.class)
public class UserContactInfoServiceIntegrationTest {

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @Autowired
    private UserContactInfoServiceImpl service;

    @Autowired
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Autowired
    private UserRepository repo;

    @Test
    public void testChangeName_failure_problemWithRequest() {
        String testName = "Kuba";
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidTokenException("JWT is missing in the cookie"));

        boolean result = service.changeName(testName, request);

        assertFalse(result, "Should return false, problem with request");
    }

    @Test
    public void testChangeName_failure_inappropriateName() {
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

        String testName = "inappropriateName";
        boolean result = service.changeName(testName, request);
        user = repo.findByUsername(testUsername);

        assertFalse(result, "Should return false, name is inappropriate");
        assertNull(user.getName(), "User's name should remain null");

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangeName_success_isPolishName() {
        User user = new User();
        String testUsername = "testUsername1";
        user.setUsername(testUsername);
        user.setEmail("test1@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String testName = "Marcin";
        boolean result = service.changeName(testName, request);
        user = repo.findByUsername(testUsername);

        assertTrue(result, "Should return true, is is polish name");
        assertEquals("Marcin", user.getName());

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangeName_success_isValidName() {
        User user = new User();
        String testUsername = "testUsername2";
        user.setUsername(testUsername);
        user.setEmail("test2@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String testName = "Paul";
        boolean result = service.changeName(testName, request);
        user = repo.findByUsername(testUsername);

        assertTrue(result, "Should return true, name is valid");
        assertEquals("Paul", user.getName());

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangePhone_failure_problemWithRequest() {
        String testPhone = "721721721";
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidTokenException("JWT is missing in the cookie"));

        boolean result = service.changePhone(testPhone, request);

        assertFalse(result, "Should return false, problem with request");
    }

    @Test
    public void testChangePhone_failure_wrongPhoneFormat() {
        User user = new User();
        String testUsername = "testUsername3";
        user.setUsername(testUsername);
        user.setEmail("test3@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String testPhone = "123123123123";

        boolean result = service.changePhone(testPhone, request);
        user = repo.findByUsername(testUsername);

        assertFalse(result, "Should return false, phone is incorrect");
        assertNull(user.getPhone());

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangePhone_success_withoutCountryNumber() {
        User user = new User();
        String testUsername = "testUsername4";
        user.setUsername(testUsername);
        user.setEmail("test4@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String testPhone = "721721721";

        boolean result = service.changePhone(testPhone, request);
        user = repo.findByUsername(testUsername);

        assertTrue(result, "Should return true, phone is correct");
        assertEquals("+48 721 721 721", user.getPhone(), "Returns reformated number with default polish country number");

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangePhone_success_withCountryNumber() {
        User user = new User();
        String testUsername = "testUsername5";
        user.setUsername(testUsername);
        user.setEmail("test5@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String testPhone = "+49645363822";  //german number

        boolean result = service.changePhone(testPhone, request);
        user = repo.findByUsername(testUsername);

        assertTrue(result, "Should return true, phone is correct");
        assertEquals("+49 6453 63822", user.getPhone(), "Returns reformated number with provided country number");

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangeCity_failure_incorrectCity() {
        User user = new User();
        String testUsername = "testUsername6";
        user.setUsername(testUsername);
        user.setEmail("test6@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String incorrectCity = "wrongCity";
        boolean result = service.changeCity(incorrectCity, request);

        assertFalse(result, "Should return false, city is incorrect");
        assertNull(user.getCity());

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testChangeCity_success() {
        User user = new User();
        String testUsername = "testUsername7";
        user.setUsername(testUsername);
        user.setEmail("test7@gmail.com");
        user.setActive(true);
        user.setOauth2User(false);
        repo.save(user);

        String testToken = jwtService.generateToken(testUsername, 1L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("JWT", testToken));

        String incorrectCity = "Warszawa";
        boolean result = service.changeCity(incorrectCity, request);
        user = repo.findByUsername(testUsername);

        assertTrue(result, "Should return true");
        assertEquals("Warszawa", user.getCity());

        //cleanup
        repo.delete(user);
    }

    @Test
    public void testFetchCitySuggestions_success() {
        String input = "Po";
        List<String> expectedCityNames = Arrays.asList("Poznań, Poland", "Potsdam, Germany", "Poprad, Slovakia");
        List<String> citySuggestions = service.fetchCitySuggestions(input);

        assertTrue(citySuggestions.containsAll(expectedCityNames), "City suggestions should match");
    }
}
