package org.gontar.carsold.Controller.UserController.UserContactInfoController;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.Dto.CitySuggestionsDto;
import org.gontar.carsold.Model.Dto.ContactInfoDto;
import org.gontar.carsold.Model.Dto.SingleBooleanDto;
import org.gontar.carsold.Model.Dto.SingleStringDto;
import org.gontar.carsold.Service.UserService.UserContactInfoService.UserContactInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserContactInfoController {

    private final UserContactInfoService service;

    public UserContactInfoController(UserContactInfoService service) {
        this.service = service;
    }

    @PutMapping("/updateName")
    public ResponseEntity<?> updateName(@RequestBody SingleStringDto singleStringDto, HttpServletRequest request) {
        String name = singleStringDto.getValue();
        service.updateName(name, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updatePhone")
    public ResponseEntity<?> updatePhone(@RequestBody SingleStringDto singleStringDto, HttpServletRequest request) {
        String phone = singleStringDto.getValue();
        service.updatePhone(phone, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateCity")
    public ResponseEntity<?> updateCity(@RequestBody SingleStringDto singleStringDto, HttpServletRequest request) {
        String city = singleStringDto.getValue();
        service.updateCity(city, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetchCitySuggestions")
    public ResponseEntity<CitySuggestionsDto> fetchCitySuggestions(@RequestParam("value") String value) {
        CitySuggestionsDto response = service.fetchCitySuggestions(value);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateAndFetchContactPublic")
    public ResponseEntity<SingleBooleanDto> updateAndFetchContactPublic(@RequestBody SingleBooleanDto singleBooleanDto, HttpServletRequest request) {
        Boolean isPublic = singleBooleanDto.getValue();
        boolean changedValue = service.updateAndFetchContactPublic(isPublic, request);
        SingleBooleanDto response = new SingleBooleanDto(changedValue);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fetchContactInfo")
    public ResponseEntity<ContactInfoDto> fetchContactInfo(HttpServletRequest request) {
        ContactInfoDto response = service.fetchContactInfo(request);
        return ResponseEntity.ok(response);
    }
}
