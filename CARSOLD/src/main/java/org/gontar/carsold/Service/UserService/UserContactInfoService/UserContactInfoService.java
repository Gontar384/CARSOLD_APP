package org.gontar.carsold.Service.UserService.UserContactInfoService;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.Dto.CitySuggestionsDto;
import org.gontar.carsold.Model.Dto.ContactInfoDto;

import java.util.List;
import java.util.Map;

public interface UserContactInfoService {
    void updateName(String name, HttpServletRequest request);
    void updatePhone(String phone, HttpServletRequest request);
    void updateCity(String city, HttpServletRequest request);
    CitySuggestionsDto fetchCitySuggestions(String value);
    boolean updateAndFetchContactPublic(Boolean isPublic, HttpServletRequest request);
    ContactInfoDto fetchContactInfo(HttpServletRequest request);
}
