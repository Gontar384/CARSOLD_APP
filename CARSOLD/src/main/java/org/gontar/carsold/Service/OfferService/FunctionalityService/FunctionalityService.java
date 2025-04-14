package org.gontar.carsold.Service.OfferService.FunctionalityService;

import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;

import java.util.List;

public interface FunctionalityService {
    OfferStatsDto fetchStats(Long id);
    List<PartialOfferDto> fetchAllFollowed();
    boolean followAndCheck(Long id, Boolean follow);
    void reportOffer(Long id, String reason);
}
