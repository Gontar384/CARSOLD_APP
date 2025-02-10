package org.gontar.carsold.ServiceTest.UserServiceTest.InfoServiceTest;

import org.gontar.carsold.Domain.Entity.User.Role;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.UserInfoDto;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.UserService.InfoService.InfoServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class InfoServiceUnitTest {

    @InjectMocks
    private InfoServiceImpl infoService;

    @Mock
    private UserRepository repository;

    @Mock
    private MyUserDetailsService userDetailsService;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Test
    public void checkLogin_usernameExists() {
        when(repository.existsByUsername("testUser")).thenReturn(true);
        assertTrue(infoService.checkLogin("testUser"));
    }

    @Test
    public void checkLogin_usernameDoesNotExist() {
        when(repository.existsByUsername("testUser")).thenReturn(false);
        assertFalse(infoService.checkLogin("testUser"));
    }

    @Test
    public void checkLogin_emailExists() {
        when(repository.existsByEmail("test@example.com")).thenReturn(true);
        assertTrue(infoService.checkLogin("test@example.com"));
    }

    @Test
    public void checkLogin_emailDoesNotExist() {
        when(repository.existsByEmail("test@example.com")).thenReturn(false);
        assertFalse(infoService.checkLogin("test@example.com"));
    }

    @Test
    public void checkLogin_nullLogin() {
        assertFalse(infoService.checkLogin(null));
    }

    @Test
    public void checkInfo_userExists_username() {
        User user = new User();
        user.setActive(true);
        user.setOauth2(false);
        when(repository.findByUsername("testUser")).thenReturn(user);

        UserInfoDto userInfoDto = infoService.checkInfo("testUser");

        assertTrue(userInfoDto.getActive());
        assertFalse(userInfoDto.getOauth2());
    }

    @Test
    public void checkInfo_userExists_email() {
        User user = new User();
        user.setActive(false);
        user.setOauth2(true);
        when(repository.findByEmail("test@example.com")).thenReturn(user);

        UserInfoDto userInfoDto = infoService.checkInfo("test@example.com");

        assertFalse(userInfoDto.getActive());
        assertTrue(userInfoDto.getOauth2());
    }

    @Test
    public void checkInfo_userDoesNotExist() {
        when(repository.findByUsername("testUser")).thenReturn(null);

        UserInfoDto userInfoDto = infoService.checkInfo("testUser");

        assertFalse(userInfoDto.getActive());
        assertFalse(userInfoDto.getOauth2());
    }

    @Test
    public void checkInfo_nullLogin() {
        UserInfoDto userInfoDto = infoService.checkInfo(null);

        assertFalse(userInfoDto.getActive());
        assertFalse(userInfoDto.getOauth2());
    }

    @Test
    public void checkGoogleAuth_userIsOAuth2() {
        User user = new User();
        user.setOauth2(true);
        when(userDetailsService.loadUser()).thenReturn(user);

        assertTrue(infoService.checkGoogleAuth());
    }

    @Test
    public void checkGoogleAuth_userIsNotOAuth2() {
        User user = new User();
        user.setOauth2(false);
        when(userDetailsService.loadUser()).thenReturn(user);

        assertFalse(infoService.checkGoogleAuth());
    }

    @Test
    public void checkGoogleAuth_noUser() {
        when(userDetailsService.loadUser()).thenReturn(null);
        assertFalse(infoService.checkGoogleAuth());
    }

    @Test
    public void checkOldPassword_correctPassword() {
        User user = new User();
        user.setPassword("encodedPassword");
        when(userDetailsService.loadUser()).thenReturn(user);
        when(encoder.matches("correctPassword", "encodedPassword")).thenReturn(true);

        assertTrue(infoService.checkOldPassword("correctPassword"));
    }

    @Test
    public void checkOldPassword_incorrectPassword() {
        User user = new User();
        user.setPassword("encodedPassword");
        when(userDetailsService.loadUser()).thenReturn(user);
        when(encoder.matches("incorrectPassword", "encodedPassword")).thenReturn(false);

        assertFalse(infoService.checkOldPassword("incorrectPassword"));
    }

    @Test
    public void checkOldPassword_noUser() {
        when(userDetailsService.loadUser()).thenReturn(null);
        assertFalse(infoService.checkOldPassword("any_password"));
    }

    @Test
    public void checkAdmin_userIsAdmin() {
        User user = new User();
        user.setRole(Role.ADMIN);
        when(userDetailsService.loadUser()).thenReturn(user);

        assertTrue(infoService.checkAdmin());
    }

    @Test
    public void checkAdmin_userIsNotAdmin() {
        User user = new User();
        user.setRole(Role.USER);
        when(userDetailsService.loadUser()).thenReturn(user);

        assertFalse(infoService.checkAdmin());
    }

    @Test
    public void checkAdmin_noUser() {
        when(userDetailsService.loadUser()).thenReturn(null);
        assertFalse(infoService.checkAdmin());
    }
}
