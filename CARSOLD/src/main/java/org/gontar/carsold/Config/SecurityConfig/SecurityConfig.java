package org.gontar.carsold.Config.SecurityConfig;

import org.gontar.carsold.Config.JwtConfig.JwtFilter;
import org.gontar.carsold.Config.OAuth2Config.CustomAuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final JwtFilter jwtFilter;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    public SecurityConfig(JwtFilter jwtFilter,
                          CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler) {

        this.jwtFilter = jwtFilter;
        this.customAuthenticationSuccessHandler = customAuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {   //configures security filter chain
        return http
                .csrf(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request  //configures authorization for incoming requests
                        .requestMatchers(                              //path available for authenticated users
                                "api/auth/csrf",
                                "api/auth/check-authentication",
                                "api/auth/register/check-email",
                                "api/auth/register/check-username",
                                "api/auth/register",
                                "api/auth/activate",
                                "api/auth/check-active",
                                "api/auth/check-oauth2",
                                "api/auth/login",
                                "api/auth/logout", //this one shouldn't be there, but has to, to clear JWT if user isn't authenticated or any error occurs
                                "api/auth/keep-alive",
                                "api/auth/validate-user",
                                "api/auth/password-recovery",
                                "api/auth/password-recovery-change"
                                ).permitAll()
                        .anyRequest().authenticated())     //for any other endpoints authentication required
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))  //configures CORS (Cross-Origin Resource Sharing) to allow requests from specified origins
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)  //adds jwtFilter before UsernamePasswordAuthenticationFilter, allows it to process JWTs before standard authentication
                .oauth2Login(oath2 -> {                                        //oauth2 configuration
                    oath2.successHandler(customAuthenticationSuccessHandler);  //custom handler for oauth2 logins
                })
                .build();
    }

    //cors settings configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of(frontendUrl));          //origins that can make requests
        corsConfiguration.setAllowedMethods(List.of("*"));               //allowed methods
        corsConfiguration.setAllowedHeaders(List.of("*"));               //allowed request headers
        corsConfiguration.setAllowCredentials(true);                        //allowed cookies
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);   //cors configuration for all routes
        return source;
    }

    //handle requests authentication
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    //password encoder
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}