package org.gontar.carsold.Service.UserService.UserContactInfoService;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.ErrorsAndExceptions.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
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
public class UserContactInfoServiceImpl implements UserContactInfoService {

    @Value("${PLACES_API_KEY}")
    private String placesApiKey;

    @Value("${CLOUD_NATURAL_LANGUAGE_API_KEY}")
    private String cloudNaturalLanguageApiKey;

    private final UserRepository repository;
    private final JwtService jwtService;
    private final ErrorHandler errorHandler;

    public UserContactInfoServiceImpl(UserRepository repository, JwtService jwtService, ErrorHandler errorHandler) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.errorHandler = errorHandler;
    }

    //updates contact name, checks if name is proper name
    @Override
    public boolean changeName(String name, HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user != null) {
                if (isPolishName(name) || isValidName(name)) {
                    user.setName(name);
                    repository.save(user);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error changing name: " + e.getMessage());
        }
    }

    //checks if name contains polish name
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

    //checks if name is proper by sending to api
    private boolean isValidName(String name) {
        try {
            String apiUrl = "https://language.googleapis.com/v1/documents:analyzeEntities?key=" + cloudNaturalLanguageApiKey;

            //creates payload
            JSONObject document = new JSONObject();
            document.put("content", name);
            document.put("type", "PLAIN_TEXT");

            JSONObject requestPayload = new JSONObject();
            requestPayload.put("document", document);

            //crates headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            //sets up and sends request
            HttpEntity<String> requestEntity = new HttpEntity<>(requestPayload.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

            //parses response
            JSONObject responseJson = new JSONObject(Objects.requireNonNull(responseEntity.getBody()));
            for (Object entityObj : responseJson.getJSONArray("entities")) {
                JSONObject entity = (JSONObject) entityObj;
                String entityType = entity.getString("type");
                if ("PERSON".equals(entityType)) return true;
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error checking name validity: " + e.getMessage());
        }
    }

    //updates contact phone, checks if number is proper
    @Override
    public boolean changePhone(String phone, HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user == null) return false;

            if (!phone.startsWith("+")) phone = "+48" + phone;

            PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();
            Phonenumber.PhoneNumber phoneNumber = phoneNumberUtil.parse(phone, "");

            //checks if valid
            if (!phoneNumberUtil.isValidNumber(phoneNumber)) return false;

            //formats phone
            String formattedPhoneNumber = phoneNumberUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);

            user.setPhone(formattedPhoneNumber);
            repository.save(user);

            return true;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error changing phone number: " + e.getMessage());
        }
    }

    //updates contact city
    @Override
    public boolean changeCity(String city, HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user != null) {
                if (isCityValid(city)) {
                    user.setCity(city);
                    repository.save(user);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error changing city: " + e.getMessage());
        }
    }

    //checks if city is valid by comparing it against suggestions
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

    //fetches city suggestions from Places API
    @Override
    public List<String> fetchCitySuggestions(String value) {
        JSONArray predictions = fetchCitySuggestionsFromApi(value);

        List<String> cityNames = new ArrayList<>();
        for (int i = 0; i < predictions.length(); i++) {
            JSONObject prediction = predictions.getJSONObject(i);
            cityNames.add(prediction.getString("description"));
        }

        return cityNames;
    }

    //helper method to fetch city suggestions from Places API
    private JSONArray fetchCitySuggestionsFromApi(String input) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/place/autocomplete/json")
                    .queryParam("input", input)
                    .queryParam("key", placesApiKey)
                    .queryParam("types", "(cities)")
                    .queryParam("location", "52.13,19.39")
                    .queryParam("radius", "500000")
                    .queryParam("strictbounds", "false")
                    .build()
                    .toString();

            String response = restTemplate.getForObject(url, String.class);
            assert response != null;
            JSONObject jsonResponse = new JSONObject(response);
            return jsonResponse.getJSONArray("predictions");
        } catch (Exception e) {
            errorHandler.logVoid("Error fetching city suggestions: " + e.getMessage());
            return new JSONArray();
        }
    }

    //updates contactPublic
    @Override
    public boolean changeContactInfoPublic(HttpServletRequest request, boolean isPublic) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user != null) {
                user.setContactPublic(isPublic);
                repository.save(user);
                return user.getContactPublic();
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error changing contact info: " + e.getMessage());
        }
    }

    //returns contactPublic
    @Override
    public boolean fetchContactInfoPublic(HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user != null){
                if (user.getContactPublic() != null) return user.getContactPublic();
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error fetching contact info: " + e.getMessage());
        }
    }

    //returns contact info using map
    @Override
    public Map<String, String> fetchInfo(HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user != null) {
                HashMap<String, String> info = new HashMap<>();
                info.put("name", user.getName());
                info.put("phone", user.getPhone());
                info.put("city", user.getCity());
                return info;
            }
            return Collections.emptyMap();
        } catch (Exception e) {
            errorHandler.logVoid("Error fetching info: " + e.getMessage());
            return Collections.emptyMap();
        }
    }
}
