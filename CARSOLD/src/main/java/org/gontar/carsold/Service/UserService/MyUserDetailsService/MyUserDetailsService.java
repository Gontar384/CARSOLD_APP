package org.gontar.carsold.Service.UserService.MyUserDetailsService;

import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserPrincipal;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//converts user data to UserDetails object, used in authentication and authorization
@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    public MyUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByUsername(username);
        if (user == null) throw new UsernameNotFoundException("User not found");
        return new UserPrincipal(user);
    }
}