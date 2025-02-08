package org.gontar.carsold.Config.JwtConfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.gontar.carsold.Exception.CustomException.JwtServiceException;
import org.gontar.carsold.Service.CookieService.CookieService;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Configuration
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final MyUserDetailsService myUserDetailsService;
    private final CookieService cookieService;

    public JwtFilter(JwtService jwtService, MyUserDetailsService myUserDetailsService, CookieService cookieService) {
        this.jwtService = jwtService;
        this.myUserDetailsService = myUserDetailsService;
        this.cookieService = cookieService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        Optional<String> token = jwtService.extractTokenFromCookie(request);

        if (token.isPresent()) {
            try {
                String username = jwtService.extractUsername(token.get());

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
                    if (jwtService.validateToken(token.get(), userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (JwtServiceException | AuthenticationException e) {
                SecurityContextHolder.clearContext();
                ResponseCookie deleteCookie = cookieService.createCookie("", 0);
                response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
                throw new JwtServiceException("Problem in JWT filter: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}