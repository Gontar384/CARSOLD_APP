package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Service.OfferService.SearchService.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/offer")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public ResponseEntity<List<PartialOfferDto>> fetchFilteredOffers(OfferFilterDto filter) {
        List<PartialOfferDto> offers = service.fetchFilteredOffers(filter);
        return ResponseEntity.ok(offers);
    }
}
