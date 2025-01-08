package org.gontar.carsold.ServiceTest.UserGetInfoServiceTest;

import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.UserService.UserGetInfoService.UserGetInfoServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserGetInfoServiceUnitTest {

    @Mock
    private UserRepository repo;

    @InjectMocks
    private UserGetInfoServiceImpl service;

    @Test
    public void testEmailExists() {
        String testEmail = "test@gmail.com";
        when(repo.existsByEmail(testEmail)).thenReturn(true);
        assertTrue(service.findEmail(testEmail), "Should return true, email exists");
        verify(repo).existsByEmail(testEmail);
    }

    @Test
    public void testEmailDoesNotExist() {
        String testEmail = "test@gmail.com";
        when(repo.existsByEmail(testEmail)).thenReturn(false);
        assertFalse(service.findEmail(testEmail), "Should return false, email doesn't exist");
        verify(repo).existsByEmail(testEmail);
    }

    @Test
    public void testUsernameExists() {
        String testUsername = "testUsername";
        when(repo.existsByUsername(testUsername)).thenReturn(true);
        assertTrue(service.findUsername(testUsername), "Should return true, username exists");
        verify(repo).existsByUsername(testUsername);
    }

    @Test
    public void testUsernameDoesNotExist() {
        String testUsername = "testUsername";
        when(repo.existsByUsername(testUsername)).thenReturn(false);
        assertFalse(service.findUsername(testUsername), "Should return false, username doesn't exist");
        verify(repo).existsByUsername(testUsername);
    }

    @Test
    public void testCheckIfUsernameSafe_withInappropriateUsername() {
        assertFalse(service.checkIfUsernameSafe("testCwel"), "Should return false, username is inappropriate");
    }
}
