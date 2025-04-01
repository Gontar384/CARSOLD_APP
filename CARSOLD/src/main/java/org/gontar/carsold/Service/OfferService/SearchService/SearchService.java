package org.gontar.carsold.Service.OfferService.SearchService;

import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.springframework.data.domain.Page;

public interface SearchService {
    Page<PartialOfferDto> fetchFilteredOffers(OfferFilterDto filter, int page, int size);
}
