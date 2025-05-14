//package org.gontar.carsold.ControllerTest.OfferControllerTest;
//
//import org.gontar.carsold.Controller.OfferController.SearchController;
//import org.gontar.carsold.Domain.Model.Offer.OfferFilterDto;
//import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
//import org.gontar.carsold.Service.OfferService.SearchService.SearchService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.web.PagedResourcesAssembler;
//import org.springframework.hateoas.EntityModel;
//import org.springframework.hateoas.PagedModel;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import java.util.List;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyInt;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//
//@ExtendWith(MockitoExtension.class)
//public class SearchControllerTest {
//
//    @InjectMocks
//    private SearchController searchController;
//
//    @Mock
//    private SearchService searchService;
//
//    @Mock
//    private PagedResourcesAssembler<PartialOfferDto> assembler;
//
//    private MockMvc mockMvc;
//
//    @BeforeEach
//    public void setUp() {
//        mockMvc = MockMvcBuilders.standaloneSetup(searchController).build();
//    }
//
//    @Test
//    public void fetchFilteredOffers() throws Exception {
//        List<PartialOfferDto> offersList = List.of(new PartialOfferDto());
//        Page<PartialOfferDto> offersPage = new PageImpl<>(offersList);
//        PagedModel<EntityModel<PartialOfferDto>> pagedModel = PagedModel.empty();
//
//        when(searchService.fetchFilteredOffers(any(OfferFilterDto.class), anyInt(), anyInt()))
//                .thenReturn(offersPage);
//        lenient().when(assembler.toModel(offersPage)).thenReturn(pagedModel);
//
//        mockMvc.perform(get("/api/offer/search")
//                        .param("page", "0")
//                        .param("size", "8")
//                        .param("brand", "Toyota")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
//    }
//}
