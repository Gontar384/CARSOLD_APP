package org.gontar.carsold.Service.OfferService.FunctionalityService;

import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.springframework.data.domain.Page;

public interface FunctionalityService {
    OfferStatsDto fetchStats(Long id);
    Page<PartialOfferDto> fetchAllFollowed(int page, int size);
    boolean followAndCheck(Long id, Boolean follow);
    void reportOffer(Long id, String reason);
}
