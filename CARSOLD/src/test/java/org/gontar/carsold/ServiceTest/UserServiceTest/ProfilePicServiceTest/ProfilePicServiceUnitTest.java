package org.gontar.carsold.ServiceTest.UserServiceTest.ProfilePicServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.ProfilePicService.ProfilePicServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProfilePicServiceUnitTest {

    @Mock
    private UserRepository repo;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private ProfilePicServiceImpl service;

    @Test
    public void testGetProfilePic_success() {
        User mockUser = new User();
        String testLink = "user.profilePic/exampleTestUrl.jpg";
        mockUser.setProfilePic(testLink);
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockUser);

        String result = service.getProfilePic(request);

        assertEquals(testLink, result);
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testGetProfilePic_success_noProfilePic() {
        User mockUser = new User();
        mockUser.setProfilePic(null);
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockUser);

        String result = service.getProfilePic(request);

        assertNull(result);
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testGetProfilePic_failure_problemWithRequest() {
        when(jwtService.extractUserFromRequest(request)).thenReturn(null);

        String result = service.getProfilePic(request);

        assertNull(result);
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }
}
