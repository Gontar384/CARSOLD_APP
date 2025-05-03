package org.gontar.carsold.Service.MyUserDetailsService;

import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
import org.gontar.carsold.Exception.CustomException.UserDetailsException;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    public MyUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = repository.findByUsername(username);
        if (user == null) throw new UsernameNotFoundException("User not found");

        return new UserPrincipal(user);
    }

    public User loadUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserDetailsException("User is not authenticated");
        }

        if (authentication.getPrincipal() instanceof UserPrincipal(User user)) {
            if (user == null || !repository.existsById(user.getId())) throw new UserDetailsException("User not found");

            return user;
        } else if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            String email = (String) oauth2Token.getPrincipal().getAttributes().get("email");
            User user = repository.findByEmail(email);
            if (user == null) throw new UserDetailsException("Google user not found");

            return user;
        }
        throw new UserDetailsException("Couldn't load user");
    }
}