package org.gontar.carsold.Service.CookieService;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {

    //creates cookie
    public ResponseCookie createCookie(String token, long time) {
        return ResponseCookie.from("JWT", token)
                .httpOnly(true)
                .secure(false)                                  //enabled only for production
                .path("/")
                .sameSite("Lax")                                //restricts cookies sending via cross-site requests
                .maxAge(Duration.ofHours(time))
                .build();
    }
}
