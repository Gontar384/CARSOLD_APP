package org.gontar.carsold.Config.JwtConfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.gontar.carsold.Service.MyUserDetailsService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//validates token, extracts username, loads UserPrincipal via MyUserDetailsService
//and sets it in SecurityContextHolder
@Configuration
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    ApplicationContext context;

    public JwtFilter(JwtService jwtService, ApplicationContext context) {
        this.jwtService = jwtService;
        this.context = context;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");     //get the header
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {    //if request is valid
            token = authHeader.substring(7);                   //saves token
            username = jwtService.extractUsername(token);                //and username using jwtService
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {      //if username valid and no current authentication
            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);    //loads user details to retrieve roles and permissions
            if (jwtService.validateToken(token, userDetails)) {        //validating token with user details
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource()   //creates new token
                        .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);  //making request authenticated
            }
        }
        filterChain.doFilter(request, response);   //passes request and response
    }

}