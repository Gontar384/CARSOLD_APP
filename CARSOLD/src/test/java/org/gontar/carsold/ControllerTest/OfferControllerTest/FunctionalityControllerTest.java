package org.gontar.carsold.ControllerTest.OfferControllerTest;

import org.gontar.carsold.Controller.OfferController.FunctionalityController;
import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Domain.Model.Universal.SingleBooleanDto;
import org.gontar.carsold.Service.OfferService.FunctionalityService.FunctionalityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class FunctionalityControllerTest {

    @InjectMocks
    private FunctionalityController functionalityController;

    @Mock
    private FunctionalityService functionalityService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(functionalityController).build();
    }

    @Test
    public void fetchStats() throws Exception {
        OfferStatsDto offerStatsDto = new OfferStatsDto();
        when(functionalityService.fetchStats(1L)).thenReturn(offerStatsDto);

        mockMvc.perform(get("/api/offer/fetchStats/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void fetchAllFollowed() throws Exception {
        List<PartialOfferDto> followedOffers = List.of(new PartialOfferDto());
        when(functionalityService.fetchAllFollowed()).thenReturn(followedOffers);

        mockMvc.perform(get("/api/offer/fetchAllFollowed"))
                .andExpect(status().isOk());
    }

    @Test
    public void followAndCheck() throws Exception {
        SingleBooleanDto requestBody = new SingleBooleanDto();
        requestBody.setValue(true);

        when(functionalityService.followAndCheck(eq(1L), any(Boolean.class))).thenReturn(true);

        mockMvc.perform(patch("/api/offer/followAndCheck/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":true}"))
                .andExpect(status().isOk());
    }

    @Test
    public void reportOffer_shouldReturnOk() throws Exception {
        String jsonBody = """
            {
            "offerId": 1,
            "reason": "Scam listing"
            }
            """;
        doNothing().when(functionalityService).reportOffer(1L, "Scam listing");

        mockMvc.perform(post("/api/offer/report")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isOk());
    }
}
