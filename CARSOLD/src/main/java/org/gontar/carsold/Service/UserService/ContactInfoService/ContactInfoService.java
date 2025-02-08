package org.gontar.carsold.Service.UserService.ContactInfoService;

import org.gontar.carsold.Domain.Model.CitySuggestionsDto;
import org.gontar.carsold.Domain.Model.ContactInfoDto;

public interface ContactInfoService {
    void updateName(String name);
    void updatePhone(String phone);
    void updateCity(String city);
    CitySuggestionsDto fetchCitySuggestions(String value);
    boolean updateAndFetchContactPublic(Boolean isPublic);
    ContactInfoDto fetchContactInfo();
}
