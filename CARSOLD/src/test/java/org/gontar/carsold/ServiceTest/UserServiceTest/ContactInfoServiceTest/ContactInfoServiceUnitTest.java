//package org.gontar.carsold.ServiceTest.UserServiceTest.ContactInfoServiceTest;
//
//import org.gontar.carsold.Domain.Entity.User.User;
//import org.gontar.carsold.Domain.Model.User.ContactInfoDto;
//import org.gontar.carsold.Repository.UserRepository;
//import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
//import org.gontar.carsold.Service.UserService.ContactInfoService.ContactInfoServiceImpl;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.when;
//
//@ExtendWith(MockitoExtension.class)
//public class ContactInfoServiceUnitTest {
//
//    @InjectMocks
//    private ContactInfoServiceImpl contactInfoService;
//
//    @Mock
//    private MyUserDetailsService userDetailsService;
//
//    @Mock
//    private UserRepository repository;
//
//    @Test
//    public void updateAndFetchContactPublic_updateAndFetch() {
//        User user = new User();
//        user.setContactPublic(false);
//        when(userDetailsService.loadUser()).thenReturn(user);
//
//        boolean isPublic = contactInfoService.updateAndFetchContactPublic(true);
//        assertTrue(isPublic, "Should change to true");
//    }
//
//    @Test
//    public void updateAndFetchContactPublic_onlyFetch() {
//        User user = new User();
//        user.setContactPublic(false);
//        when(userDetailsService.loadUser()).thenReturn(user);
//
//        boolean isPublic = contactInfoService.updateAndFetchContactPublic(null);
//        assertFalse(isPublic, "Should remain false");
//    }
//
//    @Test
//    public void fetchContactInfo() {
//        User user = new User();
//        user.setName("John");
//        user.setPhone("+48 603 604 605");
//        user.setCity("Poznań, Poland");
//        when(userDetailsService.loadUser()).thenReturn(user);
//
//        ContactInfoDto contactInfoDto = contactInfoService.fetchContactInfo();
//
//        assertEquals("John", contactInfoDto.getName());
//        assertEquals("+48 603 604 605", contactInfoDto.getPhone());
//        assertEquals("Poznań, Poland", contactInfoDto.getCity());
//    }
//}
