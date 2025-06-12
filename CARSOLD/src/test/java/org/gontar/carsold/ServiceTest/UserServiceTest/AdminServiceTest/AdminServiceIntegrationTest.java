package org.gontar.carsold.ServiceTest.UserServiceTest.AdminServiceTest;

import com.google.cloud.storage.Storage;
import jakarta.transaction.Transactional;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.UserService.AdminService.AdminServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

//need to set GOOGLE_APPLICATION_CREDENTIALS and JWT_SECRET_KEY env manually in Test Run Configuration
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class AdminServiceIntegrationTest {

    @Autowired
    private AdminServiceImpl adminService;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private Storage storage;

    @Mock
    private SecurityContext securityContext;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    private User createAndAuthenticateUser(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setActive(true);
        user.setOauth2(false);
        user = userRepository.saveAndFlush(user);

        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        return user;
    }

    private Offer createOffer(User user) {
        Offer offer = new Offer();
        offer.setUser(user);
        offer.setTitle("Perfect Car For Sale");
        offer.setBrand("Audi");
        offer.setModel("S3");
        offer.setBodyType("Sedan");
        offer.setYear(2019);
        offer.setMileage(120000);
        offer.setFuel("Petrol");
        offer.setCapacity(1984);
        offer.setPower(310);
        offer.setDrive("AWD");
        offer.setTransmission("Automatic");
        offer.setColor("Black");
        offer.setCondition("Undamaged");
        offer.setDescription("TestDescriptionTestDescriptionTestDescriptionTestDescriptionTestDescriptionTestDescription");
        offer.setPrice(120000);
        offer.setCurrency("PLN");
        offer = offerRepository.saveAndFlush(offer);
        return offer;
    }

    @Test
    public void adminDeleteOffer_shouldDeleteOfferAndImages() {
        User testUser = createAndAuthenticateUser("testUser13", "testUser13@gmail.com");
        Offer existingOffer = createOffer(testUser);

        adminService.adminDeleteOffer(existingOffer.getId());

        assertFalse(offerRepository.findById(existingOffer.getId()).isPresent());
    }

    @Test
    public void adminDeleteOffer_shouldThrowOfferNotFound_whenOfferDoesNotExist() {
        Long nonExistingOfferId = 999L;

        OfferNotFound exception = assertThrows(OfferNotFound.class,
                () -> adminService.adminDeleteOffer(nonExistingOfferId));

        assertEquals("Offer not found", exception.getMessage());
    }

    @Test
    public void adminDeleteUser_shouldDeleteUserAndCleanupFollowedOffers() {
        User testUser = createAndAuthenticateUser("testUser14", "testUser14@gmail.com");

        adminService.adminDeleteUser(testUser.getUsername());

        assertFalse(userRepository.findById(testUser.getId()).isPresent());
    }

    @Test
    public void adminDeleteUser_shouldThrowUserNotFoundException_whenUserDoesNotExist() {
        String nonExistingUsername = "nonExistingUser";
        UserNotFoundException exception = assertThrows(UserNotFoundException.class,
                () -> adminService.adminDeleteUser(nonExistingUsername));

        assertEquals("User not found", exception.getMessage());
    }
}