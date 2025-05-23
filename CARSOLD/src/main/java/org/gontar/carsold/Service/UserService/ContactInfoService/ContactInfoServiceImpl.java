package org.gontar.carsold.Service.UserService.ContactInfoService;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import org.gontar.carsold.Exception.CustomException.ExternalCheckException;
import org.gontar.carsold.Exception.CustomException.InvalidValueException;
import org.gontar.carsold.Domain.Model.User.CitySuggestionsDto;
import org.gontar.carsold.Domain.Model.User.ContactInfoDto;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    public JSONArray fetchCitySuggestionsFromApi(String input) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://places.googleapis.com/v1/places:autocomplete";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Goog-Api-Key", placesApiKey);

            String requestBody = String.format("{\"input\": \"%s\", \"includedPrimaryTypes\": [\"locality\"]}", input);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            JSONObject jsonResponse = new JSONObject(Objects.requireNonNull(response.getBody()));

            if (jsonResponse.has("suggestions")) return jsonResponse.getJSONArray("suggestions");
            else return new JSONArray();
        } catch (Exception e) {
            throw new ExternalCheckException("Error fetching city suggestions with Places API v2: " + e.getMessage());
        }
    }

    @Override
    public CitySuggestionsDto fetchCitySuggestions(String value) {
        JSONArray predictions = fetchCitySuggestionsFromApi(value);
        List<String> cityNames = formatData(predictions);

        return new CitySuggestionsDto(cityNames);
    }

    private List<String> formatData(JSONArray predictions) {
        List<Map<String, String>> cityInfoList = new ArrayList<>();
        for (int i = 0; i < predictions.length(); i++) {
            JSONObject prediction = predictions.getJSONObject(i);
            JSONObject placePrediction = prediction.getJSONObject("placePrediction");
            JSONObject structuredFormat = placePrediction.getJSONObject("structuredFormat");
            JSONObject mainText = structuredFormat.getJSONObject("mainText");
            JSONObject secondaryText = structuredFormat.getJSONObject("secondaryText");
            String cityName = mainText.getString("text");
            String secondaryInfo = secondaryText.getString("text");
            Map<String, String> cityInfo = new HashMap<>();
            cityInfo.put("city", cityName);
            cityInfo.put("secondaryInfo", secondaryInfo);
            cityInfoList.add(cityInfo);
        }
        List<String> cityNames = new ArrayList<>();
        for(Map<String, String> cityInfo : cityInfoList){
            cityNames.add(cityInfo.get("city") + ", " + cityInfo.get("secondaryInfo"));
        }
        return cityNames;
    }

    private boolean isCityValid(String city) {
        JSONArray predictions = fetchCitySuggestionsFromApi(city);
        List<String> cityNames = formatData(predictions);
        return cityNames.contains(city);
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
