package org.gontar.carsold.Service.UserService.UserContactInfoService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

public interface UserContactInfoService {
    boolean changeName(String name, HttpServletRequest request);
    boolean changePhone(String phone, HttpServletRequest request);
    boolean changeCity(String address, HttpServletRequest request);
    List<String> fetchCitySuggestions(String value);
    boolean changeContactInfoPublic(HttpServletRequest request, boolean isPublic);
    boolean fetchContactInfoPublic(HttpServletRequest request);
    Map<String, String> fetchInfo(HttpServletRequest request);
}
