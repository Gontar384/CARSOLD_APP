package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.Offer.OfferFilterDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Service.OfferService.SearchService.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service) {
        this.service = service;
    }

    @GetMapping("/public/offer/search")
    public ResponseEntity<PagedModel<EntityModel<PartialOfferDto>>> fetchFilteredOffers(
            OfferFilterDto filter, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "8") int size,
            PagedResourcesAssembler<PartialOfferDto> assembler) {
        Page<PartialOfferDto> offers = service.fetchFilteredOffers(filter, page, size);
        PagedModel<EntityModel<PartialOfferDto>> pagedModel = assembler.toModel(offers);
        return ResponseEntity.ok(pagedModel);
    }
}
