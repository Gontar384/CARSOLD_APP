package org.gontar.carsold.Service;

import io.jsonwebtoken.Claims;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gontar.carsold.Config.JwtConfig.JwtService;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Model.UserDto;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final UserRepository repository;
    private final Mapper<User, UserDto> mapper;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender emailSender;
    private final UserDetailsService userDetailsService;

    public UserServiceImpl(UserRepository repository, Mapper<User, UserDto> mapper,
                           BCryptPasswordEncoder encoder, JwtService jwtService, AuthenticationManager authenticationManager,
                           JavaMailSender emailSender, UserDetailsService userDetailsService) {
        this.repository = repository;
        this.mapper = mapper;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailSender = emailSender;
        this.userDetailsService = userDetailsService;
    }

    //checks if username exists
    @Override
    public boolean findUsername(String username) {
        return repository.existsByUsername(username);
    }

    //checks if email exists
    @Override
    public boolean findEmail(String email) {
        return repository.existsByEmail(email);
    }

    // saving user to DB
    // generating token using jwtService
    // sending account activating token link via email
    @Override
    public void registerUser(UserDto userDto) {
        User existingEmail = repository.findByEmail(userDto.getEmail());
        User existingUsername = repository.findByUsername(userDto.getUsername());
        User user;
        if (existingEmail != null && !existingEmail.getActive()) {
            user = existingEmail;
            user.setUsername(userDto.getUsername());
            user.setPassword(encoder.encode(userDto.getPassword()));
            user.setActive(false);
            user.setOauth2User(false);
        } else if (existingUsername != null && !existingUsername.getActive()) {
            user = existingUsername;
            user.setEmail(userDto.getEmail());
            user.setPassword(encoder.encode(userDto.getPassword()));
            user.setActive(false);
            user.setOauth2User(false);
        } else {
            user = mapper.mapToEntity(userDto);
            user.setEmail(userDto.getEmail());
            user.setUsername(userDto.getUsername());
            user.setPassword(encoder.encode(userDto.getPassword()));
            user.setActive(false);
            user.setOauth2User(false);
        }
        repository.save(user);

        String token = jwtService.generateToken(user.getUsername());
        String link = frontendUrl + "activate?token=" + token;
        sendVerificationEmail(user.getEmail(), link);
    }

    //creating email message
    @Override
    public void sendVerificationEmail(String email, String link) {
        User user = repository.findByEmail(email);
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("CAR$OLD Account Activation");

            String emailContent = "<p style='font-size: 25px;'>Thank you for registering " + user.getUsername() + "! To activate your account, please click here:</p>" +
                    "<div style='background-color: #6bfd17; width: 407px; padding: 0px 20px; border: 2px solid gray; border-radius: 10px;'>" +
                    "<a style='text-decoration: none; color: black; font-size: 50px; font-weight: bold;' href=\"" + link + "\">" +
                    "Activate Account" +
                    "</a>" +
                    "</div>" +
                    "<p>If link expired - register again.<br><br><hr>" +
                    "<p>This message was sent automatically. Do not reply.</p>";

            helper.setText(emailContent, true);

            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    //activating account after clicking link with token
    @Override
    public void activateAccount(String token, HttpServletResponse response) {
        try {
            Claims claims = jwtService.extractAllClaims(token);    //gets info about user and token
            String username = claims.getSubject();                 //gets username from claims
            User user = repository.findByUsername(username);

            if (!user.getActive()) {                               //activates account
                user.setActive(true);
                repository.save(user);
            }

            String newToken = jwtService.generateToken(user.getUsername());    //generates new token for authenticated session
            ResponseCookie authCookie = createCookie(newToken, 5);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());   //adds cookie to response
        } catch (Exception e) {
            System.err.println("Failed to activate account: " + e.getMessage());
        }
    }

    @Override
    public boolean checkAuthentication(HttpServletRequest request) {
        String jwt = jwtService.extractTokenFromCookie(request);
        if (jwt == null) {
            return false; // No token found
        }
        String username = jwtService.extractUsername(jwt);
        if (username == null) {
            return false; // Username not found in token
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtService.validateToken(jwt, userDetails);
    }

    @Override
    public void logout(HttpServletResponse response) {
        ResponseCookie deleteCookie = createCookie("", 0);
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }

    @Override
    public boolean checkActive(String login) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        if (user != null) {
            return user.getActive();
        }
        return false;
    }

    @Override
    public boolean checkOauth2(String login) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        if (user != null) {
            return user.getOauth2User();
        }
        return false;
    }

    @Override
    public void authenticate(String login, String password, HttpServletResponse response) {
        User user;
        if (login.contains("@")) {
            user = repository.findByEmail(login);
        } else {
            user = repository.findByUsername(login);
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), password));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getUsername());    //generates new token for authenticated session
            ResponseCookie authCookie = createCookie(token, 15);
            response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());
        }
    }

    //creates cookie
    private ResponseCookie createCookie(String token, long time) {
        return ResponseCookie.from("JWT", token)    //creates new cookie with name "authToken"
                .httpOnly(true)                                 //cannot be accessed via JavaScript
                .secure(false)                                  //enabled only for production
                .path("/")                                      //can be sent to any endpoint
                .sameSite("Lax")                                //restricts cookies sending via cross-site requests
                .maxAge(Duration.ofMinutes(time))                 //lasts 5 hours
                .build();
    }
}

