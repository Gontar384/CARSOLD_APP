package org.gontar.carsold.Config.JwtConfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.gontar.carsold.Service.MyUserDetailsService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

        String token = jwtService.extractTokenFromCookie(request);
        String username = null;

        //if there are errors with token, clears token-cookie, makes user unauthenticated, then frontend logs him out
        if (token != null) {
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                clearJwtCookie(response);
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                return;
            }
        }

        //authenticate user
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    //deletes jwt cookie
    private void clearJwtCookie(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE,
                "JWT=; Max-Age=0; path=/; HttpOnly; SameSite=Lax; Secure=false");
    }
}