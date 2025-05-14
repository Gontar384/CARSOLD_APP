//package org.gontar.carsold.ServiceTest.UserServiceTest.ProfilePicServiceTest;
//
//import org.gontar.carsold.Domain.Entity.User.User;
//import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
//import org.gontar.carsold.Service.UserService.ProfilePicService.ProfilePicServiceImpl;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNull;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class ProfilePicServiceUnitTest {
//
//    @InjectMocks
//    private ProfilePicServiceImpl profilePicService;
//
//    @Mock
//    private MyUserDetailsService userDetailsService;
//
//    @Test
//    public void fetchProfilePic() {
//        User mockUser = new User();
//        String testLink = "user.profilePic/exampleTestUrl.jpg";
//        mockUser.setProfilePic(testLink);
//        when(userDetailsService.loadUser()).thenReturn(mockUser);
//
//        String result = profilePicService.fetchProfilePic();
//
//        assertEquals(testLink, result);
//    }
//
//    @Test
//    public void fetchProfilePic_noProfilePic() {
//        User mockUser = new User();
//        mockUser.setProfilePic(null);
//        when(userDetailsService.loadUser()).thenReturn(mockUser);
//
//        String result = profilePicService.fetchProfilePic();
//
//        assertNull(result);
//    }
//}