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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    public SecurityConfig(JwtFilter jwtFilter, CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler) {

        this.jwtFilter = jwtFilter;
        this.customAuthenticationSuccessHandler = customAuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {   //configures security filter chain

        return http
                .csrf(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request
                        .requestMatchers(                              //paths available for authenticated users
                                "/api/auth/csrf",
                                "/api/auth/check-authentication",
                                "/api/auth/register/check-email",
                                "/api/auth/register/check-username",
                                "/api/auth/register/is-username-safe",
                                "/api/auth/register",
                                "/api/auth/activate",
                                "/api/auth/check-active",
                                "/api/auth/check-oauth2",
                                "/api/auth/login",
                                "/api/auth/logout", //this one has to be there to clear JWT if user isn't authenticated or any error occurs
                                "/api/auth/keep-alive",
                                "/api/auth/validate-user",
                                "/api/auth/password-recovery",
                                "/api/auth/password-recovery-change"
                        ).permitAll()
                        .anyRequest().authenticated())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))  //configures CORS (Cross-Origin Resource Sharing)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)  //adds jwtFilter before UsernamePasswordAuthenticationFilter, allows it to process JWTs before standard authentication
                .oauth2Login(oath2 -> {
                    oath2.successHandler(customAuthenticationSuccessHandler);  //custom handler for oauth2 auth
                })
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS) //always creates new session
                )
                .build();
    }

    //cors settings configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of(frontendUrl));
        corsConfiguration.setAllowedMethods(List.of("*"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
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