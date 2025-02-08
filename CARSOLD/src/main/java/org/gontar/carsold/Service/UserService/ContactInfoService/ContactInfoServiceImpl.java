package org.gontar.carsold.Service.UserService.ContactInfoService;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import org.gontar.carsold.Exception.CustomException.ExternalCheckException;
import org.gontar.carsold.Exception.CustomException.InvalidValueException;
import org.gontar.carsold.Domain.Model.CitySuggestionsDto;
import org.gontar.carsold.Domain.Model.ContactInfoDto;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Service
public class ContactInfoServiceImpl implements ContactInfoService {

    @Value("${PLACES_API_KEY}")
    private String placesApiKey;

    @Value("${CLOUD_NATURAL_LANGUAGE_API_KEY}")
    private String cloudNaturalLanguageApiKey;

    private final UserRepository repository;
    private final MyUserDetailsService userDetailsService;

    public ContactInfoServiceImpl(UserRepository repository, MyUserDetailsService userDetailsService) {
        this.repository = repository;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void updateName(String name) {
        User user = userDetailsService.loadUser();
        if (name == null || name.isBlank()) {
            user.setName(null);
            repository.save(user);
        } else if (isPolishName(name) || isValidName(name)) {
            user.setName(name);
            repository.save(user);
        } else {
            throw new InvalidValueException("Invalid name");
        }
    }

    private boolean isPolishName(String name) {
        List<String> polishSpecificNames = Arrays.asList(
                //male
                "Łukasz", "Wojciech", "Krzysztof", "Tomasz", "Jerzy", "Mieczysław", "Zbigniew", "Andrzej",
                "Piotr", "Janusz", "Ryszard", "Sławomir", "Tadeusz", "Bolesław", "Kazimierz", "Mariusz",
                "Czesław", "Leszek", "Stanislaw", "Marek", "Wacław", "Radosław", "Artur", "Zdzisław",
                "Jarosław", "Bogdan", "Grzegorz", "Adam", "Dariusz", "Marcin", "Jacek", "Rafał", "Patryk",
                "Mariusz", "Wojtek", "Zygmunt", "Marian", "Kamil", "Albert", "Dominik", "Krzysztof", "Marek",
                "Feliks", "Kornel", "Sebastian", "Roman", "Michał", "Alojzy", "Jerzy", "Seweryn", "Łukasz",
                //female
                "Żaneta", "Jolanta", "Grażyna", "Bożena", "Stefania", "Wanda", "Irena", "Halina", "Cecylia",
                "Eugenia", "Teresa", "Aneta", "Danuta", "Zofia", "Alicja", "Barbara", "Joanna", "Katarzyna",
                "Magdalena", "Anna", "Maria", "Małgorzata", "Elżbieta", "Karolina", "Monika", "Ewa", "Hanna",
                "Zdzisława", "Jadwiga", "Patrycja", "Ewa", "Lidia", "Kamila", "Kinga", "Dominika", "Urszula",
                "Justyna", "Aleksandra", "Renata", "Izabela", "Bożena", "Krzysztofka", "Lucyna", "Wioletta",
                "Tereska", "Barbara", "Weronika", "Krystyna", "Malwina", "Elżbieta", "Wiesława", "Dagmara",
                "Joanna", "Zuzanna", "Honorata", "Beata", "Marta", "Liliana", "Monika", "Małgorzata", "Anita"
        );
        return polishSpecificNames.contains(name);
    }

    private boolean isValidName(String name) {
        try {
            String apiUrl = "https://language.googleapis.com/v1/documents:analyzeEntities?key=" + cloudNaturalLanguageApiKey;

            JSONObject document = new JSONObject();
            document.put("content", name);
            document.put("type", "PLAIN_TEXT");

            JSONObject requestPayload = new JSONObject();
            requestPayload.put("document", document);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestPayload.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

            JSONObject responseJson = new JSONObject(Objects.requireNonNull(responseEntity.getBody()));
            for (Object entityObj : responseJson.getJSONArray("entities")) {
                JSONObject entity = (JSONObject) entityObj;
                String entityType = entity.getString("type");
                if ("PERSON".equals(entityType)) return true;
            }
            return false;
        } catch (Exception e) {
            throw new ExternalCheckException("Error checking name by Natural Language API: " + e.getMessage());
        }
    }

    @Override
    public void updatePhone(String phone) {
        User user = userDetailsService.loadUser();
        try {
            if (phone == null || phone.isBlank()) {
                user.setPhone(null);
                repository.save(user);
            } else {
                if (!phone.startsWith("+")) phone = "+48" + phone;

                PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();
                Phonenumber.PhoneNumber phoneNumber = phoneNumberUtil.parse(phone, "");

                if (!phoneNumberUtil.isValidNumber(phoneNumber))
                    throw new InvalidValueException("Invalid phone number");

                String formattedPhoneNumber = phoneNumberUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);

                user.setPhone(formattedPhoneNumber);
                repository.save(user);
            }
        } catch (NumberParseException e) {
            throw new IllegalStateException("Problem with parsing phone number: " + e.getMessage());
        }
    }

    @Override
    public void updateCity(String city) {
        User user = userDetailsService.loadUser();
        if (city == null || city.isBlank()) {
            user.setCity(null);
            repository.save(user);
        } else if (isCityValid(city)) {
            user.setCity(city);
            repository.save(user);
        } else {
            throw new InvalidValueException("Invalid city");
        }
    }

    private boolean isCityValid(String city) {
        JSONArray predictions = fetchCitySuggestionsFromApi(city);

        for (int i = 0; i < predictions.length(); i++) {
            JSONObject prediction = predictions.getJSONObject(i);
            String description = prediction.getString("description");

            if (description != null && (description.equals(city) || description.split(",")[0].trim().equals(city))) {
                return true;
            }
        }
        return false;
    }

    private JSONArray fetchCitySuggestionsFromApi(String input) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/place/autocomplete/json")
                    .queryParam("input", input)
                    .queryParam("key", placesApiKey)
                    .queryParam("types", "(cities)")
                    .queryParam("location", "52.13,19.39")
                    .queryParam("radius", "1000000")
                    .queryParam("strictbounds", "false")
                    .build()
                    .toString();

            String response = restTemplate.getForObject(url, String.class);
            assert response != null;
            JSONObject jsonResponse = new JSONObject(response);

            return jsonResponse.getJSONArray("predictions");
        } catch (Exception e) {
            throw new ExternalCheckException("Error fetching city suggestions with Places API: " + e.getMessage());
        }
    }

    @Override
    public CitySuggestionsDto fetchCitySuggestions(String value) {
        JSONArray predictions = fetchCitySuggestionsFromApi(value);

        List<String> cityNames = new ArrayList<>();
        for (int i = 0; i < predictions.length(); i++) {
            JSONObject prediction = predictions.getJSONObject(i);
            cityNames.add(prediction.getString("description"));
        }

        return new CitySuggestionsDto(cityNames);
    }

    @Override
    public boolean updateAndFetchContactPublic(Boolean isPublic) {
        User user = userDetailsService.loadUser();
        if (isPublic != null) {
            user.setContactPublic(isPublic);
            repository.save(user);
        }

        return user.getContactPublic();
    }

    @Override
    public ContactInfoDto fetchContactInfo() {
        User user = userDetailsService.loadUser();

        ContactInfoDto contactInfoDto = new ContactInfoDto();
        contactInfoDto.setName(user.getName());
        contactInfoDto.setPhone(user.getPhone());
        contactInfoDto.setCity(user.getCity());

        return contactInfoDto;
    }
}
