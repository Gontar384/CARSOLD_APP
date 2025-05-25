package org.gontar.carsold.ControllerTest.OfferControllerTest;

import org.gontar.carsold.Controller.OfferController.FunctionalityController;
import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Service.OfferService.FunctionalityService.FunctionalityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class FunctionalityControllerTest {

    @InjectMocks
    private FunctionalityController functionalityController;

    @Mock
    private FunctionalityService functionalityService;

    @Mock
    private PagedResourcesAssembler<PartialOfferDto> pagedResourcesAssembler;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(functionalityController).build();
    }

    @Test
    public void fetchStats() throws Exception {
        OfferStatsDto offerStatsDto = new OfferStatsDto();
        when(functionalityService.fetchStats(1L)).thenReturn(offerStatsDto);

        mockMvc.perform(get("/api/private/offer/fetchStats/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void fetchAllFollowed_shouldReturnOk() throws Exception {
        List<PartialOfferDto> content = List.of(new PartialOfferDto(), new PartialOfferDto());
        Page<PartialOfferDto> page = new PageImpl<>(content);
        PagedModel<EntityModel<PartialOfferDto>> pagedModel = PagedModel.empty();

        when(functionalityService.fetchAllFollowed(0, 3)).thenReturn(page);
        lenient().when(pagedResourcesAssembler.toModel(page)).thenReturn(pagedModel);

        mockMvc.perform(get("/api/private/offer/fetchAllFollowed"))
                .andExpect(status().isOk());
    }

    @Test
    public void followAndCheck() throws Exception {
        when(functionalityService.followAndCheck(eq(1L), eq(true))).thenReturn(true);

        mockMvc.perform(patch("/api/private/offer/followAndCheck/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\":true}"))
                .andExpect(status().isOk());
    }

    @Test
    public void reportOffer_shouldReturnOk() throws Exception {
        String jsonBody = """
            {
            "offerId": 1,
            "reason": "Impersonification"
            }
            """;
        doNothing().when(functionalityService).reportOffer(1L, "Impersonification");

        mockMvc.perform(post("/api/private/offer/report")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isOk());
    }
}
