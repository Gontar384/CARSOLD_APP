package org.gontar.carsold.ServiceTest.OfferServiceTest.SearchServiceTest;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Service.OfferService.SearchService.OfferSpecifications;
import org.gontar.carsold.Service.OfferService.SearchService.SearchServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SearchServiceUnitTest {

    @InjectMocks
    private SearchServiceImpl searchService;

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private OfferSpecifications offerSpecifications;

    @Test
    public void fetchFilteredOffers_shouldReturnPage_whenOffersMatchCriteria() {
        OfferFilterDto filter = new OfferFilterDto();
        Offer mockOffer = new Offer();
        mockOffer.setId(1L);
        mockOffer.setTitle("Test Car");
        Page<Offer> mockPage = new PageImpl<>(List.of(mockOffer));

        when(offerSpecifications.withFilters(filter)).thenReturn(mock(Specification.class));
        when(offerRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(mockPage);

        Page<PartialOfferDto> result = searchService.fetchFilteredOffers(filter, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Car", result.getContent().getFirst().getTitle());
        verify(offerRepository).findAll(any(Specification.class), any(PageRequest.class));
    }

    @Test
    public void fetchFilteredOffers_shouldReturnEmptyPage_whenNoOffersMatchCriteria() {
        OfferFilterDto filter = new OfferFilterDto();
        Page<Offer> mockPage = Page.empty();

        when(offerSpecifications.withFilters(filter)).thenReturn(mock(Specification.class));
        when(offerRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(mockPage);

        Page<PartialOfferDto> result = searchService.fetchFilteredOffers(filter, 0, 10);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(offerRepository).findAll(any(Specification.class), any(PageRequest.class));
    }
}
