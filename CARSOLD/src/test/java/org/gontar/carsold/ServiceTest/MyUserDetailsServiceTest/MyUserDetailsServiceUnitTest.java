package org.gontar.carsold.ServiceTest.MyUserDetailsServiceTest;

import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Exception.CustomException.UserDetailsException;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MyUserDetailsServiceUnitTest {

    @InjectMocks
    private MyUserDetailsService userDetailsService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private UserRepository repository;

    @BeforeEach
    public void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        User user = mock(User.class);
        when(repository.findByUsername("testUser")).thenReturn(user);

        UserPrincipal userDetails = (UserPrincipal) userDetailsService.loadUserByUsername("testUser");

        assertNotNull(userDetails);
        assertEquals(user, userDetails.user());
    }

    @Test
    public void loadUserByUsername_shouldThrowException_whenUserNotFound() {
        when(repository.findByUsername("unknownUser")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("unknownUser"),
                "User not found");
    }

    @Test
    public void loadUser_shouldThrowException_whenAuthenticationIsNull() {
        when(securityContext.getAuthentication()).thenReturn(null);
        assertThrows(UserDetailsException.class, () -> userDetailsService.loadUser(), "User is not authenticated");
    }

    @Test
    public void loadUser_shouldThrowException_whenUserIsNotAuthenticated() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(false);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        assertThrows(UserDetailsException.class, () -> userDetailsService.loadUser(), "User is not authenticated");
    }

    @Test
    public void loadUser_shouldReturnUser_whenUserIsAuthenticated() {
        User user = mock(User.class);
        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
        when(securityContext.getAuthentication()).thenReturn(authentication);

        assertEquals(user, userDetailsService.loadUser());
    }

    @Test
    public void loadUser_shouldThrowException_whenUserPrincipalIsNull() {
        Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(new UserPrincipal(null));
        when(securityContext.getAuthentication()).thenReturn(authentication);

        assertThrows(UserDetailsException.class, () -> userDetailsService.loadUser(), "User not found");
    }

    private void authenticateOAuth2User() {
        OAuth2AuthenticationToken oauth2Token = mock(OAuth2AuthenticationToken.class);
        OAuth2User oauth2User = mock(OAuth2User.class);
        when(oauth2Token.isAuthenticated()).thenReturn(true);
        when(oauth2Token.getPrincipal()).thenReturn(oauth2User);
        when(oauth2User.getAttributes()).thenReturn(Map.of("email", "test@example.com"));
        when(securityContext.getAuthentication()).thenReturn(oauth2Token);
    }

    @Test
    public void loadUser_shouldReturnUser_whenOAuth2UserIsAuthenticated() {
        authenticateOAuth2User();
        User user = mock(User.class);
        when(repository.findByEmail("test@example.com")).thenReturn(user);

        assertEquals(user, userDetailsService.loadUser());
    }

    @Test
    public void loadUser_shouldThrowException_whenOAuth2UserNotFound() {
        authenticateOAuth2User();
        when(repository.findByEmail("test@example.com")).thenReturn(null);

        assertThrows(UserDetailsException.class, () -> userDetailsService.loadUser(), "Google user not found");
    }

    @Test
    public void loadUser_shouldThrowException_whenAuthenticationTypeIsUnknown() {
        Authentication unknownAuth = mock(Authentication.class);
        when(unknownAuth.isAuthenticated()).thenReturn(true);
        when(securityContext.getAuthentication()).thenReturn(unknownAuth);

        assertThrows(UserDetailsException.class, () -> userDetailsService.loadUser(), "Couldn't load user");
    }
}
