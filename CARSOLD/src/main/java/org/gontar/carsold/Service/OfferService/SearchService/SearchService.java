package org.gontar.carsold.Service.OfferService.SearchService;

import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;

import java.util.List;

public interface SearchService {
    List<PartialOfferDto> fetchFilteredOffers(OfferFilterDto filter);
}
