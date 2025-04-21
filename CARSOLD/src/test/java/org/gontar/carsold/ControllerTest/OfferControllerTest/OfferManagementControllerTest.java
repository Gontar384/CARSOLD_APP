package org.gontar.carsold.ControllerTest.OfferControllerTest;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Controller.OfferController.OfferManagementController;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.Offer.OfferDto;
import org.gontar.carsold.Domain.Model.Offer.OfferWithUserDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementService;
import org.gontar.carsold.TestEnvConfig.TestEnvConfig;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class OfferManagementControllerTest {

    @InjectMocks
    private OfferManagementController offerManagementController;

    @Mock
    private OfferManagementService offerManagementService;

    @Mock
    private Mapper<Offer, OfferDto> mapper;

    private MockMvc mockMvc;

    @BeforeAll
    public static void init() {
        TestEnvConfig.loadEnv();
    }

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(offerManagementController).build();
    }

    @Test
    public void createOffer() throws Exception {
        OfferDto offerDto = new OfferDto();
        Offer offer = new Offer();
        Offer createdOffer = new Offer();
        createdOffer.setId(1L);

        when(mapper.mapToEntity(any(OfferDto.class))).thenReturn(offer);
        when(offerManagementService.createOffer(any(Offer.class), any())).thenReturn(createdOffer);
        when(mapper.mapToDto(any(Offer.class))).thenReturn(offerDto);

        MockMultipartFile offerPart = new MockMultipartFile("offer", "", "application/json", "{}".getBytes());

        mockMvc.perform(multipart("/api/offer/add")
                        .file(offerPart)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"));
    }

    @Test
    public void fetchOffer() throws Exception {
        Offer offer = new Offer();
        OfferDto offerDto = new OfferDto();

        when(offerManagementService.fetchOffer(1L)).thenReturn(offer);
        when(offerManagementService.fetchPermission(offer)).thenReturn(true);
        when(mapper.mapToDto(any(Offer.class))).thenReturn(offerDto);

        mockMvc.perform(get("/api/offer/fetch/1"))
                .andExpect(status().isOk())
                .andExpect(header().string("user-permission", "true"));
    }

    @Test
    public void updateOffer() throws Exception {
        OfferDto offerDto = new OfferDto();
        Offer offer = new Offer();
        Offer updatedOffer = new Offer();

        when(mapper.mapToEntity(any(OfferDto.class))).thenReturn(offer);
        when(offerManagementService.updateOffer(eq(1L), any(Offer.class), any())).thenReturn(updatedOffer);
        when(mapper.mapToDto(any(Offer.class))).thenReturn(offerDto);

        MockMultipartFile offerPart = new MockMultipartFile("offer", "", "application/json", "{}".getBytes());

        mockMvc.perform(multipart("/api/offer/update/1")
                        .file(offerPart)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk());
    }

    @Test
    public void fetchAllUserOffers() throws Exception {
        List<PartialOfferDto> partialOfferDtos = List.of(new PartialOfferDto(), new PartialOfferDto());
        when(offerManagementService.fetchAllUserOffers()).thenReturn(partialOfferDtos);

        mockMvc.perform(get("/api/offer/fetchAllUser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$" ).isArray())
                .andExpect(jsonPath("$.length()" ).value(2));
    }

    @Test
    public void fetchOfferWithUser() throws Exception {
        OfferWithUserDto offerWithUserDto = new OfferWithUserDto();
        when(offerManagementService.fetchOfferWithUser(1L)).thenReturn(offerWithUserDto);

        mockMvc.perform(get("/api/offer/fetchWithUser/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteOffer() throws Exception {
        mockMvc.perform(delete("/api/offer/delete/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void fetchRandomOffers_shouldReturnListOfOffers() throws Exception {
        List<PartialOfferDto> mockOffers = List.of(
                new PartialOfferDto(), new PartialOfferDto(), new PartialOfferDto()
        );

        when(offerManagementService.fetchRandomOffers()).thenReturn(mockOffers);

        mockMvc.perform(get("/api/offer/fetchRandom"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));
    }
}
