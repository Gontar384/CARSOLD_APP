package org.gontar.carsold.Service.OfferService.OfferFunctionalityService;

import org.gontar.carsold.Domain.Model.OfferStatsDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;

import java.util.List;

public interface OfferFunctionalityService {
    boolean followAndCheck(Long id, Boolean follow);
    OfferStatsDto fetchStats(Long id);
    List<PartialOfferDto> fetchAllFollowed();
}
