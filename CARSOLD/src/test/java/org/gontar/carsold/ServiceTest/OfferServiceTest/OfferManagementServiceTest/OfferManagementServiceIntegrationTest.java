//package org.gontar.carsold.ServiceTest.OfferServiceTest.OfferManagementServiceTest;
//
//import com.google.cloud.storage.BlobInfo;
//import com.google.cloud.storage.Storage;
//import jakarta.transaction.Transactional;
//import org.gontar.carsold.Domain.Entity.Offer.Offer;
//import org.gontar.carsold.Domain.Entity.User.User;
//import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
//import org.gontar.carsold.Domain.Model.Offer.OfferWithUserDto;
//import org.gontar.carsold.Exception.CustomException.InappropriateContentException;
//import org.gontar.carsold.Exception.CustomException.NoPermissionException;
//import org.gontar.carsold.Repository.OfferRepository;
//import org.gontar.carsold.Repository.UserRepository;
//import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementServiceImpl;
//import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.web.multipart.MultipartFile;
//import java.time.LocalDateTime;
//import java.util.Collections;
//import java.util.List;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
////need to set GOOGLE_APPLICATION_CREDENTIALS and JWT_SECRET_KEY env manually in Test Run Configuration
//@ExtendWith(SpringExtension.class)
//@SpringBootTest
//@Transactional
//public class OfferManagementServiceIntegrationTest {
//
//    @Autowired
//    private OfferManagementServiceImpl offerManagementService;
//
//    @Autowired
//    private OfferRepository offerRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Mock
//    private MultipartFile mockMultipartFile;
//
//    @Mock
//    private Storage storage;
//
//    @Mock
//    private SecurityContext securityContext;
//
//    @BeforeAll
//    public static void init() {
//        TestEnvConfig.loadEnv();
//    }
//
//    private User createAndAuthenticateUser(String username, String email) {
//        User user = new User();
//        user.setUsername(username);
//        user.setEmail(email);
//        user.setActive(true);
//        user.setOauth2(false);
//        user = userRepository.saveAndFlush(user);
//
//        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
//        when(authentication.isAuthenticated()).thenReturn(true);
//        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
//        when(securityContext.getAuthentication()).thenReturn(authentication);
//        SecurityContextHolder.setContext(securityContext);
//
//        return user;
//    }
//
//    private Offer createOffer(User user, int time) {
//        Offer offer = new Offer();
//        offer.setUser(user);
//        offer.setTitle("Sell Audi Perfect");
//        offer.setBrand("Audi");
//        offer.setModel("S3");
//        offer.setBodyType("Sedan");
//        offer.setYear(2019);
//        offer.setMileage(120000);
//        offer.setFuel("Petrol");
//        offer.setCapacity(1984);
//        offer.setPower(310);
//        offer.setDrive("AWD");
//        offer.setTransmission("Automatic");
//        offer.setColor("Black");
//        offer.setCondition("Undamaged");
//        offer.setDescription("TestDescriptionTestDescriptionTestDescriptionTestDescriptionTestDescriptionTestDescription");
//        offer.setPrice(120000);
//        offer.setCurrency("PLN");
//        offer.setLastUpdated(LocalDateTime.now().minusMinutes(time));
//        offer = offerRepository.saveAndFlush(offer);
//
//        return offer;
//    }
//
//    @Test
//    public void createOffer_shouldCreateOffer_whenContentIsAppropriate() throws Exception {
//        createAndAuthenticateUser("testUser", "testUser@gmail.com");
//
//        Offer newOffer = new Offer();
//        newOffer.setTitle("Valid Title");
//        newOffer.setDescription("Valid Description");
//
//        byte[] pngImageBytes = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}; //PNG
//        when(mockMultipartFile.getBytes()).thenReturn(pngImageBytes);
//        when(mockMultipartFile.getOriginalFilename()).thenReturn("test.png");
//        when(mockMultipartFile.getSize()).thenReturn(1024L);
//        when(storage.create(any(BlobInfo.class), any(byte[].class))).thenReturn(null);
//
//        Offer createdOffer = offerManagementService.createOffer(newOffer, List.of(mockMultipartFile));
//
//        assertNotNull(createdOffer);
//        assertEquals("Valid Title", createdOffer.getTitle());
//        assertEquals("Valid Description", createdOffer.getDescription());
//    }
//
//    @Test
//    public void createOffer_shouldThrowInappropriateContentException_whenContentIsToxic() {
//        createAndAuthenticateUser("testUser2", "testUser2@gmail.com");
//
//        Offer mockOffer = new Offer();
//        mockOffer.setTitle("Moron Title");
//        mockOffer.setDescription("Moron Description");
//
//        InappropriateContentException exception = assertThrows(InappropriateContentException.class,
//                () -> offerManagementService.createOffer(mockOffer, Collections.emptyList()));
//
//        assertEquals("Title or description are inappropriate", exception.getMessage());
//    }
//
//    @Test
//    public void updateOffer_shouldUpdateOffer_whenUserHasPermission() {
//        User testUser = createAndAuthenticateUser("testUser3", "testUser3@gmail.com");
//        Offer existingOffer = createOffer(testUser, 10);
//
//        Offer updatedOffer = new Offer();
//        updatedOffer.setTitle("Updated Title");
//        updatedOffer.setDescription("Updated Description");
//
//        Offer result = offerManagementService.updateOffer(existingOffer.getId(), updatedOffer, Collections.emptyList());
//
//        assertNotNull(result);
//        assertEquals("Updated Title", result.getTitle());
//        assertEquals("Updated Description", result.getDescription());
//    }
//
//    @Test
//    public void updateOffer_shouldThrowNoPermissionException_whenUserDoesNotHavePermission() {
//        createAndAuthenticateUser("testUser4", "testUser4@gmail.com");
//
//        User testUser = new User();
//        testUser.setUsername("testUser5");
//        testUser.setEmail("testUser5@gmail.com");
//        testUser.setActive(true);
//        testUser.setOauth2(false);
//        testUser = userRepository.saveAndFlush(testUser);
//
//        Offer existingOffer = createOffer(testUser, 10);
//
//        Offer updatedOffer = new Offer();
//        updatedOffer.setTitle("Updated Title");
//        updatedOffer.setDescription("Updated Description");
//
//        NoPermissionException exception = assertThrows(NoPermissionException.class,
//                () -> offerManagementService.updateOffer(existingOffer.getId(), updatedOffer, Collections.emptyList()));
//
//        assertEquals("User has no permission to update offer", exception.getMessage());
//    }
//
//    @Test
//    public void updateOffer_shouldThrowAccessDeniedException_whenOfferWasJustUpdated() {
//        User testUser = createAndAuthenticateUser("testUser5", "testUser5@gmail.com");
//        Offer existingOffer = createOffer(testUser, 2);
//
//        Offer updatedOffer = new Offer();
//        updatedOffer.setTitle("Updated Title");
//        updatedOffer.setDescription("Updated Description");
//
//        AccessDeniedException exception = assertThrows(AccessDeniedException.class,
//                () -> offerManagementService.updateOffer(existingOffer.getId(), updatedOffer, Collections.emptyList()));
//
//        assertEquals("User can update offer only once every 5 minutes", exception.getMessage());
//    }
//
//    @Test
//    public void fetchOfferWithUser_shouldReturnOffer() {
//        User testUser = createAndAuthenticateUser("testUser6", "testUser6@gmail.com");
//        testUser.setContactPublic(true);
//        testUser.setCity("Warsaw, Poland");
//        Offer existingOffer = createOffer(testUser, 10);
//
//        OfferWithUserDto result = offerManagementService.fetchOfferWithUser(existingOffer.getId());
//
//        assertNotNull(result);
//        assertEquals("testUser6", result.getUsername());
//        assertEquals("Sell Audi Perfect", result.getTitle());
//        assertNotNull(result.getCoordinates());
//    }
//
//    @Test
//    public void deleteOffer_shouldDeleteOffer() {
//        User testUser = createAndAuthenticateUser("testUser7", "testUser7@gmail.com");
//        Offer existingOffer = createOffer(testUser, 10);
//
//        offerManagementService.deleteOffer(existingOffer.getId());
//
//        assertFalse(offerRepository.findById(existingOffer.getId()).isPresent());
//    }
//}