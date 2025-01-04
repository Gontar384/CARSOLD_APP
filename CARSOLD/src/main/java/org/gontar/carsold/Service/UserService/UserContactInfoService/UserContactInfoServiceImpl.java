package org.gontar.carsold.Service.UserService.UserContactInfoService;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.servlet.http.HttpServletRequest;
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

    public UserContactInfoServiceImpl(UserRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    //updates contact name, checks if name is proper name
    @Override
    public boolean changeName(String name, HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);

            boolean apiResponse = isValidName(name);
            if (apiResponse) {
                user.setName(name);
                repository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }


    //checks if the name is proper
    public boolean isValidName(String name) {
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

        if (polishSpecificNames.contains(name)) {
            return true;
        }

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
            JSONObject responseJson = new JSONObject(responseEntity.getBody());
            for (Object entityObj : responseJson.getJSONArray("entities")) {
                JSONObject entity = (JSONObject) entityObj;
                String entityType = entity.getString("type");
                if ("PERSON".equals(entityType)) {
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //updates contact phone, checks if number is proper
    @Override
    public boolean changePhone(String phone, HttpServletRequest request) {
        try {
            if (!phone.startsWith("+")) {
                phone = "+48" + phone;
            }

            PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();
            Phonenumber.PhoneNumber phoneNumber = phoneNumberUtil.parse(phone, "");

            //checks if valid
            if (!phoneNumberUtil.isValidNumber(phoneNumber)) {
                return false;
            }

            //formats
            String formattedPhoneNumber = phoneNumberUtil.format(phoneNumber, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);

            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            user.setPhone(formattedPhoneNumber);
            repository.save(user);

            return true;
        } catch (Exception e) {
            System.out.println("Error changing phone number: " + e.getMessage());
            return false;
        }
    }

    //updates contact city
    @Override
    public boolean changeCity(String city, HttpServletRequest request) {
        try {
            if (!isCityValid(city)) {
                return false;
            }

            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            user.setCity(city);
            repository.save(user);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //checks if city is valid
    private boolean isCityValid(String city) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/place/autocomplete/json")
                    .queryParam("input", city)
                    .queryParam("types", "(cities)")
                    .queryParam("key", placesApiKey)
                    .build()
                    .toString();

            String response = restTemplate.getForObject(url, String.class);
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray predictions = jsonResponse.getJSONArray("predictions");

            for (int i = 0; i < predictions.length(); i++) {
                JSONObject prediction = predictions.getJSONObject(i);
                String description = prediction.getString("description");

                if (description != null && description.equals(city)) {
                    return true;
                } else if (description != null && description.contains(",")) {
                    String cityNoCountry = description.split(",")[0].trim();
                    if (cityNoCountry.equals(city)) {
                        return true;
                    }
                }
            }
            return false;
        } catch (Exception e) {
            System.out.println("Error validating city: " + e.getMessage());
            return false;
        }
    }

    //fetches suggestions from Places API
    @Override
    public List<String> fetchCitySuggestions(String value) {
        RestTemplate restTemplate = new RestTemplate();
        String url = UriComponentsBuilder.fromUriString("https://maps.googleapis.com/maps/api/place/autocomplete/json")
                .queryParam("input", value)
                .queryParam("key", placesApiKey)
                .queryParam("types", "(cities)")
                .queryParam("location", "52.13,19.39")
                .queryParam("radius", "500000")
                .queryParam("strictbounds", "false")
                .build()
                .toString();

        String response = restTemplate.getForObject(url, String.class);

        //parses JSON, extracts city names
        JSONObject jsonResponse = new JSONObject(response);
        JSONArray predictions = jsonResponse.getJSONArray("predictions");

        List<String> cityNames = new ArrayList<>();
        for (int i = 0; i < predictions.length(); i++) {
            JSONObject prediction = predictions.getJSONObject(i);
            cityNames.add(prediction.getString("description"));
        }

        return cityNames;
    }

    //updates contactPublic
    @Override
    public boolean changeContactInfoPublic(HttpServletRequest request, boolean isPublic) {
        try {
            String jwt = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            user.setContactPublic(isPublic);
            repository.save(user);
            return user.getContactPublic();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //returns contactPublic
    @Override
    public boolean fetchContactInfoPublic(HttpServletRequest request) {
        try {
            String jwt = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(jwt);
            User user = repository.findByUsername(username);
            return user.getContactPublic();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    //returns contact info using map
    @Override
    public Map<String, String> fetchInfo(HttpServletRequest request) {
        try {
            String token = jwtService.extractTokenFromCookie(request);
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            HashMap<String, String> info = new HashMap<>();
            info.put("name", user.getName());
            info.put("phone", user.getPhone());
            info.put("city", user.getCity());
            return info;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
