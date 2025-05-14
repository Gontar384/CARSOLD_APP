//package org.gontar.carsold.ControllerTest.UserControllerTest;
//
//import org.gontar.carsold.Controller.UserController.ContactInfoController;
//import org.gontar.carsold.Service.UserService.ContactInfoService.ContactInfoService;
//import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
//import org.gontar.carsold.Domain.Model.User.CitySuggestionsDto;
//import org.gontar.carsold.Domain.Model.User.ContactInfoDto;
//import org.gontar.carsold.Domain.Model.Universal.SingleBooleanDto;
//import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.junit.jupiter.api.extension.ExtendWith;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import java.util.List;
//
//@ExtendWith(MockitoExtension.class)
//class ContactInfoControllerTest {
//
//    @InjectMocks
//    private ContactInfoController contactInfoController;
//
//    @Mock
//    private ContactInfoService contactInfoService;
//
//    private MockMvc mockMvc;
//
//    @BeforeAll
//    public static void init() {
//        TestEnvConfig.loadEnv();
//    }
//
//    @BeforeEach
//    public void setUp() {
//        mockMvc = MockMvcBuilders.standaloneSetup(contactInfoController).build();
//    }
//
//    @Test
//    public void updateName() throws Exception {
//        SingleStringDto singleStringDto = new SingleStringDto("John");
//
//        mockMvc.perform(patch("/api/updateName")
//                        .contentType("application/json")
//                        .content(new ObjectMapper().writeValueAsString(singleStringDto)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void updatePhone() throws Exception {
//        SingleStringDto singleStringDto = new SingleStringDto("603604605");
//
//        mockMvc.perform(patch("/api/updatePhone")
//                        .contentType("application/json")
//                        .content(new ObjectMapper().writeValueAsString(singleStringDto)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void updateCity() throws Exception {
//        SingleStringDto singleStringDto = new SingleStringDto("Poznań, Poland");
//
//        mockMvc.perform(patch("/api/updateCity")
//                        .contentType("application/json")
//                        .content(new ObjectMapper().writeValueAsString(singleStringDto)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void fetchCitySuggestions() throws Exception {
//        String city = "Wa";
//        CitySuggestionsDto citySuggestionsDto = new CitySuggestionsDto();
//        citySuggestionsDto.setCitySuggestions(List.of("Warsaw, Poland", "Wałbrzych, Poland", "Wagrain, Austria", "Waalwijk, Netherlands", "Wageningen, Netherlands"));
//
//        when(contactInfoService.fetchCitySuggestions(city)).thenReturn(citySuggestionsDto);
//
//        mockMvc.perform(get("/api/fetchCitySuggestions")
//                        .param("value", city))
//                .andExpect(status().isOk())
//                .andExpect(content().json(new ObjectMapper().writeValueAsString(citySuggestionsDto)));
//    }
//
//    @Test
//    public void updateAndFetchContactPublic() throws Exception {
//        SingleBooleanDto singleBooleanDto = new SingleBooleanDto(true);
//        SingleBooleanDto response = new SingleBooleanDto(true);
//
//        when(contactInfoService.updateAndFetchContactPublic(true)).thenReturn(true);
//
//        mockMvc.perform(patch("/api/updateAndFetchContactPublic")
//                        .contentType("application/json")
//                        .content(new ObjectMapper().writeValueAsString(singleBooleanDto)))
//                .andExpect(status().isOk())
//                .andExpect(content().json(new ObjectMapper().writeValueAsString(response)));
//    }
//
//    @Test
//    public void fetchContactInfo() throws Exception {
//        ContactInfoDto contactInfoDto = new ContactInfoDto("John", "+48 603 604 605", "Poznań, Poland");
//        when(contactInfoService.fetchContactInfo()).thenReturn(contactInfoDto);
//
//        mockMvc.perform(get("/api/fetchContactInfo"))
//                .andExpect(status().isOk())
//                .andExpect(content().json(new ObjectMapper().writeValueAsString(contactInfoDto)));
//    }
//}