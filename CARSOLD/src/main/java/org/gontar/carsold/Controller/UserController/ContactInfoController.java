package org.gontar.carsold.Controller.UserController;

import org.gontar.carsold.Domain.Model.User.CitySuggestionsDto;
import org.gontar.carsold.Domain.Model.User.ContactInfoDto;
import org.gontar.carsold.Domain.Model.Universal.SingleBooleanDto;
import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
import org.gontar.carsold.Service.UserService.ContactInfoService.ContactInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactInfoController {

    private final ContactInfoService service;

    public ContactInfoController(ContactInfoService service) {
        this.service = service;
    }

    @PatchMapping("/private/userContactInfo/updateName")
    public ResponseEntity<?> updateName(@RequestBody SingleStringDto singleStringDto) {
        String name = singleStringDto.getValue();
        service.updateName(name);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/private/userContactInfo/updatePhone")
    public ResponseEntity<?> updatePhone(@RequestBody SingleStringDto singleStringDto) {
        String phone = singleStringDto.getValue();
        service.updatePhone(phone);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/private/userContactInfo/updateCity")
    public ResponseEntity<?> updateCity(@RequestBody SingleStringDto singleStringDto) {
        String city = singleStringDto.getValue();
        service.updateCity(city);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/private/userContactInfo/fetchCitySuggestions")
    public ResponseEntity<CitySuggestionsDto> fetchCitySuggestions(@RequestParam("value") String value) {
        CitySuggestionsDto response = service.fetchCitySuggestions(value);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/private/userContactInfo/updateAndFetchContactPublic")
    public ResponseEntity<SingleBooleanDto> updateAndFetchContactPublic(@RequestBody SingleBooleanDto singleBooleanDto) {
        Boolean isPublic = singleBooleanDto.getValue();
        boolean changedValue = service.updateAndFetchContactPublic(isPublic);
        SingleBooleanDto response = new SingleBooleanDto(changedValue);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/private/userContactInfo/fetch")
    public ResponseEntity<ContactInfoDto> fetchContactInfo() {
        ContactInfoDto response = service.fetchContactInfo();
        return ResponseEntity.ok(response);
    }
}
